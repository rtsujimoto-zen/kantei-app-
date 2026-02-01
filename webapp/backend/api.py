from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import uvicorn
import os
import json
import tempfile
from sanmei_engine import SanmeiEngine

# Vertex AI imports
# Vertex AI imports
from google import genai
from google.genai.types import HttpOptions

app = FastAPI()

# ============================================
# CORS (Cross-Origin Resource Sharing) Setup
# ============================================
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:3000",
    "https://kantei-app.onrender.com",
    "https://app.the-zen-terra.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# Calculation Endpoint
# ============================================
class CalcRequest(BaseModel):
    birthday: str
    gender: str

@app.post("/calculate")
def calculate(req: CalcRequest):
    try:
        # Parse birthday string "YYYY-MM-DD"
        y, m, d = map(int, req.birthday.split("-"))
        
        # Instantiate Engine with correct arguments
        engine = SanmeiEngine(y, m, d)
        
        # Get structured report
        report = engine.get_full_report(req.gender)
        
        # Generate text representation for AI context
        text_report = engine.format_as_text_report(report)
        report["output_text"] = text_report
        
        return {"report": report}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Error: {e}") # Add logging for debugging
        raise HTTPException(status_code=500, detail="Internal Server Error")

# ============================================
# AI Strategist Endpoint (Vertex AI via google-genai)
# ============================================

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class AiConsultRequest(BaseModel):
    report: dict
    persona: str = "jiya"
    depth: str = "professional"
    model: str = "gemini-3.0-pro-high" # New field
    message: Optional[str] = None
    history: list[ChatMessage] = []

@app.post("/ai/consult")
def ai_consult(req: AiConsultRequest):
    # Initialize Google Gen AI Client
    project_id = os.environ.get("GOOGLE_CLOUD_PROJECT")
    # Gemini 3 Preview models require the GLOBAL endpoint, not regional
    location = "global"
    
    try:
        client = genai.Client(
            vertexai=True,
            project=project_id, 
            location=location
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GenAI Client initialization failed: {str(e)}")
    
    # ... (prompt building code) ...
    if req.persona == "jiya":
        persona_instruction = """あなたは「老執事」です。長年主人に仕えてきた知恵深い執事として、
丁寧かつ温かみのある口調で算命学の鑑定結果を解説してください。
「〜でございます」「〜かと存じます」のような敬語を使い、相手を「あなた様」と呼んでください。"""
    else:
        persona_instruction = """あなたは「厳格な師匠」です。算命学の厳しい師匠として、
的確かつ簡潔に鑑定結果を解説してください。
「〜だ」「〜である」のような断定的な口調を使い、相手を「お主」と呼んでください。"""
    
    if req.depth == "beginner":
        depth_instruction = "専門用語は避け、初心者にも分かりやすく説明してください。"
    else:
        depth_instruction = "算命学の専門用語を適切に使い、深い洞察を提供してください。"
    
    output_text = req.report.get("output_text", "鑑定データがありません")
    
    system_context = f"""{persona_instruction}

{depth_instruction}

以下はこの人の算命学鑑定結果です：

{output_text}"""

    # 4. Generate Content (Chat or Single)
    # 4. Generate Content (Chat or Single)
    try:
        # Determine Model and Config
        model_name = "gemini-3-pro-preview"
        config = None

        if req.model == "gemini-3.0-pro-high":
            model_name = "gemini-3-pro-preview"
            config = genai.types.GenerateContentConfig(
                thinking_config=genai.types.ThinkingConfig(
                    thinking_level="HIGH"
                )
            )
        elif req.model == "gemini-3.0-pro-low":
             model_name = "gemini-3-pro-preview"
             # No thinking config (Standard/Low reasoning)
        elif req.model == "gemini-flash":
             model_name = "gemini-3-flash-preview"
        
        if req.message and len(req.history) > 0:
            contents = []
            for msg in req.history:
                role = "user" if msg.role == "user" else "model"
                contents.append(genai.types.Content(
                    role=role,
                    parts=[genai.types.Part.from_text(text=msg.content)]
                ))
            
            full_prompt = f"{system_context}\n\nユーザーからの追加質問: {req.message}"
            contents.append(genai.types.Content(
                role="user",
                parts=[genai.types.Part.from_text(text=full_prompt)]
            ))

            response = client.models.generate_content(
                model=model_name,
                contents=contents,
                config=config
            )
        else:
            prompt = f"""{system_context}

この人の本質、強み、弱み、そして人生のアドバイスを300〜500文字程度で述べてください。"""
            
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=config
            )
        
        return {"response": response.text}
    except Exception as e:
        print(f"GenAI Error: {e}")
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
