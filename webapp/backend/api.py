from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import datetime
import sys
import os

# Add project root to sys.path to access sanmei_engine.py
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.insert(0, project_root)
from sanmei_engine import SanmeiEngine

app = FastAPI(title="Teiou Logic API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for now, restrict after deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CalculationRequest(BaseModel):
    birthday: str  # YYYY-MM-DD or YYYY/MM/DD
    gender: str    # "M" or "F"

@app.get("/")
def read_root():
    return {"status": "ok", "service": "Teiou Logic API"}

@app.post("/calculate")
def calculate(req: CalculationRequest):
    try:
        # Date Parsing
        date_str = req.birthday.replace("/", "-")
        y, m, d = map(int, date_str.split("-"))
        
        engine = SanmeiEngine(y, m, d)
        report = engine.get_full_report(req.gender)
        
        # Add Tenchusatsu Timing (Extension)
        timing = engine.get_tenchusatsu_timing_info()
        if timing:
            report["天中殺"]["タイミング"] = timing
            
        # Add Aliases for Junidai Jusei (Frontend convenience)
        # 陽占の十二大従星に言い換えを追加した辞書を作成
        junidai_with_alias = {}
        if "十二大従星" in report["陽占"]:
            for k, v in report["陽占"]["十二大従星"].items():
                base_name = v.replace("星", "")
                alias = SanmeiEngine.JUNIDAI_JUSEI_KEYWORDS.get(base_name, "")
                junidai_with_alias[k] = {"name": v, "alias": alias, "full": f"{v} {alias}"}
            report["陽占"]["十二大従星詳細"] = junidai_with_alias

        # Add Prompt-Ready Text Output
        report["output_text"] = engine.format_as_text_report(report)

        return report

    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# AI Strategist Endpoint (Vertex AI / Gemini)
# ============================================
import google.generativeai as genai

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
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not configured")
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    
    # Build persona-specific system instruction
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

    try:
        # If this is a follow-up message, use chat history
        if req.message and len(req.history) > 0:
            # Build conversation history for Gemini
            gemini_history = []
            for msg in req.history:
                gemini_history.append({
                    "role": "user" if msg.role == "user" else "model",
                    "parts": [msg.content]
                })
            
            chat = model.start_chat(history=gemini_history)
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

