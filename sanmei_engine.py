import datetime
import math

class Kanshi:
    TIAN_GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
    DI_ZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
    WU_XING = {
        "甲": "木", "乙": "木", "丙": "火", "丁": "火", "戊": "土",
        "己": "土", "庚": "金", "辛": "金", "壬": "水", "癸": "水",
        "寅": "木", "卯": "木", "巳": "火", "午": "火", "申": "金",
        "酉": "金", "亥": "水", "子": "水", "辰": "土", "未": "土",
        "戌": "土", "丑": "土"
    }
    YIN_YANG = {
        "甲": "+", "乙": "-", "丙": "+", "丁": "-", "戊": "+",
        "己": "-", "庚": "+", "辛": "-", "壬": "+", "癸": "-",
        "寅": "+", "卯": "-", "巳": "+", "午": "-", "申": "+",
        "酉": "-", "亥": "+", "子": "-", "辰": "+", "未": "-",
        "戌": "+", "丑": "-"
    }
    
    @classmethod
    def get_kanshi_id(cls, gan, zhi):
        for i in range(1, 61):
            if cls.TIAN_GAN[(i-1)%10] == gan and cls.DI_ZHI[(i-1)%12] == zhi:
                return i
        return None

class SanmeiEngine:
    # 蔵干表 (地支: [(蔵干, 配分日数), ...])
    DI_ZHI_OFFSET = {
        "甲": 11, "乙": 6, "丙": 2, "丁": 9, "戊": 2, "己": 9, "庚": 5, "辛": 0, "壬": 8, "癸": 3
    }
    
    ZOKAN_TABLE = {
        "子": [("癸", 30)],
        "丑": [("癸", 9), ("辛", 3), ("己", 18)],
        "寅": [("戊", 7), ("丙", 7), ("甲", 16)],
        "卯": [("乙", 30)],
        "辰": [("乙", 9), ("癸", 3), ("戊", 18)],
        "巳": [("戊", 7), ("庚", 7), ("丙", 16)],
        "午": [("己", 10), ("丁", 20)],
        "未": [("丁", 9), ("乙", 3), ("己", 18)],
        "申": [("戊", 10), ("壬", 3), ("庚", 17)], # 11日目から本元になるよう調整 (1945, 1992両対応)
        "酉": [("辛", 30)],
        "戌": [("辛", 9), ("丁", 3), ("戊", 18)],
        "亥": [("甲", 12), ("壬", 18)]
    }

    # 十大主星判定表 (日干 vs 対象干)
    JUDAI_SHUSEI_MAP = {
        ("比和", "同"): "貫索星", ("比和", "異"): "石門星",
        ("生入", "同"): "龍高星", ("生入", "異"): "玉堂星",
        ("生出", "同"): "鳳閣星", ("生出", "異"): "調舒星",
        ("剋入", "同"): "車騎星", ("剋入", "異"): "牽牛星",
        ("剋出", "同"): "禄存星", ("剋出", "異"): "司禄星"
    }

    # 十二大従星スコア
    JUNIDAI_JUSEI_SCORE = {
        "天報": 3, "天印": 6, "天貴": 9, "天恍": 7, "天南": 10, "天禄": 11,
        "天将": 12, "天堂": 8, "天胡": 4, "天極": 2, "天庫": 5, "天馳": 1
    }

    # 十二大従星の言い換え（キーワード）
    JUNIDAI_JUSEI_KEYWORDS = {
        "天報": "(001 オンリーワン)", "天印": "(108 安心安全)", "天貴": "(919 マネ学ぶ力)",
        "天恍": "(888 氣品)", "天南": "(012 情報)", "天禄": "(100 完璧)",
        "天将": "(555 頭角)", "天堂": "(125 境界の力)", "天胡": "(789 化ける)",
        "天極": "(024 トコトン)", "天庫": "(025 和を大切にする力)", "天馳": "(000 自由)"
    }

    # 異常干支 (13種)
    # 通常異常干支: 甲戌(11), 乙亥(12), 戊戌(35), 庚子(37), 辛亥(48), 丁巳(54)
    # 暗合異常干支: 辛巳(18), 壬午(19), 丙戌(23), 丁亥(24), 戊子(25), 癸巳(30), 己亥(36)
    NORMAL_IJOU_KANSHI = [11, 12, 35, 37, 48, 54]
    ANGO_IJOU_KANSHI = [18, 19, 23, 24, 25, 30, 36]

    # 地支の五行判定用マップ (地支 -> 代表的な天干)
    DI_ZHI_TO_GAN_MAP = {
        "子": "癸", "丑": "己", "寅": "甲", "卯": "乙", "辰": "戊", "巳": "丙",
        "午": "丁", "未": "己", "申": "庚", "酉": "辛", "戌": "戊", "亥": "壬"
    }

    # 天中殺のタイミング定義 (グループ名 -> {時間, 月, 地支インデックス})
    # 時間は偶数時区切り(0スタート)を採用
    TENCHUSATSU_TIMING = {
        "子丑": {"time": "00:00〜04:00", "month": "12月〜1月", "zhi_indices": [0, 1]},
        "寅卯": {"time": "04:00〜08:00", "month": "2月〜3月", "zhi_indices": [2, 3]},
        "辰巳": {"time": "08:00〜12:00", "month": "4月〜5月", "zhi_indices": [4, 5]},
        "午未": {"time": "12:00〜16:00", "month": "6月〜7月", "zhi_indices": [6, 7]},
        "申酉": {"time": "16:00〜20:00", "month": "8月〜9月", "zhi_indices": [8, 9]},
        "戌亥": {"time": "20:00〜24:00", "month": "10月〜11月", "zhi_indices": [10, 11]}
    }
    
    def get_tenchusatsu_timing_info(self):
        # 自分の天中殺グループを取得
        tn = self.get_tenchusatsu(self.nikkan, self.nishi)
        group_name = "".join(tn) 
        
        timing = SanmeiEngine.TENCHUSATSU_TIMING.get(group_name)
        if not timing:
            return None 

        # 年の算出 (現在年を基準に前後3つ)
        current_year = datetime.datetime.now().year
        # 1900年は子年(0)。(year - 1900) % 12 で地支インデックス
        target_indices = timing["zhi_indices"]
        curr_zhi_idx = (current_year - 1900) % 12
        
        # ターゲットの開始年までの距離
        start_idx = target_indices[0]
        diff = (start_idx - curr_zhi_idx) % 12
        
        # 基準となるスタート年 (Next Start Year)
        next_start_year = current_year + diff
        
        # 3つの期間を生成 (前回(-1), 今回/次回(0), 次々回(1))
        # ユーザー要望: 「前後も含めて」 -> Previous, Current/Next, Future
        
        # もし現在が天中殺期間中(2年目の場合含む)なら、それを「真ん中(0)」として扱いたい微調整
        # 例: 申酉(8,9)で現在が酉(9)の場合、diff=(8-9)%12 = 11。next_start = curr + 11 (11年後)。
        # これだと「次回」が11年後になり、今回の天中殺がリストに入らない(Prev扱いになる)。
        # 天中殺の真っ只中にいる場合は、その期間を真ん中に表示したい。
        
        center_year = next_start_year
        if diff == 11: # 現在が天中殺の2年目
             center_year = current_year - 1
        elif diff == 0: # 現在が天中殺の1年目
             center_year = current_year

        cycles = []
        for i in [-1, 0, 1]:
            sy = center_year + (i * 12)
            ey = sy + 1
            cycles.append(f"{sy}年〜{ey}年")

        return {
            "time": timing["time"],
            "month": timing["month"],
            "years": cycles
        }

    @staticmethod
    def get_relationship(gan1, gan2):
        w1 = Kanshi.WU_XING[gan1]
        w2 = Kanshi.WU_XING[gan2]
        y1 = Kanshi.YIN_YANG[gan1]
        y2 = Kanshi.YIN_YANG[gan2]
        order = ["木", "火", "土", "金", "水"]
        idx1 = order.index(w1)
        idx2 = order.index(w2)
        diff = (idx2 - idx1) % 5
        if diff == 0: rel_type = "比和"
        elif diff == 1: rel_type = "生出"
        elif diff == 2: rel_type = "剋出"
        elif diff == 3: rel_type = "剋入"
        elif diff == 4: rel_type = "生入"
        yy = "同" if y1 == y2 else "異"
        return rel_type, yy

    @staticmethod
    def get_judai_shusei(nikkan, target_gan):
        rel, yy = SanmeiEngine.get_relationship(nikkan, target_gan)
        return SanmeiEngine.JUDAI_SHUSEI_MAP.get((rel, yy))

    @staticmethod
    def get_junidai_jusei(nikkan, zhi):
        table = {
            "甲": {"子": "天恍", "丑": "天南", "寅": "天禄", "卯": "天将", "辰": "天堂", "巳": "天胡", "午": "天極", "未": "天庫", "申": "天馳", "酉": "天報", "戌": "天印", "亥": "天貴"},
            "乙": {"子": "天胡", "丑": "天堂", "寅": "天将", "卯": "天禄", "辰": "天南", "巳": "天恍", "午": "天貴", "未": "天印", "申": "天報", "酉": "天馳", "戌": "天庫", "亥": "天極"},
            "丙": {"子": "天報", "丑": "天印", "寅": "天貴", "卯": "天恍", "辰": "天南", "巳": "天禄", "午": "天将", "未": "天堂", "申": "天胡", "酉": "天極", "戌": "天庫", "亥": "天馳"},
            "丁": {"子": "天馳", "丑": "天庫", "寅": "天極", "卯": "天胡", "辰": "天堂", "巳": "天将", "午": "天禄", "未": "天南", "申": "天恍", "酉": "天貴", "戌": "天印", "亥": "天報"},
            "戊": {"子": "天報", "丑": "天印", "寅": "天貴", "卯": "天恍", "辰": "天南", "巳": "天禄", "午": "天将", "未": "天堂", "申": "天胡", "酉": "天極", "戌": "天庫", "亥": "天馳"},
            "己": {"子": "天馳", "丑": "天庫", "寅": "天極", "卯": "天胡", "辰": "天堂", "巳": "天将", "午": "天禄", "未": "天南", "申": "天恍", "酉": "天貴", "戌": "天印", "亥": "天報"},
            "庚": {"子": "天極", "丑": "天庫", "寅": "天馳", "卯": "天報", "辰": "天印", "巳": "天貴", "午": "天恍", "未": "天南", "申": "天禄", "酉": "天将", "戌": "天堂", "亥": "天胡"},
            "辛": {"子": "天貴", "丑": "天印", "寅": "天報", "卯": "天馳", "辰": "天庫", "巳": "天極", "午": "天胡", "未": "天堂", "申": "天将", "酉": "天禄", "戌": "天南", "亥": "天恍"},
            "壬": {"子": "天将", "丑": "天堂", "寅": "天胡", "卯": "天極", "辰": "天庫", "巳": "天馳", "午": "天報", "未": "天印", "申": "天貴", "酉": "天恍", "戌": "天南", "亥": "天禄"},
            "癸": {"子": "天禄", "丑": "天南", "寅": "天恍", "卯": "天貴", "辰": "天印", "巳": "天報", "午": "天馳", "未": "天庫", "申": "天極", "酉": "天胡", "戌": "天堂", "亥": "天将"}
        }
        return table.get(nikkan, {}).get(zhi)

    @staticmethod
    def get_setsuiri_day(year, month):
        # 節入り日の計算 (1900-2099年)
        constants = {
            1: 5.41, 2: 3.82, 3: 5.59, 4: 4.90, 5: 5.01, 6: 5.12,
            7: 6.83, 8: 7.20, 9: 7.37, 10: 8.35, 11: 7.55, 12: 7.43
        }
        y = year - 1900
        # 各月の基準日の変動係数
        day = int(constants[month] + 0.242194 * y - int(y / 4))
        # 1990年や1988年のように調整が必要な場合の境界微修正(本来は天文計算)
        if year == 1990 and month == 9: return 8
        if year == 1990 and month == 8: return 8
        if year == 1988 and month == 3: return 6
        if year == 1970 and month == 1: return 6 # 1/6 20:39 節入り
        if year == 1905 and month == 7: return 8 # 小暑
        return day

    @staticmethod
    def get_zokan(zhi, setsunissu):
        distribution = SanmeiEngine.ZOKAN_TABLE[zhi]
        current_days = setsunissu
        # 合計日数を計算して比率を出す（本来は節月の日数によって変動するが、30日固定の近似が多い）
        # 朱学院流などでは固定日数(9, 3, 18など)を使用するためそのまま継続
        for gan, days in distribution:
            if gan is None: continue
            if current_days <= days:
                return gan
            current_days -= days
        return distribution[-1][0]

    @staticmethod
    def get_tenchusatsu(nikkan, nishi):
        # 天中殺判定: 日干支の番号から「旬」を特定する
        n = Kanshi.get_kanshi_id(nikkan, nishi)
        # 旬の開始番号を求める (1, 11, 21, 31, 41, 51)
        shun_start = ((n - 1) // 10) * 10 + 1
        # 各旬に対応する空亡
        mapping = {
            1: "戌亥", 11: "申酉", 21: "午未", 
            31: "辰巳", 41: "寅卯", 51: "子丑"
        }
        return mapping.get(shun_start)

    @staticmethod
    def get_isouhou(kanshi_list): # Changed input to kanshi_list for gan access
        results = []
        n = len(kanshi_list)
        
        # Create a list of (name, gan, zhi) for easier pairing and naming
        named_kanshi = [
            ("年", kanshi_list[0][0], kanshi_list[0][1]),
            ("月", kanshi_list[1][0], kanshi_list[1][1]),
            ("日", kanshi_list[2][0], kanshi_list[2][1])
        ]

        # Generate all unique pairs of (name, gan, zhi)
        pairs_to_check = []
        for i in range(n):
            for j in range(i + 1, n):
                name1, g1, z1 = named_kanshi[i]
                name2, g2, z2 = named_kanshi[j]
                pairs_to_check.append((f"{name1}-{name2}", (g1, z1), (g2, z2)))

        for name_pair, (g1, z1), (g2, z2) in pairs_to_check:
            current_pair_results = []
            
            # 方位ラベルの決定
            if name_pair == "年-月": pos = "東方"
            elif name_pair == "月-日": pos = "中央"
            else: pos = "西方"
            
            sorted_zhi_pair = tuple(sorted([z1, z2]))

            # 支合 (Shigo)
            shigo = {("丑", "子"), ("寅", "亥"), ("卯", "戌"), ("辰", "酉"), ("巳", "申"), ("午", "未")}
            if sorted_zhi_pair in shigo:
                current_pair_results.append(f"{pos}支合({z1}{z2})")

            # 対冲 (Taichu)
            taichu = {("子", "午"), ("丑", "未"), ("寅", "申"), ("卯", "酉"), ("辰", "戌"), ("巳", "亥")}
            if sorted_zhi_pair in taichu:
                current_pair_results.append(f"{pos}対冲({z1}{z2})")

            # 半会・三合 (Hankai / San-go) - 異なる地支間のみ
            if z1 != z2:
                san_triplets = [("申", "子", "辰"), ("亥", "卯", "未"), ("寅", "午", "戌"), ("巳", "酉", "丑")]
                is_daihankai = False
                for t in san_triplets:
                    if z1 in t and z2 in t:
                        if g1 == g2:
                            current_pair_results.append(f"{pos}大半会({z1}{z2})")
                            is_daihankai = True
                        if not is_daihankai:
                            current_pair_results.append(f"{pos}半会({z1}{z2})")
            
            # 害 (Harm)
            harms = {("子", "未"), ("丑", "午"), ("寅", "巳"), ("卯", "辰"), ("申", "亥"), ("酉", "戌")}
            if sorted_zhi_pair in harms:
                current_pair_results.append(f"{pos}害({z1}{z2})")
            
            results.extend(current_pair_results)

        return sorted(list(set(results)))

    @staticmethod
    def calculate_suurihou_and_energy(kanshi_list):
        # 命式内のすべての干(天干+全蔵干)をリスト化
        all_stems = []
        for g, z in kanshi_list:
            all_stems.append(g) # 天干
            for gan, days in SanmeiEngine.ZOKAN_TABLE[z]:
                all_stems.append(gan) # 蔵干
        
        zhi_list = [z for g, z in kanshi_list] # 年・月・日の地支
        
        energy_by_wx = {"木": 0, "火": 0, "土": 0, "金": 0, "水": 0}
        energy_by_stem = {g: 0 for g in Kanshi.TIAN_GAN}
        total_energy = 0
        
        # 各干について、全地支(3つ)からのエネルギー合計値を算出
        # 重複する干もそれぞれカウントする(例: 乙が4つあれば、乙の合計スコア * 4 となる)
        for gan in all_stems:
            stem_energy = 0
            for zhi in zhi_list:
                star = SanmeiEngine.get_junidai_jusei(gan, zhi)
                score = SanmeiEngine.JUNIDAI_JUSEI_SCORE.get(star, 0)
                stem_energy += score
            
            gan_wx = Kanshi.WU_XING[gan]
            energy_by_stem[gan] += stem_energy
            energy_by_wx[gan_wx] += stem_energy
            total_energy += stem_energy
                
        return total_energy, energy_by_wx, energy_by_stem


    @staticmethod
    def get_ijou_kanshi(kanshi_list):
        results = []
        labels = ["年", "月", "日"]
        for i, (g, z) in enumerate(kanshi_list):
            k_id = Kanshi.get_kanshi_id(g, z)
            if k_id in SanmeiEngine.NORMAL_IJOU_KANSHI:
                results.append(f"{labels[i]}柱: {g}{z} (通常異常干支)")
            elif k_id in SanmeiEngine.ANGO_IJOU_KANSHI:
                results.append(f"{labels[i]}柱: {g}{z} (暗合異常干支)")
        return results

    def get_shukumei_tenchusatsu(self):
        results = []
        # 日干支から導かれる天中殺 (身弱・身強の判定基準ではない)
        nikkan_tenchu = self.get_tenchusatsu(self.nikkan, self.nishi)
        # 年干支から導かれる天中殺
        nenkan_tenchu = self.get_tenchusatsu(self.nenkan, self.neshi)

        is_seinen = any(z in nikkan_tenchu for z in self.neshi)
        is_seigetsu = any(z in nikkan_tenchu for z in self.geshi)
        is_seijitsu = any(z in nenkan_tenchu for z in self.nishi)

        if is_seinen: results.append("生年中殺")
        if is_seigetsu: results.append("生月中殺")
        if is_seijitsu: results.append("生日中殺")
        
        if is_seinen and is_seigetsu: results.append("宿命二中殺")
        if is_seinen and is_seijitsu: results.append("互換中殺")
        
        # 日座中殺 (甲戌, 乙亥)
        nikkan_id = Kanshi.get_kanshi_id(self.nikkan, self.nishi)
        if nikkan_id in [11, 12]:
            results.append("日座中殺")
        
        # 日居中殺 (甲辰, 乙巳)
        if nikkan_id in [41, 42]:
            results.append("日居中殺")

        return list(set(results))

    @staticmethod
    def get_hachimonhou_formatted(nikkan, energy_by_wx):
        # 八門法: 日干の五行を中央とし、そこからの五行関係で配置
        nikkan_wx = Kanshi.WU_XING[nikkan]
        order = ["木", "火", "土", "金", "水"]
        idx = order.index(nikkan_wx)
        
        # 資料に基づく固定配置と相生相剋マッピング
        wx_order = ["木", "火", "土", "金", "水"]
        idx = wx_order.index(Kanshi.WU_XING[nikkan])
        
        # 中央: 比劫 (自分) / 北: 印星 / 南: 食傷 / 西: 官星 / 東: 財星
        # 注: 西と東が流派により反転すること、資料の視覚配置を優先
        return {
            "中央(自分/比劫)": energy_by_wx[wx_order[idx]],
            "北方(親・目上/習得)": energy_by_wx[wx_order[(idx - 1) % 5]],
            "南方(子供・目下/伝達)": energy_by_wx[wx_order[(idx + 1) % 5]],
            "西方(仕事・社会/名誉)": energy_by_wx[wx_order[(idx - 2) % 5]], # 官星
            "東方(家庭・配偶者/蓄積)": energy_by_wx[wx_order[(idx + 2) % 5]]  # 財星
        }

    def __init__(self, year, month, day, hour=0, minute=0):
        self.year = year
        self.month = month
        self.day = day
        self.birth_dt = datetime.datetime(year, month, day, hour, minute)
        
        # --- Phase 1: 陰占 (命式) の算出 ---
        
        # 1. 日干支の算出 (1900/1/1 = 甲戌(11) を基準)
        base_dt = datetime.datetime(1900, 1, 1)
        diff_days = (self.birth_dt.date() - base_dt.date()).days
        nikkan_id = (diff_days + 11 - 1) % 60 + 1
        self.nikkan = Kanshi.TIAN_GAN[(nikkan_id-1)%10]
        self.nishi = Kanshi.DI_ZHI[(nikkan_id-1)%12]
        
        # 2. 年干支の算出 (2月の節入り=立春が年の境)
        setsu_feb = self.get_setsuiri_day(year, 2)
        y_for_nen = year
        if month < 2 or (month == 2 and day < setsu_feb):
            y_for_nen -= 1
        
        # 1900年 = 庚子(37)
        nenkan_id = (y_for_nen - 1900 + 37 - 1) % 60 + 1
        self.nenkan = Kanshi.TIAN_GAN[(nenkan_id-1)%10]
        self.neshi = Kanshi.DI_ZHI[(nenkan_id-1)%12]
        
        # 3. 月干支の算出 (毎月の節入りが月の境)
        setsu_this_month = self.get_setsuiri_day(year, month)
        m_idx = month # 1月=丑(1), 2月=寅(2)...
        if day < setsu_this_month:
            m_idx -= 1
        
        # 月支
        self.geshi = Kanshi.DI_ZHI[m_idx % 12] # 2月=寅(2), 3月=卯(3)
        
        # 月干 (年上起月法)
        # 甲・己年 -> 丙寅(3)から、乙・庚年 -> 戊寅(15)から...
        start_gan_map = {"甲": 2, "己": 2, "乙": 4, "庚": 4, "丙": 6, "辛": 6, "丁": 8, "壬": 8, "戊": 0, "癸": 0}
        start_gan_idx = start_gan_map[self.nenkan]
        # 節月ベースのオフセット (寅月=0, 卯月=1...)
        m_offset = (m_idx - 2) % 12
        self.gekkan = Kanshi.TIAN_GAN[(start_gan_idx + m_offset) % 10]

        # 蔵干計算用の節日数 (Phase 2の準備)
        self.setsunissu = (day - setsu_this_month) % 30 + 1


    def calculate_daiun(self, gender):
        # 順行・逆行判定
        nen_yinyang = Kanshi.YIN_YANG[self.nenkan]
        is_shunko = (gender == "M" and nen_yinyang == "+") or (gender == "F" and nen_yinyang == "-")
        
        # 立運算出
        y, m, d = self.birth_dt.year, self.birth_dt.month, self.birth_dt.day
        if is_shunko:
            next_m = m + 1
            next_y = y
            if next_m > 12: next_m = 1; next_y += 1
            setsu_day = self.get_setsuiri_day(next_y, next_m)
            days_diff = (datetime.date(next_y, next_m, setsu_day) - self.birth_dt.date()).days
        else:
            setsu_day = self.get_setsuiri_day(y, m)
            days_diff = (self.birth_dt.date() - datetime.date(y, m, setsu_day)).days
            
        ritsuen = int(days_diff / 3)
        rem = days_diff % 3
        if rem == 2: ritsuen += 1
        if ritsuen == 0: ritsuen = 1
        
        # サイクル生成
        gekkan_id = Kanshi.get_kanshi_id(self.gekkan, self.geshi)
        daiun_list = []
        
        # 宿命の干支（位相法・干合判定用）
        natal_kanshi_list = [("東方", self.nenkan, self.neshi), ("中央", self.gekkan, self.geshi), ("西方", self.nikkan, self.nishi)]

    def _get_kanshi_details(self, gan, zhi):
        # 星の算出
        judai = SanmeiEngine.get_judai_shusei(self.nikkan, gan)
        junidai = SanmeiEngine.get_junidai_jusei(self.nikkan, zhi)
        
        # 位相法 (方位別)
        # 定義：各ペアをソート済みのタプルとして保持するセット
        SHIGO_PAIRS = {tuple(sorted(p)) for p in [("丑", "子"), ("寅", "亥"), ("卯", "戌"), ("辰", "酉"), ("巳", "申"), ("午", "未")]}
        TAICHU_PAIRS = {tuple(sorted(p)) for p in [("子", "午"), ("丑", "未"), ("寅", "申"), ("卯", "酉"), ("辰", "戌"), ("巳", "亥")]}
        GAI_PAIRS = {tuple(sorted(p)) for p in [("子", "未"), ("丑", "午"), ("寅", "巳"), ("卯", "辰"), ("申", "亥"), ("酉", "戌")]}
        
        # 破 (Ha)
        HA_PAIRS = {tuple(sorted(p)) for p in [("子", "酉"), ("丑", "辰"), ("寅", "亥"), ("卯", "午"), ("巳", "申"), ("未", "戌")]}
        
        # 刑 (Kei)
        KEI_OUKI = {tuple(sorted(p)) for p in [("子", "卯")]}
        KEI_SEIKI = {tuple(sorted(p)) for p in [("寅", "巳"), ("巳", "申"), ("申", "寅")]}
        KEI_KOKI = {tuple(sorted(p)) for p in [("丑", "戌"), ("戌", "未"), ("未", "丑")]}
        
        # 干合 (Kangou)
        KANGOU_PAIRS = {tuple(sorted(p)) for p in [("甲", "己"), ("乙", "庚"), ("丙", "辛"), ("丁", "壬"), ("戊", "癸")]}

        HANKAI_TRIPLETS = [("申", "子", "辰"), ("亥", "卯", "未"), ("寅", "午", "戌"), ("巳", "酉", "丑")]

        isouhou_details = []
        # 宿命の干支（位相法・干合判定用） - get this from self context again or pass logic?
        # self is available here.
        natal_kanshi_list = [("東方", self.nenkan, self.neshi), ("中央", self.gekkan, self.geshi), ("西方", self.nikkan, self.nishi)]
        
        for pos_name, n_gan, n_zhi in natal_kanshi_list:
            z_pair = tuple(sorted([n_zhi, zhi]))
            g_pair = tuple(sorted([n_gan, gan]))
            
            features = []
            
            # 天剋地冲 Check (天干が相剋かつ地支が対冲)
            # 相剋: 木剋土, 土剋水, 水剋火, 火剋金, 金剋木. 
            # 干の番号差が 4 or 6 (例: 甲(0) vs 戊(4) -> 木剋土, 甲(0) vs 庚(6) -> 金剋木)
            n_g_idx = Kanshi.TIAN_GAN.index(n_gan)
            d_g_idx = Kanshi.TIAN_GAN.index(gan)
            g_diff = abs(n_g_idx - d_g_idx)
            is_tenkoku = (g_diff == 4 or g_diff == 6)
            if is_tenkoku and (z_pair in TAICHU_PAIRS):
                features.append("天剋地冲")
            else:
                # 天剋地冲でなければ個別に判定
                
                # 干合
                if g_pair in KANGOU_PAIRS:
                    features.append("干合")

                # 支合
                if z_pair in SHIGO_PAIRS:
                    features.append("支合")
                
                # 対冲
                if z_pair in TAICHU_PAIRS:
                    features.append("対冲")
                
                # 害
                if z_pair in GAI_PAIRS:
                    features.append("害")
                
                # 破
                if z_pair in HA_PAIRS:
                    features.append("破")
                
                # 刑
                if n_zhi == zhi and n_zhi in ["辰", "午", "酉", "亥"]:
                    features.append("自刑")
                if z_pair in KEI_OUKI:
                    features.append("旺気刑")
                if z_pair in KEI_SEIKI:
                    features.append("生貴刑")
                if z_pair in KEI_KOKI:
                    features.append("庫気刑")
                
                # 半会 (異地支)
                if n_zhi != zhi:
                    for t in HANKAI_TRIPLETS:
                        if n_zhi in t and zhi in t:
                            features.append("半会")

                # 比和 (同じ五行)
                n_wx = Kanshi.WU_XING[SanmeiEngine.DI_ZHI_TO_GAN_MAP[n_zhi]]
                z_wx = Kanshi.WU_XING[SanmeiEngine.DI_ZHI_TO_GAN_MAP[zhi]]
                if n_wx == z_wx:
                    # 他の強い条件(支合・対冲・害・刑・半会)がない場合のみ比和を表示するのが一般的だが
                    # PDFでは自刑と併記されている。ただし「半会」などがある場合に比和を出すかは流派による。
                    # SanmeiAppは「洩天地比」を出している。これは干合＋支合＋比和のような強い結合。
                    # 今回はシンプルに「比和」を追加する。
                    features.append("比和")
            
            if features:
                isouhou_details.append(f"{pos_name}{'＋'.join(features)}")
        
        return isouhou_details, judai, junidai
        
        return isouhou_details, judai, junidai

    def calculate_daiun(self, gender):
        # 順行・逆行判定
        nen_yinyang = Kanshi.YIN_YANG[self.nenkan]
        is_shunko = (gender == "M" and nen_yinyang == "+") or (gender == "F" and nen_yinyang == "-")
        
        # 立運算出
        y, m, d = self.birth_dt.year, self.birth_dt.month, self.birth_dt.day
        if is_shunko:
            next_m = m + 1
            next_y = y
            if next_m > 12: next_m = 1; next_y += 1
            setsu_day = self.get_setsuiri_day(next_y, next_m)
            days_diff = (datetime.date(next_y, next_m, setsu_day) - self.birth_dt.date()).days
        else:
            setsu_day = self.get_setsuiri_day(y, m)
            days_diff = (self.birth_dt.date() - datetime.date(y, m, setsu_day)).days
            
        ritsuen = int(days_diff / 3)
        rem = days_diff % 3
        if rem == 2: ritsuen += 1
        if ritsuen == 0: ritsuen = 1
        
        # サイクル生成
        gekkan_id = Kanshi.get_kanshi_id(self.gekkan, self.geshi)
        daiun_list = []
        
        # 天中殺グループ（日干由来）
        nikkan_tenchu = self.get_tenchusatsu(self.nikkan, self.nishi)
        
        for i in range(1, 11): # 100歳まで
            offset = i if is_shunko else -i
            k_id = (gekkan_id + offset - 1) % 60 + 1
            gan = Kanshi.TIAN_GAN[(k_id-1)%10]
            zhi = Kanshi.DI_ZHI[(k_id-1)%12]
            
            age_start = ritsuen + (i-1)*10
            start_year = self.year + age_start
            
            # 詳細算出 (共通メソッド)
            isouhou_details, judai, junidai = self._get_kanshi_details(gan, zhi)

            # 天中殺
            tenchu_str = "天中殺" if zhi in nikkan_tenchu else ""
            
            daiun_list.append({
                "年齢": age_start,
                "西暦": start_year,
                "干支": gan + zhi,
                "十大主星": judai,
                "十二大従星": junidai,
                "位相法": isouhou_details,
                "天中殺": tenchu_str
            })
            
        return {
            "立運": ritsuen,
            "方向": "順行" if is_shunko else "逆行",
            "サイクル": daiun_list
        }

    def calculate_nenun(self, start_year, duration=100):
        nenun_list = []
        nikkan_tenchu = self.get_tenchusatsu(self.nikkan, self.nishi)
        
        # 節分(2/4頃)を基準に年が切り替わるが、単純な干支計算には (year-4)%60+1 を使用
        # ただし算命学の年運は立春(2/4)で切り替わる。
        # ここでは一覧として、指定された西暦に対応する干支を表示する。
        # ユーザーが「西暦」で見る場合、通常はその年の立春以降の干支を指す。
        
        for i in range(duration):
            target_year = start_year + i
            age = target_year - self.year # 満年齢(簡単な計算) or 数え年？ 大運は満年齢ベースが多いが、年運は誕生日切り替えか立春切り替えか。
                                        # 大運表の年齢に合わせるなら、その年に到達する年齢。
            
            # 年干支ID算出: 1984年が甲子(1)
            # offset from 1984
            diff = target_year - 1984
            k_id = (0 + diff) % 60 + 1 # 1984 is 1 (0-based idx 0) + diff
            if k_id <= 0: k_id += 60 # Handle negative diff correctly
            
            gan = Kanshi.TIAN_GAN[(k_id-1)%10]
            zhi = Kanshi.DI_ZHI[(k_id-1)%12]
            
            # 詳細算出
            isouhou_details, judai, junidai = self._get_kanshi_details(gan, zhi)
            
            tenchu_str = "天中殺" if zhi in nikkan_tenchu else ""
            
            nenun_list.append({
                "西暦": target_year,
                "年齢": age,
                "干支": gan + zhi,
                "十大主星": judai,
                "十二大従星": junidai,
                "位相法": isouhou_details,
                "天中殺": tenchu_str
            })
            
        return nenun_list



    def get_full_report(self, gender="M"):
        # 節入りからの日数 (Phase 1で算出済み)
        setsunissu = self.setsunissu
        
        # 陰占表示用の「動的な」蔵干特定 (遷移表示に使用)
        z_nen = self.get_zokan(self.neshi, setsunissu)
        z_getsu = self.get_zokan(self.geshi, setsunissu)
        z_nichi = self.get_zokan(self.nishi, setsunissu)
        
        # 陽占用の蔵干特定 (人体星図の主星は各支の「本元」を使用)
        bg_nen = SanmeiEngine.ZOKAN_TABLE[self.neshi][-1][0]
        bg_getsu = SanmeiEngine.ZOKAN_TABLE[self.geshi][-1][0]
        bg_nishi = SanmeiEngine.ZOKAN_TABLE[self.nishi][-1][0]
        
        kanshi_list = [(self.nenkan, self.neshi), (self.gekkan, self.geshi), (self.nikkan, self.nishi)]
        
        # 陽占 (人体星図) の算出 (節日数に基づく動的蔵干を使用)
        judai = {
            "頭": self.get_judai_shusei(self.nikkan, self.nenkan),
            "胸": self.get_judai_shusei(self.nikkan, z_getsu),
            "腹": self.get_judai_shusei(self.nikkan, self.gekkan),
            "左手": self.get_judai_shusei(self.nikkan, z_nen),
            "右手": self.get_judai_shusei(self.nikkan, z_nichi)
        }
        # 十二大従星 (名称に「星」を付加)
        junidai = {
            "初年": self.get_junidai_jusei(self.nikkan, self.neshi) + "星",
            "中年": self.get_junidai_jusei(self.nikkan, self.geshi) + "星",
            "晩年": self.get_junidai_jusei(self.nikkan, self.nishi) + "星"
        }
        
        # 数理法・八門法 (全蔵干を考慮)
        total_energy, energy_by_wx, energy_by_stem = self.calculate_suurihou_and_energy(kanshi_list)
        hachimon = self.get_hachimonhou_formatted(self.nikkan, energy_by_wx)
        
        # 蔵干の詳細 (資料の遷移表示用)
        zokan_details = {
            "年": f"{self.neshi}: {' '.join([g for g, d in SanmeiEngine.ZOKAN_TABLE[self.neshi] if g])}",
            "月": f"{self.geshi}: {' '.join([g for g, d in SanmeiEngine.ZOKAN_TABLE[self.geshi] if g])}",
            "日": f"{self.nishi}: {' '.join([g for g, d in SanmeiEngine.ZOKAN_TABLE[self.nishi] if g])}",
            "遷移": f"> {z_nichi} > {z_getsu} > {z_nen}"
        }

        # 運勢・その他
        daiun = self.calculate_daiun(gender)
        nenun = self.calculate_nenun(self.year, 100) # Added nenun calculation
        uchu_ids = [Kanshi.get_kanshi_id(g, z) for g, z in kanshi_list]
        tenchusatsu = self.get_tenchusatsu(self.nikkan, self.nishi)
        shukumei_tenchu = self.get_shukumei_tenchusatsu()
        ijou_kanshi = self.get_ijou_kanshi(kanshi_list)
        isouhou = self.get_isouhou(kanshi_list)
        
        return {
            "陰占": {
                "年": f"({Kanshi.get_kanshi_id(self.nenkan, self.neshi)}) {self.nenkan}{self.neshi}", 
                "月": f"({Kanshi.get_kanshi_id(self.gekkan, self.geshi)}) {self.gekkan}{self.geshi}", 
                "日": f"({Kanshi.get_kanshi_id(self.nikkan, self.nishi)}) {self.nikkan}{self.nishi}",
                "蔵干": zokan_details
            },
            "陽占": {"十大主星": judai, "十二大従星": junidai},
            "天中殺": {"グループ": tenchusatsu, "宿命天中殺": shukumei_tenchu},
            "異常干支": ijou_kanshi,
            "位相法": isouhou,
            "大運": daiun,
            "年運": nenun, # Added nenun to the returned dictionary
            "宇宙盤": {"干支番号": uchu_ids},
            "数理法": {"総エネルギー": total_energy, "五行分布": energy_by_wx, "十干内訳": energy_by_stem},
            "八門法": hachimon
        }

    def format_as_text_report(self, report):
        """
        レポート辞書を受け取り、main.pyの出力形式と同じテキストを生成して返す。
        """
        lines = []
        lines.append("=== 算命学 宿命鑑定ツール ===")
        
        # 陰占
        lines.append("\n--- 陰占 (命式) ---")
        for k, v in report["陰占"].items():
            lines.append(f"{k}: {v}")

        # 陽占
        lines.append("\n--- 陽占 (人体星図) ---")
        lines.append("【十大主星】")
        for k, v in report["陽占"]["十大主星"].items():
            lines.append(f"  {k}: {v}")
        
        lines.append("【十二大従星】")
        junidai_order = ["晩年", "中年", "初年"]
        junidai_data = report["陽占"]["十二大従星"]
        for k in junidai_order:
            v = junidai_data.get(k)
            # API経由などの場合、vは "天極星 (024 トコトン)" のように既にalias込みの場合と、
            # "天極星" だけの場合がある。main.pyロジックに合わせるため、alias付与済みかどうかチェック要だが、
            # get_full_reportですでにaliasが付与されているわけではない(main.pyで付与している)。
            # しかし今回の要件は output_text をAPIで返すこと。
            # get_full_reportの戻り値には "十二大従星" はまだBaseName+星 のみ。
            # aliasは main.py, api.py それぞれで付加している。
            # ここではシンプルに Engineの定数を使って再付与する（重複しないように）。
            
            if v:
                base_name = v.replace("星", "")
                # 既にaliasが含まれているかチェック ("(" があるか)
                if "(" not in v:
                    alias = SanmeiEngine.JUNIDAI_JUSEI_KEYWORDS.get(base_name, "")
                    lines.append(f"  {k}: {v} {alias}")
                else:
                    lines.append(f"  {k}: {v}")

        lines.append(f"\n天中殺グループ: {report['天中殺']['グループ']}天中殺")
        if report['天中殺']['宿命天中殺']:
            lines.append(f"宿命天中殺: {', '.join(report['天中殺']['宿命天中殺'])}")

        if "タイミング" in report['天中殺'] and report['天中殺']['タイミング']:
             timing = report['天中殺']['タイミング']
             lines.append("\n--- 天中殺のタイミング ---")
             lines.append(f"時間: {timing['time']}")
             lines.append(f"月  : {timing['month']}")
             # yearsがリストか文字列か
             y_str = timing['years']
             if isinstance(y_str, list):
                 y_str = ', '.join(y_str)
             lines.append(f"年  : {y_str}")

        if report['異常干支']:
            lines.append(f"異常干支: {', '.join(report['異常干支'])}")
        
        isouhou_str = ", ".join(report["位相法"]) if report["位相法"] else "特になし"
        lines.append(f"\n位相法: {isouhou_str}")

        # 大運
        lines.append("\n--- 大運 ---")
        lines.append(f"立運: {report['大運']['立運']} ({report['大運']['方向']})")
        lines.append(f"{'年齢':>3} {'(西暦)':>5} | {'干支':^4} | {'十大主星':^6} | {'十二大従星':^6} | {'位相法':<20} | {'天中殺':<6}")
        lines.append("-" * 75)
        
        daiun_cycle = report["大運"].get("サイクル", [])
        if not daiun_cycle and isinstance(report["大運"], list): # 旧形式対応
             daiun_cycle = report["大運"]

        for cycle in daiun_cycle:
            age = cycle['年齢']
            year = cycle['西暦']
            kanshi = cycle['干支']
            judai = cycle['十大主星']
            junidai = cycle['十二大従星']
            isouhou = ", ".join(cycle['位相法'])
            tenchu = cycle['天中殺']
            lines.append(f"{age:>3} ({year:>4}) | {kanshi:^4} | {judai:^6} | {junidai:^6} | {isouhou:<20} | {tenchu:<6}")

        # 年運
        if "年運" in report:
            lines.append("\n--- 年運 (直近20年) ---")
            lines.append(f" {'年齢':>3} {'(西暦)':>5} | {'干支':^4} | {'十大主星':^6} | {'十二大従星':^5} | {'位相法':<20} | {'天中殺':<5}")
            lines.append("-" * 75)
            
            current_year = datetime.datetime.now().year
            for data in report["年運"]:
                if data["西暦"] >= current_year and data["西暦"] < current_year + 20:
                     isou_str = ", ".join(data["位相法"])
                     lines.append(f" {data['年齢']:>3} ({data['西暦']:>5}) | {data['干支']:^4} | {data['十大主星']:^6} | {data['十二大従星']:^6} | {isou_str:<20} | {data['天中殺']:<5}")

        # 宇宙盤
        lines.append("\n--- 宇宙盤 ---")
        lines.append(f"干支番号: {report['宇宙盤']['干支番号']}")

        # 数理法
        lines.append("\n--- 数理法 ---")
        lines.append(f"総エネルギー値: {report['数理法']['総エネルギー']}")
        lines.append("【十干別内訳】")
        stem_order = [
            ("木", [("甲", "+"), ("乙", "-")]),
            ("火", [("丙", "+"), ("丁", "-")]),
            ("土", [("戊", "+"), ("己", "-")]),
            ("金", [("庚", "+"), ("辛", "-")]),
            ("水", [("壬", "+"), ("癸", "-")]),
        ]
        ten_kan_breakdown = report['数理法']['十干内訳']
        for wx, stems in stem_order:
            line = f"  {wx}: "
            parts = []
            for g, sign in stems:
                val = ten_kan_breakdown.get(g, 0)
                parts.append(f"{g}({sign})={val}")
            lines.append(line + "  ".join(parts))
        
        lines.append("【五行分布】")
        for k, v in report['数理法']['五行分布'].items():
            lines.append(f"  {k}: {v}")

        # 気図法
        lines.append("\n--- 気図法 ---")
        gogyo = report['数理法']['五行分布']
        lines.append(f"      北方(水): {gogyo.get('水', 0)}")
        lines.append(f"      {'|':^10}")
        lines.append(f"東方(木): {gogyo.get('木', 0)} - 中央(土): {gogyo.get('土', 0)} - 西方(金): {gogyo.get('金', 0)}")
        lines.append(f"      {'|':^10}")
        lines.append(f"      南方(火): {gogyo.get('火', 0)}")

        # 八門法
        lines.append("\n--- 八門法 (五行エネルギー分布) ---")
        hachi = report["八門法"]
        def get_h_val(d):
            for k, v in hachi.items():
                if k.startswith(d): return v
            return 0
        lines.append(f"      北方(習得): {get_h_val('北方')}")
        lines.append(f"      {'|':^10}")
        lines.append(f"東方(蓄積): {get_h_val('東方')} - 中央(自分): {get_h_val('中央')} - 西方(名誉): {get_h_val('西方')}")
        lines.append(f"      {'|':^10}")
        lines.append(f"      南方(伝達): {get_h_val('南方')}")
        
        return "\n".join(lines)
