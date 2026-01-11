from sanmei_engine import SanmeiEngine
import datetime

test_cases = [
    (1981, 4, 27, "M"),
    (1999, 12, 31, "F"),
    (2005, 6, 15, "M"),
    (1958, 8, 25, "F"),
    (2011, 3, 11, "M")
]

# 検証したい年（直近20年の中からピックアップ）
target_check_year = 2030

with open("full_verification_nenun.txt", "w", encoding="utf-8") as f:
    for y, m, d, g in test_cases:
        f.write(f"\n{'='*40}\n")
        f.write(f"CASE: {y}/{m}/{d} ({g})\n")
        f.write(f"{'='*40}\n")
        
        engine = SanmeiEngine(y, m, d)
        report = engine.get_full_report(g)
        
        if "年運" not in report:
            f.write("ERROR: Nenun data missing!\n")
            continue

        nenun = report["年運"]
        current_year = 2026 # datetime.datetime.now().year assuming verify time
        
        # main.py と同じようなヘッダー
        f.write(f" {'年齢':>3} {'(西暦)':>5} | {'干支':^4} | {'十大主星':^6} | {'十二大従星':^5} | {'位相法':<20} | {'天中殺':<5}\n")
        f.write("-" * 80 + "\n")

        for data in nenun:
            # 2026年から2045年まで（20年分）を表示
            if data["西暦"] >= current_year and data["西暦"] < current_year + 20:
                 isouhou_str = ", ".join(data["位相法"])
                 age = data["年齢"]
                 marker = " <--- CHECK" if data["西暦"] == target_check_year else ""
                 f.write(f" {age:>3} ({data['西暦']:>5}) | {data['干支']:^4} | {data['十大主星']:^6} | {data['十二大従星']:^6} | {isouhou_str:<20} | {data['天中殺']:<5}{marker}\n")
