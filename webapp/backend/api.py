from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import datetime
import sys
import os

# Add project root to sys.path to access sanmei_engine.py
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from sanmei_engine import SanmeiEngine

app = FastAPI(title="Teiou Logic API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
