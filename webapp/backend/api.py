from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import uvicorn
import os
import json
import tempfile
from sanmei_engine import SanmeiEngine

# Vertex AI imports
import vertexai
from vertexai.generative_models import GenerativeModel, ChatSession
from google.oauth2 import service_account

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
# AI Strategist Endpoint (Vertex AI)
# ============================================

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class AiConsultRequest(BaseModel):
    report: dict
    persona: str = "jiya"  # "jiya" or "master"
    depth: str = "professional"  # "professional" or "beginner"
    message: Optional[str] = None  # Follow-up message
    history: list[ChatMessage] = []  # Chat history

@app.post("/ai/consult")
def ai_consult(req: AiConsultRequest):
    # 1. Initialize Vertex AI with ADC (Application Default Credentials)
    # Cloud Run automatically provides credentials via the Metadata Server.
    project_id = os.environ.get("GOOGLE_CLOUD_PROJECT")
    location = os.environ.get("GOOGLE_CLOUD_REGION", "us-central1")
    
    try:
        # No explicit credentials needed for Cloud Run
        vertexai.init(project=project_id, location=location)
        model = GenerativeModel("gemini-1.5-pro")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vertex AI initialization failed: {str(e)}")
    
    # 3. Build prompts
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
    try:
        if req.message and len(req.history) > 0:
            # Build history for Vertex AI Chat
            vertex_history = []
            for msg in req.history:
                vertex_history.append({
                    "role": "user" if msg.role == "user" else "model",
                    "parts": [{"text": msg.content}]
                })
            
            chat = model.start_chat(history=vertex_history)
            response = chat.send_message(f"{system_context}\n\nユーザーからの追加質問: {req.message}")
        else:
            # Initial consultation
            prompt = f"""{system_context}

この人の本質、強み、弱み、そして人生のアドバイスを300〜500文字程度で述べてください。"""
            response = model.generate_content(prompt)
        
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
