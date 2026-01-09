from sanmei_engine import SanmeiEngine
import datetime

test_cases = [
    ("1999/11/08", "M"), # 期待: 生月中殺, 異常干支(乙亥)
    ("1986/05/10", "F"), # 期待: 異常干支(癸巳)
    ("1992/04/18", "M"), # 壬申、甲辰、甲子
    ("1980/01/01", "M"), # 己未、丙子、癸酉
    ("2024/02/04", "F"), # 甲辰、丙寅、戊戌
    ("1911/11/11", "F"), # 辛亥、己亥、乙酉
    ("1945/08/15", "M"), # 乙酉、甲申、丙辰
    ("2000/01/01", "M"), # 己卯、丙子、戊午
    ("1978/04/01", "F"), # 戊午、乙卯、癸巳
    ("1990/08/22", "F"), # 庚午、甲申、庚申
]

print(f"{'日付':<12} | {'性別':<2} | {'天中殺グループ':<8} | {'宿命天中殺':<20} | {'異常干支':<20}")
print("-" * 80)

for date_str, gender in test_cases:
    y, m, d = map(int, date_str.split("/"))
    engine = SanmeiEngine(y, m, d)
    report = engine.get_full_report(gender)
    
    tenchu_group = report['天中殺']['グループ']
    shukumei = ", ".join(report['天中殺']['宿命天中殺']) if report['天中殺']['宿命天中殺'] else "なし"
    ijou = ", ".join(report['異常干支']) if report['異常干支'] else "なし"
    
    print(f"{date_str:<12} | {gender:<2} | {tenchu_group:<8} | {shukumei:<20} | {ijou:<20}")
