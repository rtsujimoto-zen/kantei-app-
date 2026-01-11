from sanmei_engine import SanmeiEngine
import datetime

test_cases = [
    (1981, 4, 27, "M"),
    (1999, 12, 31, "F"),
    (2005, 6, 15, "M"),
    (1958, 8, 25, "F"),
    (2011, 3, 11, "M")
]

target_years = [2026, 2030, 2040] # 検証対象の年

with open("verification_nenun_5cases_log.txt", "w", encoding="utf-8") as f:
    for y, m, d, g in test_cases:
        f.write(f"\n{'='*30}\n")
        f.write(f"CASE: {y}/{m}/{d} ({g})\n")
        f.write(f"{'='*30}\n")
        
        engine = SanmeiEngine(y, m, d)
        report = engine.get_full_report(g)
        nenun = report['年運']
        
        f.write(f"{'西暦':>5} | {'干支':^4} | {'十大主星':^6} | {'十二大従星':^5} | {'位相法':<20} | {'天中殺':<5}\n")
        f.write("-" * 70 + "\n")
        
        for data in nenun:
            if data["西暦"] in target_years:
                isouhou_str = ", ".join(data["位相法"])
                f.write(f"{data['西暦']:>5} | {data['干支']:^4} | {data['十大主星']:^6} | {data['十二大従星']:^6} | {isouhou_str:<20} | {data['天中殺']:<5}\n")
                
print("Nenun verification log generated.")
