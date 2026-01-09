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

    print(f"\n天中殺: {report['天中殺']}天中殺")
    
    print("\n位相法:", ", ".join(report["位相法"]) if report["位相法"] else "特になし")

    print("\n--- 大運 ---")
    print(f"立運: {report['大運']['立運']} ({report['大運']['方向']})")
    for cycle in report["大運"]["サイクル"][:5]: # 最初の5つのみ表示
        print(f"  {cycle['年齢']}: {cycle['干支']}")

    print("\n--- 宇宙盤 ---")
    print(f"干支番号: {report['宇宙盤']['干支番号']}")

    print("\n--- 数理法 ---")
    print(f"総エネルギー値: {report['数理法']['総エネルギー']}")

    print("\n--- 八門法 (五行エネルギー分布) ---")
    for k, v in report["八門法"].items():
        print(f"  {k}: {v}")

if __name__ == "__main__":
    main()
