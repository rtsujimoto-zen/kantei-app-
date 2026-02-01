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

class AiConsultRequest(BaseModel):
    report: dict
    persona: str = "jiya"  # "jiya" or "master"
    depth: str = "professional"  # "professional" or "beginner"

@app.post("/ai/consult")
def ai_consult(req: AiConsultRequest):
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not configured")
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    
    # Build persona-specific prompt
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
    
    # Extract key info from report
    insen = req.report.get("陰占", {})
    yosen = req.report.get("陽占", {})
    tenchusatsu = req.report.get("天中殺", {})
    
    prompt = f"""{persona_instruction}

{depth_instruction}

以下の算命学鑑定結果を解説してください：

【陰占】
日干: {insen.get('日', '不明')}
月干: {insen.get('月', '不明')}
年干: {insen.get('年', '不明')}

【陽占・十大主星】
胸（中心）: {yosen.get('十大主星', {}).get('胸', '不明')}
頭（北）: {yosen.get('十大主星', {}).get('頭', '不明')}
左手（東）: {yosen.get('十大主星', {}).get('左手', '不明')}
右手（西）: {yosen.get('十大主星', {}).get('右手', '不明')}
腹（南）: {yosen.get('十大主星', {}).get('腹', '不明')}

【天中殺】
グループ: {tenchusatsu.get('グループ', '不明')}天中殺

この人の本質、強み、弱み、そして人生のアドバイスを300〜500文字程度で述べてください。"""

    try:
        response = model.generate_content(prompt)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

