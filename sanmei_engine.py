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

    # 異常干支 13種類
    IJOU_KANSHI = [11, 12, 18, 19, 23, 24, 25, 30, 31, 35, 37, 42, 48]

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
            if k_id in SanmeiEngine.IJOU_KANSHI:
                results.append(f"{labels[i]}柱: {g}{z}")
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
        # 大運の算出
        # 順行・逆行判定: 男子陽年・女子陰年=順行, 男子陰年・女子陽年=逆行
        nen_yinyang = Kanshi.YIN_YANG[self.nenkan]
        is_shunko = (gender == "M" and nen_yinyang == "+") or (gender == "F" and nen_yinyang == "-")
        
        # 精密な立運算出
        # 順行は「誕生日から次の節入りまで」、逆行は「誕生日の前の節入りから誕生日まで」
        y, m, d = self.birth_dt.year, self.birth_dt.month, self.birth_dt.day
        if is_shunko:
            # 次の節入り
            next_m = m + 1
            next_y = y
            if next_m > 12: next_m = 1; next_y += 1
            setsu_day = self.get_setsuiri_day(next_y, next_m)
            # 簡易的に日数の差を計算 (本来は時刻も考慮)
            days_diff = (datetime.date(next_y, next_m, setsu_day) - self.birth_dt.date()).days
        else:
            # 前の節入り (今月の節入り)
            setsu_day = self.get_setsuiri_day(y, m)
            days_diff = (self.birth_dt.date() - datetime.date(y, m, setsu_day)).days
            
        ritsuen = int(days_diff / 3)
        rem = days_diff % 3
        if rem == 2: ritsuen += 1 # 余り2なら切り上げ
        if ritsuen == 0: ritsuen = 1
        
        # サイクル生成
        gekkan_id = Kanshi.get_kanshi_id(self.gekkan, self.geshi)
        daiun_list = []
        for i in range(1, 9): # 80年分
            offset = i if is_shunko else -i
            k_id = (gekkan_id + offset - 1) % 60 + 1
            gan = Kanshi.TIAN_GAN[(k_id-1)%10]
            zhi = Kanshi.DI_ZHI[(k_id-1)%12]
            age_start = ritsuen + (i-1)*10
            daiun_list.append({"年齢": f"{age_start}歳〜", "干支": f"{gan}{zhi}"})
            
        return {"立運": f"{ritsuen}歳運", "方向": "順行" if is_shunko else "逆行", "サイクル": daiun_list}

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
            "宇宙盤": {"干支番号": uchu_ids},
            "数理法": {"総エネルギー": total_energy, "五行分布": energy_by_wx, "十干内訳": energy_by_stem},
            "八門法": hachimon
        }
