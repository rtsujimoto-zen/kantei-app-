from sanmei_engine import SanmeiEngine
import sys

def main():
    print("=== 算命学 宿命鑑定ツール ===")
    try:
        birth = input("生年月日を入力してください (例: 1988/03/21): ")
        year, month, day = map(int, birth.split("/"))
        gender = input("性別を入力して下さい (M/F): ").upper()
    except Exception as e:
        print("入力形式が正しくありません。")
        return

    engine = SanmeiEngine(year, month, day)
    report = engine.get_full_report(gender)

    print("\n--- 陰占 (命式) ---")
    for k, v in report["陰占"].items():
        print(f"{k}: {v}")

    print("\n--- 陽占 (人体星図) ---")
    print("【十大主星】")
    for k, v in report["陽占"]["十大主星"].items():
        print(f"  {k}: {v}")
    print("【十二大従星】")
    for k, v in report["陽占"]["十二大従星"].items():
        print(f"  {k}: {v}")

    print(f"\n天中殺グループ: {report['天中殺']['グループ']}天中殺")
    if report['天中殺']['宿命天中殺']:
        print(f"宿命天中殺: {', '.join(report['天中殺']['宿命天中殺'])}")
    
    if report['異常干支']:
        print(f"異常干支: {', '.join(report['異常干支'])}")
    
    print("\n位相法:", ", ".join(report["位相法"]) if report["位相法"] else "特になし")

    print("\n--- 大運 ---")
    print(f"立運: {report['大運']['立運']} ({report['大運']['方向']})")
    
    # Header
    print(f"{'年齢':>3} {'(西暦)':>5} | {'干支':^4} | {'十大主星':^6} | {'十二大従星':^6} | {'位相法':<20} | {'天中殺':<6}")
    print("-" * 75)
    
    for cycle in report["大運"]["サイクル"]:
        age = cycle['年齢']
        year = cycle['西暦']
        kanshi = cycle['干支']
        judai = cycle['十大主星']
        junidai = cycle['十二大従星']
        isouhou = ", ".join(cycle['位相法'])
        tenchu = cycle['天中殺']
        
        print(f"{age:>3} ({year:>4}) | {kanshi:^4} | {judai:^6} | {junidai:^6} | {isouhou:<20} | {tenchu:<6}")

    print("\n--- 宇宙盤 ---")
    print(f"干支番号: {report['宇宙盤']['干支番号']}")

    print("\n--- 数理法 ---")
    print(f"総エネルギー値: {report['数理法']['総エネルギー']}")
    print("【十干別内訳】")
    stem_order = [
        ("木", [("甲", "+"), ("乙", "-")]),
        ("火", [("丙", "+"), ("丁", "-")]),
        ("土", [("戊", "+"), ("己", "-")]),
        ("金", [("庚", "+"), ("辛", "-")]),
        ("水", [("壬", "+"), ("癸", "-")]),
    ]
    for wx, stems in stem_order:
        line = f"  {wx}: "
        parts = []
        for g, sign in stems:
            val = report['数理法']['十干内訳'].get(g, 0)
            parts.append(f"{g}({sign})={val}")
        print(line + "  ".join(parts))
    
    print("【五行分布】")
    for k, v in report['数理法']['五行分布'].items():
        print(f"  {k}: {v}")

    print("\n--- 八門法 (五行エネルギー分布) ---")
    for k, v in report["八門法"].items():
        print(f"  {k}: {v}")

if __name__ == "__main__":
    main()
