from sanmei_engine import SanmeiEngine

# Test Cases
# 1. 日居中殺: 甲辰日 (例: 2024/4/11 が甲辰)
# 2. 暗合異常干支: 辛巳日 (例: 2001/5/20)
# 3. 通常異常干支: 丁巳日 (例: 2024/5/28, リスト追加確認)

cases = [
    {"date": (2024, 4, 11), "desc": "Nikkyo Tenchusatsu (Kinoe-Tatsu)", "expect": "日居中殺"},
    {"date": (2001, 5, 20), "desc": "Ango Ijou Kanshi (Kanoto-Mi)", "expect": "暗合異常干支"},
    {"date": (2024, 6, 22), "desc": "Normal Ijou Kanshi (Hinoto-Mi 54)", "expect": "通常異常干支"}
]

print("=== Special Logic Verification ===")
for c in cases:
    y, m, d = c["date"]
    engine = SanmeiEngine(y, m, d)
    report = engine.get_full_report("M")
    
    print(f"\n--- {c['desc']} ({y}/{m}/{d}) ---")
    
    # Check Tenchusatsu
    tm = report['天中殺']['宿命天中殺']
    print(f"Shukumei Tenchusatsu: {tm}")
    
    # Check Ijou Kanshi
    im = report['異常干支']
    print(f"Ijou Kanshi: {im}")
    
    # Validation
    found = False
    if c['expect'] in str(tm) or c['expect'] in str(im):
        found = True
    
    print(f"Result: {'[PASS]' if found else '[FAIL]'} (Expected '{c['expect']}')")
