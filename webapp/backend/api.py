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
    
    # Enhanced output format template
    format_instruction = """
【出力フォーマット】
以下の構成で、算命学の鑑定結果を深く読み解いてください。Markdownフォーマットで出力してください。

1. **導入** - 「伝承の世界へようこそ」のような格調高い歓迎の言葉と、帝王学・算命学の意義を簡潔に述べる

2. **宿命の根幹** - 日干の五行（甲乙丙丁戊己庚辛壬癸）と自然界での例え、性質の解説。宿命天中殺や特殊な命式があれば言及

3. **精神構造** - 陽占（人体星図）から見える精神的特徴。中心星を重視し、陽転・陰転の条件を解説

4. **エネルギー診断** - 総エネルギー値と十二大従星の平均値から「排気口」のバランスを診断。具体的な数値と計算式を示す

5. **行動領域と八門法** - 八門法の数値分布から、どの領域が強く/弱いかを分析。活かし方のアドバイス

6. **時の活用** - 現在の大運、来るべき天中殺のタイミング、今すべきことの具体的提案

7. **帝王のアドバイス** - 第六感を呼び覚ますための一言、座右の銘となるような核心的メッセージ

8. **次への問いかけ** - 「次はどのような課題について深掘りしたいですか？」のような対話継続の誘導

**重要**: 
- 専門用語には必ず読み仮名や簡潔な説明を添える
- 具体的な数値・計算式を示して説得力を持たせる
- **太字**やリストを効果的に使い、読みやすくする
- 1500〜2500文字程度で詳しく、かつ読みやすく構成する
"""

    system_context = f"""{persona_instruction}

{depth_instruction}

{format_instruction}

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

上記のフォーマットに従って、この人の宿命を読み解いてください。"""
            
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
