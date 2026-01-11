from sanmei_engine import SanmeiEngine
import sys
import datetime

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

    # Use the common formatting logic
    text_output = engine.format_as_text_report(report)
    print(text_output)


if __name__ == "__main__":
    main()
