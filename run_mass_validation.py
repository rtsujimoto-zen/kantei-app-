import subprocess
import csv

test_cases = [
    ("1900/02/05", "M"), ("1911/11/11", "F"), ("1923/09/01", "M"), ("1930/02/04", "F"),
    ("1945/08/15", "M"), ("1952/02/29", "F"), ("1964/10/10", "M"), ("1972/05/15", "F"),
    ("1980/01/01", "M"), ("1986/05/10", "F"), ("1992/04/18", "M"), ("1995/01/17", "F"),
    ("2000/01/01", "M"), ("2000/02/04", "F"), ("2005/08/30", "M"), ("2011/03/11", "F"),
    ("2015/12/31", "M"), ("2019/05/01", "F"), ("2020/02/29", "M"), ("2024/02/04", "F"),
    ("1905/07/07", "M"), ("1920/12/31", "F"), ("1958/12/23", "M"), ("1969/07/20", "F"),
    ("1989/01/07", "M"), ("1989/01/08", "F"), ("2025/01/01", "M"), ("1978/04/01", "F"),
    ("1982/10/20", "M"), ("1999/09/09", "F")
]

results = []

for date, gender in test_cases:
    process = subprocess.Popen(['python3', 'main.py'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    stdout, stderr = process.communicate(input=f"{date}\n{gender}\n")
    
    # 簡易抽出ロジック (構造化されたデータを取得)
    labels = {}
    lines = stdout.split('\n')
    for line in lines:
        if "年: (" in line: labels['年'] = line.strip()
        if "月: (" in line: labels['月'] = line.strip()
        if "日: (" in line: labels['日'] = line.strip()
        if "天中殺:" in line: labels['天中殺'] = line.strip()
        if "胸:" in line: labels['胸'] = line.split(':')[1].strip()
        if "立運:" in line: labels['立運'] = line.strip()

    results.append({
        "date": date,
        "gender": gender,
        "年": labels.get('年', ''),
        "月": labels.get('月', ''),
        "日": labels.get('日', ''),
        "天中殺": labels.get('天中殺', ''),
        "中心星": labels.get('胸', ''),
        "大運": labels.get('立運', '')
    })

with open('validation_results.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=["date", "gender", "年", "月", "日", "天中殺", "中心星", "大運"])
    writer.writeheader()
    writer.writerows(results)

print("Validation results saved to validation_results.csv")
