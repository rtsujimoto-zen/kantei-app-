"use client";

import { useTheme } from './ThemeContext';

const fonts = {
    serif: "var(--font-noto-serif-jp), 'Noto Serif JP', serif",
    mono: "var(--font-dm-mono), 'DM Mono', monospace",
};

// =====================================
// 【陰占】Insen Section
// =====================================
interface InsenData {
    年: string; 月: string; 日: string;
    蔵干: { 年: string; 月: string; 日: string; 遷移: string };
}

export function InsenSection({ data }: { data: InsenData }) {
    const { t } = useTheme();
    const parseKanshi = (str: string) => {
        const match = str.match(/\((\d+)\)\s*(.+)/);
        if (match) return { number: match[1], kan: match[2][0], shi: match[2][1] };
        return { number: '', kan: str[0] || '', shi: str[1] || '' };
    };

    const year = parseKanshi(data.年);
    const month = parseKanshi(data.月);
    const day = parseKanshi(data.日);

    const parseZokan = (str: string) => {
        const parts = str.split(':');
        return parts.length > 1 ? parts[1].trim().split(' ') : [];
    };

    const zokanYear = parseZokan(data.蔵干.年);
    const zokanMonth = parseZokan(data.蔵干.月);
    const zokanDay = parseZokan(data.蔵干.日);
    const senyi = data.蔵干.遷移.replace(/>/g, '').trim().split(' ').filter(Boolean);

    const cols = [
        { label: "日", num: day.number, kan: day.kan, shi: day.shi, zo: zokanDay[0] || '', sen: senyi[0] },
        { label: "月", num: month.number, kan: month.kan, shi: month.shi, zo: zokanMonth[0] || '', sen: senyi[1] },
        { label: "年", num: year.number, kan: year.kan, shi: year.shi, zo: zokanYear[0] || '', sen: senyi[2] },
    ];

    return (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 2, padding: 20, transition: "all 0.3s", boxShadow: t.shadowCard }}>
            <div style={{ fontFamily: fonts.mono, fontSize: 11, fontWeight: 500, color: t.text3, letterSpacing: 4, textTransform: "uppercase" as const, marginBottom: 14 }}>陰占</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, textAlign: "center" }}>
                {cols.map((c) => (
                    <div key={c.label}>
                        <div style={{ fontSize: 11, color: t.text3, fontFamily: fonts.mono, marginBottom: 4 }}>{c.label}({c.num})</div>
                        <div style={{ fontSize: 32, fontWeight: 200, color: t.text1, fontFamily: fonts.serif, lineHeight: 1.2 }}>{c.kan}</div>
                        <div style={{ fontSize: 18, color: t.text2, fontFamily: fonts.serif }}>{c.shi}</div>
                        <div style={{ fontSize: 11, color: t.text3, marginTop: 6, fontFamily: fonts.serif }}>{c.zo}</div>
                        <div style={{ fontSize: 10, color: t.text4 }}>→ {c.sen}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// =====================================
// 【陽占】Yosen Section
// =====================================
interface YosenData {
    十大主星: { 頭: string; 胸: string; 腹: string; 左手: string; 右手: string };
    十二大従星: { 初年: string; 中年: string; 晩年: string };
}

export function YosenSection({ data }: { data: YosenData }) {
    const { t } = useTheme();
    // Grid layout: 正しい人体星図配置（頭・腹は中央列）
    // [空,   頭,      初年]
    // [右手, 胸(中心), 左手]
    // [晩年, 腹,      中年]
    const grid = [
        null,
        { v: data.十大主星.頭, main: false, label: '北' },
        { v: data.十二大従星.初年, main: false, label: '初年' },
        { v: data.十大主星.右手, main: false, label: '西' },
        { v: data.十大主星.胸, main: true, label: '中心' },
        { v: data.十大主星.左手, main: false, label: '東' },
        { v: data.十二大従星.晩年, main: false, label: '晩年' },
        { v: data.十大主星.腹, main: false, label: '南' },
        { v: data.十二大従星.中年, main: false, label: '中年' },
    ];

    return (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 2, padding: 20, transition: "all 0.3s", boxShadow: t.shadowCard }}>
            <div style={{ fontFamily: fonts.mono, fontSize: 11, fontWeight: 500, color: t.text3, letterSpacing: 4, textTransform: "uppercase" as const, marginBottom: 14 }}>陽占</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
                {grid.map((item, i) => {
                    if (!item) return <div key={i} />;
                    return (
                        <div key={i} style={{
                            background: item.main ? `${t.text1}08` : t.inputBg,
                            border: item.main ? `1px solid ${t.text1}20` : `1px solid ${t.border}`,
                            padding: "7px 3px",
                            textAlign: "center",
                            fontSize: item.main ? 13 : 12,
                            fontWeight: item.main ? 600 : 300,
                            color: item.main ? t.text1 : t.text2,
                            fontFamily: fonts.serif,
                            transition: "all 0.3s",
                        }}>
                            {item.v}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// =====================================
// 【位相法】Isohou Section
// =====================================
export function IsohouSection({ data, shis }: { data: string[]; shis: { 年: string; 月: string; 日: string } }) {
    const { t } = useTheme();
    const getShi = (str: string) => {
        const match = str.match(/\((\d+)\)\s*(.+)/);
        if (match && match[2].length >= 2) return match[2][1];
        return str.length >= 2 ? str[1] : '';
    };

    const shiDay = getShi(shis.日);
    const shiMonth = getShi(shis.月);
    const shiYear = getShi(shis.年);

    const isSpecial = (item: string) => {
        const specials = ['半会', '会局', '支合', '冲', '害', '刑', '破', '天剋地冲'];
        return specials.some(s => item.includes(s));
    };

    return (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 2, padding: 20, transition: "all 0.3s", boxShadow: t.shadowCard }}>
            <div style={{ fontFamily: fonts.mono, fontSize: 11, fontWeight: 500, color: t.text3, letterSpacing: 4, textTransform: "uppercase" as const, marginBottom: 14 }}>位相法</div>
            <div style={{ position: "relative", width: "100%", height: 100, marginBottom: 10 }}>
                <svg viewBox="0 0 120 90" style={{ width: "100%", height: "100%" }}>
                    <line x1="60" y1="12" x2="20" y2="72" stroke={`${t.text1}15`} strokeWidth="1" />
                    <line x1="60" y1="12" x2="100" y2="72" stroke={`${t.text1}15`} strokeWidth="1" />
                    <line x1="20" y1="72" x2="100" y2="72" stroke={`${t.text1}15`} strokeWidth="1" />
                    <text x="60" y="10" textAnchor="middle" fill={t.text1} fontSize="12" fontFamily={fonts.serif}>{shiDay}</text>
                    <text x="15" y="82" textAnchor="middle" fill={t.text2} fontSize="12" fontFamily={fonts.serif}>{shiMonth}</text>
                    <text x="105" y="82" textAnchor="middle" fill={t.text2} fontSize="12" fontFamily={fonts.serif}>{shiYear}</text>
                </svg>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {data.map((tag, i) => (
                    <span key={i} style={{
                        fontSize: 11,
                        padding: "2px 8px",
                        border: `1px solid ${isSpecial(tag) ? t.text1 + "30" : t.border}`,
                        color: isSpecial(tag) ? t.text1 : t.text3,
                        fontFamily: fonts.serif,
                        background: isSpecial(tag) ? `${t.text1}06` : "transparent",
                        transition: "all 0.3s",
                    }}>
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}

// =====================================
// 【天中殺】Tenchu Section
// =====================================
interface TenchuData {
    グループ: string;
    宿命天中殺: string[];
}

export function TenchuSection({ data, ijokanshi }: { data: TenchuData; ijokanshi: string[] }) {
    const { t } = useTheme();
    return (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderColor: `${t.vermillion}20`, borderRadius: 2, padding: 16, transition: "all 0.3s", boxShadow: t.shadowCard }}>
            <div style={{
                display: "inline-block", fontSize: 11, fontWeight: 600,
                color: t.vermillion, background: t.vermillionBg,
                padding: "2px 8px", fontFamily: fonts.serif, marginBottom: 10, letterSpacing: 1,
            }}>天中殺</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: t.text1, fontFamily: fonts.serif, marginBottom: 12 }}>
                {data.グループ}天中殺
            </div>
            <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: t.text3, fontFamily: fonts.mono, marginBottom: 3, letterSpacing: 1 }}>宿命天中殺</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {data.宿命天中殺 && data.宿命天中殺.length > 0 ? (
                        data.宿命天中殺.map((item, i) => (
                            <span key={i} style={{ fontSize: 11, padding: "2px 6px", background: t.vermillionBg, color: t.vermillion, fontFamily: fonts.serif }}>
                                {item}
                            </span>
                        ))
                    ) : (
                        <span style={{ color: t.text3, fontSize: 12 }}>なし</span>
                    )}
                </div>
            </div>
            <div>
                <div style={{ fontSize: 11, color: t.text4, fontFamily: fonts.mono, marginBottom: 3, letterSpacing: 1 }}>異常干支</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {ijokanshi && ijokanshi.length > 0 ? (
                        ijokanshi.map((item, i) => (
                            <span key={i} style={{ fontSize: 11, padding: "2px 6px", border: `1px solid ${t.warmAccent}30`, color: t.warmAccent, fontFamily: fonts.serif }}>
                                {item}
                            </span>
                        ))
                    ) : (
                        <span style={{ color: t.text3, fontSize: 12 }}>なし</span>
                    )}
                </div>
            </div>
        </div>
    );
}

// =====================================
// 【大運】Daiun Section
// =====================================
interface DaiunCycle {
    年齢: number; 西暦: number; 干支: string;
    十大主星: string; 十二大従星: string; 位相法: string[]; 天中殺: string;
}
interface DaiunData { 立運: number; 方向: string; サイクル: DaiunCycle[]; }

export function DaiunSection({ data, birthYear }: { data: DaiunData; birthYear: number }) {
    const { t } = useTheme();
    const currentYear = new Date().getFullYear();
    const getCurrentDaiunIndex = () => {
        for (let i = data.サイクル.length - 1; i >= 0; i--) {
            if (currentYear >= data.サイクル[i].西暦) return i;
        }
        return 0;
    };
    const currentIdx = getCurrentDaiunIndex();
    const isSpecial = (item: string) => ['半会', '会局', '支合', '冲', '害', '刑', '破', '天剋地冲'].some(s => item.includes(s));

    return (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 2, padding: 16, transition: "all 0.3s", boxShadow: t.shadowCard }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                <div style={{ fontFamily: fonts.mono, fontSize: 11, fontWeight: 500, color: t.text3, letterSpacing: 4, textTransform: "uppercase" as const }}>大運</div>
                <span style={{ fontSize: 11, color: t.text4, fontFamily: fonts.mono }}>開始{data.立運}歳{data.方向}</span>
            </div>
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", fontFamily: fonts.serif }}>
                    <thead>
                        <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                            {["西暦", "歳", "干支", "主星", "従星", "位相法"].map(h => (
                                <th key={h} style={{ padding: "5px 3px", textAlign: "left", fontWeight: 400, fontSize: 11, color: t.text3, fontFamily: fonts.mono, letterSpacing: 1 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.サイクル.slice(0, 10).map((row, i) => {
                            const isCurrent = i === currentIdx;
                            return (
                                <tr key={i} style={{ borderBottom: `1px solid ${t.border}`, background: isCurrent ? `${t.text1}04` : "transparent", transition: "background 0.3s" }}>
                                    <td style={{ padding: "6px 3px", color: t.text2, fontFamily: fonts.mono }}>
                                        {isCurrent && <span style={{ color: t.vermillion, marginRight: 3 }}>▸</span>}
                                        {row.西暦}
                                    </td>
                                    <td style={{ padding: "6px 3px", color: t.text3, fontFamily: fonts.mono }}>{row.年齢}</td>
                                    <td style={{ padding: "6px 3px", color: t.text1, fontWeight: 500 }}>{row.干支}</td>
                                    <td style={{ padding: "6px 3px", color: t.text2 }}>{row.十大主星}</td>
                                    <td style={{ padding: "6px 3px", color: t.text3 }}>{row.十二大従星}</td>
                                    <td style={{ padding: "6px 3px" }}>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                            {row.位相法.slice(0, 3).map((p, j) => (
                                                <span key={j} style={{ fontSize: 10, padding: "1px 4px", background: isSpecial(p) ? `${t.text1}08` : "transparent", color: isSpecial(p) ? t.text1 : t.text3, border: `1px solid ${isSpecial(p) ? t.text1 + "20" : "transparent"}` }}>
                                                    {p}
                                                </span>
                                            ))}
                                            {row.天中殺 && (
                                                <span style={{ fontSize: 10, padding: "1px 4px", background: t.vermillionBg, color: t.vermillion }}>
                                                    {row.天中殺}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// =====================================
// 【年運】Nenun Section
// =====================================
interface NenunData {
    西暦: number; 年齢: number; 干支: string;
    十大主星: string; 十二大従星: string; 位相法: string[]; 天中殺: string;
}

export function NenunSection({ data, limit = 10 }: { data: NenunData[]; limit?: number }) {
    const { t } = useTheme();
    const currentYear = new Date().getFullYear();
    const currentIdx = data.findIndex(d => d.西暦 === currentYear);
    const startIdx = Math.max(0, currentIdx - 2);
    const displayData = data.slice(startIdx, startIdx + limit);
    const isSpecial = (item: string) => ['半会', '会局', '支合', '冲', '害', '刑', '破', '天剋地冲', '納音'].some(s => item.includes(s));

    return (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 2, padding: 16, transition: "all 0.3s", boxShadow: t.shadowCard }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                <div style={{ fontFamily: fonts.mono, fontSize: 11, fontWeight: 500, color: t.text3, letterSpacing: 4, textTransform: "uppercase" as const }}>年運</div>
                <span style={{ fontSize: 11, color: t.text3, fontFamily: fonts.mono }}>直近{limit}年</span>
            </div>
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", fontFamily: fonts.serif }}>
                    <thead>
                        <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                            {["西暦", "歳", "干支", "主星", "従星", "位相法"].map(h => (
                                <th key={h} style={{ padding: "5px 3px", textAlign: "left", fontWeight: 400, fontSize: 11, color: t.text3, fontFamily: fonts.mono, letterSpacing: 1 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {displayData.map((row, i) => {
                            const isCurrent = row.西暦 === currentYear;
                            return (
                                <tr key={i} style={{ borderBottom: `1px solid ${t.border}`, background: isCurrent ? `${t.text1}04` : "transparent", transition: "background 0.3s" }}>
                                    <td style={{ padding: "6px 3px", color: t.text2, fontFamily: fonts.mono }}>
                                        {isCurrent && <span style={{ color: t.vermillion, marginRight: 3 }}>▸</span>}
                                        {row.西暦}
                                    </td>
                                    <td style={{ padding: "6px 3px", color: t.text3, fontFamily: fonts.mono }}>{row.年齢}</td>
                                    <td style={{ padding: "6px 3px", color: t.text1, fontWeight: 500 }}>{row.干支}</td>
                                    <td style={{ padding: "6px 3px", color: t.text2 }}>{row.十大主星}</td>
                                    <td style={{ padding: "6px 3px", color: t.text3 }}>{row.十二大従星}</td>
                                    <td style={{ padding: "6px 3px" }}>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                            {row.位相法.slice(0, 3).map((p, j) => (
                                                <span key={j} style={{ fontSize: 10, padding: "1px 4px", background: isSpecial(p) ? `${t.text1}08` : "transparent", color: isSpecial(p) ? t.text1 : t.text3, border: `1px solid ${isSpecial(p) ? t.text1 + "20" : "transparent"}` }}>
                                                    {p}
                                                </span>
                                            ))}
                                            {row.天中殺 && (
                                                <span style={{ fontSize: 10, padding: "1px 4px", background: t.vermillionBg, color: t.vermillion }}>
                                                    {row.天中殺}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// =====================================
// 【宇宙盤】Uchuban Section
// =====================================
export function UchubanSection({ data }: { data: { 干支番号: number[] } }) {
    const { t } = useTheme();
    const nums = data.干支番号;
    const getPosition = (num: number, radius: number = 35) => {
        const angle = ((num - 1) / 60) * 2 * Math.PI - Math.PI / 2;
        return { x: 50 + radius * Math.cos(angle), y: 50 + radius * Math.sin(angle) };
    };
    const positions = nums.map(n => getPosition(n));

    return (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 2, padding: 20, transition: "all 0.3s", boxShadow: t.shadowCard }}>
            <div style={{ fontFamily: fonts.mono, fontSize: 11, fontWeight: 500, color: t.text3, letterSpacing: 4, textTransform: "uppercase" as const, marginBottom: 14 }}>宇宙盤</div>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <svg viewBox="0 0 100 100" style={{ width: 100, height: 100 }}>
                    <circle cx="50" cy="50" r="40" fill="none" stroke={`${t.text1}10`} strokeWidth="0.8" />
                    <circle cx="50" cy="50" r="28" fill="none" stroke={`${t.text1}06`} strokeWidth="0.5" />
                    {positions.length >= 3 && (
                        <polygon
                            points={`${positions[0].x},${positions[0].y} ${positions[1].x},${positions[1].y} ${positions[2].x},${positions[2].y}`}
                            fill={`${t.text1}05`}
                            stroke={t.text1}
                            strokeWidth="1"
                            opacity="0.4"
                        />
                    )}
                    {positions.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r="3" fill={t.text1} opacity="0.6" />
                    ))}
                </svg>
            </div>
        </div>
    );
}

// =====================================
// 【八門法】Hachimon Section
// =====================================
interface HachimonData { [key: string]: number; }

export function HachimonSection({ data }: { data: HachimonData }) {
    const { t, isDark } = useTheme();
    const gogyoValues = {
        水: data['北方(親・目上/習得)'] || 0,
        木: data['中央(自分/比劫)'] || 0,
        火: data['南方(子供・目下/伝達)'] || 0,
        土: data['東方(家庭・配偶者/蓄積)'] || 0,
        金: data['西方(仕事・社会/名誉)'] || 0,
    };

    const items: { el: string; val: number; color: string }[] = [
        { el: "水", val: gogyoValues.水, color: isDark ? "#6AADE4" : "#5A8EAA" },
        { el: "金", val: gogyoValues.金, color: t.text2 },
        { el: "木", val: gogyoValues.木, color: isDark ? "#7AB87A" : "#6A9E6A" },
        { el: "土", val: gogyoValues.土, color: isDark ? "#A08B6D" : "#8B7355" },
        { el: "火", val: gogyoValues.火, color: isDark ? "#E07050" : "#C75B39" },
    ];
    const layout = [null, items[0], null, items[1], items[2], items[3], null, items[4], null];

    return (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 2, padding: 20, transition: "all 0.3s", boxShadow: t.shadowCard }}>
            <div style={{ fontFamily: fonts.mono, fontSize: 11, fontWeight: 500, color: t.text3, letterSpacing: 4, textTransform: "uppercase" as const, marginBottom: 14 }}>八門法</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, textAlign: "center" }}>
                {layout.map((item, i) =>
                    item ? (
                        <div key={i} style={{ background: `${item.color}10`, border: `1px solid ${item.color}20`, padding: "6px 2px", transition: "all 0.3s" }}>
                            <div style={{ fontSize: 11, color: `${item.color}99`, fontFamily: fonts.serif }}>{item.el}</div>
                            <div style={{ fontSize: 18, fontWeight: 600, color: item.color, fontFamily: fonts.mono }}>{item.val}</div>
                        </div>
                    ) : <div key={i} />
                )}
            </div>
        </div>
    );
}

// =====================================
// 【数理法】Surihou Section
// =====================================
interface SurihouData { 総エネルギー: number; 十干内訳: { [key: string]: number }; }

export function SurihouSection({ data }: { data: SurihouData }) {
    const { t, isDark } = useTheme();
    // 五行ごとに縦配列: 上=陽(+) / 下=陰(-)
    const gogyo: { label: string; yang: string; yin: string; color: string }[] = [
        { label: '木', yang: '甲', yin: '乙', color: isDark ? '#7AB87A' : '#6A9E6A' },
        { label: '火', yang: '丙', yin: '丁', color: isDark ? '#E07050' : '#C75B39' },
        { label: '土', yang: '戊', yin: '己', color: isDark ? '#A08B6D' : '#8B7355' },
        { label: '金', yang: '庚', yin: '辛', color: t.text2 },
        { label: '水', yang: '壬', yin: '癸', color: isDark ? '#6AADE4' : '#5A8EAA' },
    ];

    return (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 2, padding: 20, transition: "all 0.3s", boxShadow: t.shadowCard }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                <div style={{ fontFamily: fonts.mono, fontSize: 11, fontWeight: 500, color: t.text3, letterSpacing: 4, textTransform: "uppercase" as const }}>数理法</div>
                <span style={{ fontSize: 14, fontWeight: 600, color: t.text1, fontFamily: fonts.mono }}>合計 {data.総エネルギー}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 3 }}>
                {gogyo.map((g) => (
                    <div key={g.label} style={{ textAlign: "center" }}>
                        {/* 五行ヘッダー */}
                        <div style={{ fontSize: 12, fontWeight: 600, color: g.color, fontFamily: fonts.serif, marginBottom: 4 }}>{g.label}</div>
                        {/* 陽(+) */}
                        <div style={{ marginBottom: 2 }}>
                            <div style={{ fontSize: 11, color: t.text3, fontFamily: fonts.serif, marginBottom: 1 }}>{g.yang}</div>
                            <div style={{ fontSize: 16, fontWeight: 600, color: t.text1, fontFamily: fonts.mono, background: t.inputBg, padding: "3px 0", transition: "all 0.3s" }}>
                                {data.十干内訳[g.yang] || 0}
                            </div>
                        </div>
                        {/* 陰(-) */}
                        <div>
                            <div style={{ fontSize: 11, color: t.text3, fontFamily: fonts.serif, marginBottom: 1 }}>{g.yin}</div>
                            <div style={{ fontSize: 16, fontWeight: 600, color: t.text1, fontFamily: fonts.mono, background: t.inputBg, padding: "3px 0", transition: "all 0.3s" }}>
                                {data.十干内訳[g.yin] || 0}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// =====================================
// Main TraditionalChart Component
// =====================================
interface TraditionalChartProps {
    report: {
        陰占: InsenData;
        陽占: YosenData;
        位相法: string[];
        大運: DaiunData;
        年運: NenunData[];
        宇宙盤: { 干支番号: number[] };
        八門法: HachimonData;
        数理法: SurihouData;
        天中殺?: TenchuData;
        異常干支?: string[];
    };
    birthYear: number;
}

export function TraditionalChart({ report, birthYear }: TraditionalChartProps) {
    const { t } = useTheme();
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Row 1: 陰占, 陽占, 位相法 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 8 }}>
                <InsenSection data={report.陰占} />
                <YosenSection data={report.陽占} />
                <IsohouSection
                    data={report.位相法}
                    shis={{ 年: report.陰占.年, 月: report.陰占.月, 日: report.陰占.日 }}
                />
            </div>

            {/* Row 2: 天中殺 — フルワイド */}
            {report.天中殺 && (
                <TenchuSection data={report.天中殺} ijokanshi={report.異常干支 || []} />
            )}

            {/* Row 3: 大運・年運 — 横並び */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: 8 }}>
                <DaiunSection data={report.大運} birthYear={birthYear} />
                <NenunSection data={report.年運} />
            </div>

            {/* Row 3: 宇宙盤, 八門法, 数理法 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 8 }}>
                <UchubanSection data={report.宇宙盤} />
                <HachimonSection data={report.八門法} />
                <SurihouSection data={report.数理法} />
            </div>
        </div>
    );
}

export default TraditionalChart;
