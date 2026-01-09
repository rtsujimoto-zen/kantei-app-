
pairs_to_check = {
    "Shigo": [("丑", "子"), ("寅", "亥"), ("卯", "戌"), ("辰", "酉"), ("巳", "申"), ("午", "未")],
    "Taichu": [("子", "午"), ("丑", "未"), ("寅", "申"), ("卯", "酉"), ("辰", "戌"), ("巳", "亥")],
    "Gai": [("子", "未"), ("丑", "午"), ("寅", "巳"), ("卯", "辰"), ("申", "亥"), ("酉", "戌")],
    "Kei (Ko-ki)": [("丑", "未"), ("未", "戌"), ("戌", "丑")]
}

print("Checking sort order discrepancies...")
for category, pairs in pairs_to_check.items():
    print(f"\n--- {category} ---")
    for p in pairs:
        sorted_p = tuple(sorted(list(p)))
        if p != sorted_p:
            print(f"MISMATCH: Defined {p} -> Sorted {sorted_p}")
        else:
            print(f"MATCH:    {p}")
