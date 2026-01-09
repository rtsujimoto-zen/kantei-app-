import subprocess

dates = [
    ("1970/01/05", "M"),
    ("2000/02/04", "M"),
    ("1985/05/05", "M"),
    ("2024/02/29", "M"),
    ("1960/08/07", "M"),
    ("2010/12/22", "M"),
    ("1950/06/06", "M"),
    ("1999/11/08", "M"),
    ("2005/04/05", "M"),
    ("1975/09/08", "M"),
]

for date, gender in dates:
    print(f"\n{'='*20} {date} ({gender}) {'='*20}")
    process = subprocess.Popen(['python3', 'main.py'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    stdout, stderr = process.communicate(input=f"{date}\n{gender}\n")
    print(stdout)
    if stderr:
        print("ERROR:", stderr)
