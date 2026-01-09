from sanmei_engine import SanmeiEngine
import sys

test_cases = [
    (1981, 4, 27, "M"),
    (1999, 12, 31, "F"),
    (2005, 6, 15, "M"),
    (1958, 8, 25, "F"),
    (2011, 3, 11, "M")
]

with open("verification_5cases_log.txt", "w", encoding="utf-8") as f:
    for y, m, d, g in test_cases:
        f.write(f"\n{'='*30}\n")
        f.write(f"CASE: {y}/{m}/{d} ({g})\n")
        f.write(f"{'='*30}\n")
        
        engine = SanmeiEngine(y, m, d)
        report = engine.get_full_report(g)
        
        # Output Daiun Table
        daiun = report['大運']
        f.write(f"立運: {daiun['立運']} ({daiun['方向']})\n")
        f.write(f"{'年齢':>3} {'(西暦)':>5} | {'干支':^4} | {'位相法':<25} | {'天中殺':<6}\n")
        f.write("-" * 60 + "\n")
        
        for cycle in daiun["サイクル"]:
            age = cycle['年齢']
            year = cycle['西暦']
            kanshi = cycle['干支']
            isouhou = ", ".join(cycle['位相法'])
            tenchu = cycle['天中殺']
            f.write(f"{age:>3} ({year:>4}) | {kanshi:^4} | {isouhou:<25} | {tenchu:<6}\n")
            
print("Verification log generated.")
