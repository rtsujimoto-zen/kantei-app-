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
        return parts.length > 1 ? parts[1].trim().split(' ').filter(Boolean) : [];
    };

    const zokanYear = parseZokan(data.蔵干.年);
    const zokanMonth = parseZokan(data.蔵干.月);
    const zokanDay = parseZokan(data.蔵干.日);
    const senyi = data.蔵干.遷移.replace(/>/g, '').trim().split(' ').filter(Boolean);

    // キャプチャ準拠: 日(左) 月(中) 年(右)
    const cols = [
        { num: day.number, kan: day.kan, shi: day.shi, zokan: zokanDay },
        { num: month.number, kan: month.kan, shi: month.shi, zokan: zokanMonth },
        { num: year.number, kan: year.kan, shi: year.shi, zokan: zokanYear },
    ];

    const cellStyle: React.CSSProperties = {
        textAlign: "center",
        fontFamily: fonts.serif,
        padding: "2px 0",
    };

    return (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 2, padding: 20, transition: "all 0.3s", boxShadow: t.shadowCard }}>
            <div style={{ fontFamily: fonts.serif, fontSize: 12, fontWeight: 600, color: t.text3, letterSpacing: 6, marginBottom: 14 }}>陰占</div>

            {/* テーブル形式で表示 */}
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <tbody>
                    {/* 番号行 */}
                    <tr>
                        <td style={{ ...cellStyle, width: "15%" }} />
                        {cols.map((c, i) => (
                            <td key={`num-${i}`} style={{ ...cellStyle, fontSize: 11, color: t.text3, fontFamily: fonts.mono }}>
                                ({c.num})
                            </td>
                        ))}
                        <td style={{ ...cellStyle, width: "15%" }} />
                    </tr>
                    {/* 天干行 */}
                    <tr>
                        <td style={cellStyle} />
                        {cols.map((c, i) => (
                            <td key={`kan-${i}`} style={{ ...cellStyle, fontSize: 24, fontWeight: 200, color: t.text1, padding: "4px 0" }}>
                                {c.kan}
                            </td>
                        ))}
                        <td style={cellStyle} />
                    </tr>
                    {/* 地支行 (左右に蔵干の追加表示) */}
                    <tr>
                        <td style={{ ...cellStyle, fontSize: 13, color: t.text3 }}>
                            {cols[0].zokan.length > 1 ? cols[0].zokan[1] : ''}
                        </td>
                        {cols.map((c, i) => (
                            <td key={`shi-${i}`} style={{ ...cellStyle, fontSize: 18, color: t.text2, fontWeight: 400, padding: "4px 0" }}>
                                {c.shi}
                            </td>
                        ))}
                        <td style={{ ...cellStyle, fontSize: 13, color: t.text3 }}>
                            {cols[2].zokan.length > 1 ? cols[2].zokan[1] : ''}
                        </td>
                    </tr>
                    {/* 蔵干行 */}
                    <tr>
                        <td style={{ ...cellStyle, fontSize: 13, color: t.text4 }}>
                            {cols[0].zokan.length > 2 ? cols[0].zokan[2] : ''}
                        </td>
                        {cols.map((c, i) => (
                            <td key={`zo-${i}`} style={{ ...cellStyle, fontSize: 13, color: t.text3, padding: "2px 0" }}>
                                {c.zokan[0] || ''}
                            </td>
                        ))}
                        <td style={{ ...cellStyle, fontSize: 13, color: t.text4 }}>
                            {cols[2].zokan.length > 2 ? cols[2].zokan[2] : ''}
                        </td>
                    </tr>
                    {/* 遷移行 */}
                    <tr>
                        <td colSpan={5} style={{ ...cellStyle, fontSize: 10, color: t.text4, paddingTop: 8, letterSpacing: 2 }}>
                            {'> ' + senyi.join(' > ')}
                        </td>
                    </tr>
                </tbody>
            </table>
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
    const { t, isDark } = useTheme();
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
            <div style={{ fontFamily: fonts.serif, fontSize: 12, fontWeight: 600, color: t.text3, letterSpacing: 6, marginBottom: 14 }}>陽占</div>
            <div style={{ position: "relative", overflow: "hidden" }}>
                {/* 人体図 背景画像 */}
                <img
                    src="/body-silhouette.png"
                    alt=""
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -42%)",
                        width: "170%",
                        height: "120%",
                        objectFit: "cover",
                        objectPosition: "center 20%",
                        opacity: isDark ? 0.06 : 0.08,
                        pointerEvents: "none",
                        zIndex: 0,
                        filter: isDark ? "invert(1)" : "none",
                    }}
                />
                {/* 星の配置グリッド */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, position: "relative", zIndex: 1 }}>
                    {grid.map((item, i) => {
                        if (!item) return <div key={i} />;
                        return (
                            <div key={i} style={{
                                background: item.main ? `${t.text1}08` : `${t.inputBg}cc`,
                                border: item.main ? `1px solid ${t.text1}20` : `1px solid ${t.border}`,
                                padding: "14px 3px",
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
        </div>
    );
}

// =====================================
// 【位相法】Isohou Section
// =====================================
export function IsohouSection({ data, shis }: { data: string[]; shis: { 年: string; 月: string; 日: string } }) {
    const { t, isDark } = useTheme();
    const getShi = (str: string) => {
        const match = str.match(/\((\d+)\)\s*(.+)/);
        if (match && match[2].length >= 2) return match[2][1];
        return str.length >= 2 ? str[1] : '';
    };

    const shiDay = getShi(shis.日);
    const shiMonth = getShi(shis.月);
    const shiYear = getShi(shis.年);

    // 位相法データをパースして接続関係を抽出
    // 例: "中央支合(卯辰)" → { type: "中央支合", shis: ["卯", "辰"] }
    const parseRelation = (tag: string) => {
        const match = tag.match(/(.+?)\((.+)\)/);
        if (match) {
            const chars = match[2].split('');
            return { name: match[1], shis: chars };
        }
        return { name: tag, shis: [] as string[] };
    };

    const isNegative = (name: string) => {
        return ['冲', '害', '刑', '破', '天剋地冲'].some(s => name.includes(s));
    };

    const isPositive = (name: string) => {
        return ['半会', '会局', '支合', '合'].some(s => name.includes(s));
    };

    // 地支の配置: 月支(左) - 日支(中) - 年支(右) → キャプチャ準拠は 月 日 年
    // キャプチャを見ると 亥 卯 辰 で、月支 日支 年支の順
    const shiLabels = [
        { label: shiMonth, key: '月' },
        { label: shiDay, key: '日' },
        { label: shiYear, key: '年' },
    ];

    const relations = data.map(parseRelation);

    // 方位名から接続する柱のインデックスを決定
    // 中央 = 月支(0) - 日支(1), 西方 = 日支(1) - 年支(2), 東方 = 月支(0) - 年支(2)
    const getIndicesFromDirection = (name: string): [number, number] | null => {
        if (name.includes('中央')) return [0, 1];
        if (name.includes('西方')) return [1, 2];
        if (name.includes('東方')) return [0, 2];
        // 方位が含まれない場合は地支文字からフォールバック
        return null;
    };

    const getShiIndex = (char: string): number => {
        if (char === shiMonth) return 0;
        if (char === shiDay) return 1;
        if (char === shiYear) return 2;
        return -1;
    };

    // SVGで接続図を描画
    const svgW = 240;
    const svgH = 40 + relations.length * 32;
    const shiX = [40, 120, 200]; // 各地支のX座標

    return (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 2, padding: 20, transition: "all 0.3s", boxShadow: t.shadowCard }}>
            <div style={{ fontFamily: fonts.serif, fontSize: 12, fontWeight: 600, color: t.text3, letterSpacing: 6, marginBottom: 14 }}>位相法</div>

            {/* 地支を横一列に表示 */}
            <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 4 }}>
                {shiLabels.map((s, i) => (
                    <div key={i} style={{
                        fontSize: 16, fontWeight: 500, color: t.text1,
                        fontFamily: fonts.serif, textAlign: "center",
                        width: 60,
                    }}>
                        {s.label}
                    </div>
                ))}
            </div>

            {/* 接続ライン図 */}
            {relations.length > 0 && (
                <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: "100%", height: svgH * 0.7, display: "block" }}>
                    {/* 地支位置からの垂直ドロップライン */}
                    {shiLabels.map((_, i) => (
                        <line key={`drop-${i}`}
                            x1={shiX[i]} y1={0} x2={shiX[i]} y2={svgH - 4}
                            stroke={`${t.text1}12`} strokeWidth="1"
                        />
                    ))}
                    {/* 各関係の接続ライン */}
                    {relations.map((rel, ri) => {
                        const y = 14 + ri * 32;
                        // 方位名から接続インデックスを取得（優先）、なければ地支文字からフォールバック
                        const dirIndices = getIndicesFromDirection(rel.name);
                        let idx0: number, idx1: number;
                        if (dirIndices) {
                            [idx0, idx1] = dirIndices;
                        } else if (rel.shis.length >= 2) {
                            idx0 = getShiIndex(rel.shis[0]);
                            idx1 = getShiIndex(rel.shis[1]);
                        } else {
                            return null;
                        }
                        if (idx0 === -1 || idx1 === -1) return null;

                        const x0 = shiX[Math.min(idx0, idx1)];
                        const x1 = shiX[Math.max(idx0, idx1)];
                        const midX = (x0 + x1) / 2;

                        const color = isNegative(rel.name) ? (isDark ? '#E07050' : '#C75B39')
                            : isPositive(rel.name) ? (isDark ? '#6AADE4' : '#2E6FA8')
                                : t.text3;

                        return (
                            <g key={ri}>
                                {/* 水平接続ライン */}
                                <line x1={x0} y1={y} x2={x1} y2={y} stroke={color} strokeWidth="1.5" />
                                {/* 左端のドロップ */}
                                <line x1={x0} y1={y - 6} x2={x0} y2={y} stroke={color} strokeWidth="1.5" />
                                {/* 右端のドロップ */}
                                <line x1={x1} y1={y - 6} x2={x1} y2={y} stroke={color} strokeWidth="1.5" />
                                {/* 関係ラベル */}
                                <text x={midX} y={y + 14} textAnchor="middle" fill={color} fontSize="11" fontFamily={fonts.serif} fontWeight="600">
                                    {rel.name}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            )}

            {/* 関係なしの表示 */}
            {data.length === 0 && (
                <div style={{ textAlign: "center", fontSize: 11, color: t.text4, padding: "12px 0", fontFamily: fonts.serif }}>
                    なし
                </div>
            )}
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
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 2, padding: 16, transition: "all 0.3s", boxShadow: t.shadowCard }}>
            <div style={{ fontFamily: fonts.serif, fontSize: 12, fontWeight: 600, color: t.text3, letterSpacing: 6, marginBottom: 10 }}>天中殺</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: t.text1, fontFamily: fonts.serif, marginBottom: 12 }}>
                {data.グループ}天中殺
            </div>
            <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: t.text3, fontFamily: fonts.serif, marginBottom: 3, letterSpacing: 1 }}>宿命天中殺</div>
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
                <div style={{ fontSize: 11, color: t.text4, fontFamily: fonts.serif, marginBottom: 3, letterSpacing: 1 }}>異常干支</div>
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
                <div style={{ fontFamily: fonts.serif, fontSize: 12, fontWeight: 600, color: t.text3, letterSpacing: 6 }}>大運</div>
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
                <div style={{ fontFamily: fonts.serif, fontSize: 12, fontWeight: 600, color: t.text3, letterSpacing: 6 }}>年運</div>
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
    const cx = 150, cy = 150;
    const outerR = 138, numberR = 122, tickR = 132, innerR = 110, dotR = 100;

    const getPos = (num: number, r: number) => {
        const angle = ((num - 1) / 60) * 2 * Math.PI - Math.PI / 2;
        return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    };

    const positions = nums.map(n => getPos(n, dotR));

    // 区切り線の位置（1, 16, 31, 46番の位置で4分割）
    const dividers = [1, 16, 31, 46].map(n => {
        const inner = getPos(n, 40);
        const outer = getPos(n, innerR);
        return { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y };
    });

    return (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 2, padding: 20, transition: "all 0.3s", boxShadow: t.shadowCard }}>
            <div style={{ fontFamily: fonts.serif, fontSize: 12, fontWeight: 600, color: t.text3, letterSpacing: 6, marginBottom: 14 }}>宇宙盤</div>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <svg viewBox="0 0 300 300" style={{ width: 280, height: 280, maxWidth: "100%" }}>
                    {/* 外周円 */}
                    <circle cx={cx} cy={cy} r={outerR} fill="none" stroke={`${t.text1}18`} strokeWidth="0.8" />
                    <circle cx={cx} cy={cy} r={innerR} fill="none" stroke={`${t.text1}12`} strokeWidth="0.5" />

                    {/* 1-60の目盛りと番号 */}
                    {Array.from({ length: 60 }, (_, i) => {
                        const num = i + 1;
                        const tickStart = getPos(num, tickR);
                        const tickEnd = getPos(num, outerR);
                        const labelPos = getPos(num, numberR);
                        const angle = ((num - 1) / 60) * 360 - 90;
                        const isHighlighted = nums.includes(num);
                        return (
                            <g key={num}>
                                {/* 目盛り線 */}
                                <line
                                    x1={tickStart.x} y1={tickStart.y}
                                    x2={tickEnd.x} y2={tickEnd.y}
                                    stroke={`${t.text1}${isHighlighted ? '60' : '20'}`}
                                    strokeWidth={num % 5 === 0 ? 1 : 0.5}
                                />
                                {/* 番号 */}
                                <text
                                    x={labelPos.x} y={labelPos.y}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fontSize={num % 5 === 0 ? 7 : 5.5}
                                    fontFamily={fonts.mono}
                                    fill={isHighlighted ? t.text1 : `${t.text1}40`}
                                    fontWeight={isHighlighted ? 700 : 400}
                                    transform={`rotate(${angle + 90}, ${labelPos.x}, ${labelPos.y})`}
                                >
                                    {num}
                                </text>
                            </g>
                        );
                    })}

                    {/* 4分割の区切り線 */}
                    {dividers.map((d, i) => (
                        <line
                            key={`div-${i}`}
                            x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2}
                            stroke={`${t.text1}20`}
                            strokeWidth="0.8"
                        />
                    ))}

                    {/* 三角形ポリゴン */}
                    {positions.length >= 3 && (
                        <polygon
                            points={positions.map(p => `${p.x},${p.y}`).join(' ')}
                            fill={`${t.text1}08`}
                            stroke={t.text1}
                            strokeWidth="1.2"
                            opacity="0.5"
                        />
                    )}

                    {/* ハイライトされた点 */}
                    {positions.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r="4" fill={t.text1} opacity="0.7" />
                    ))}

                    {/* 干支番号のラベル（点の横） */}
                    {positions.map((p, i) => {
                        const labelR = dotR - 12;
                        const lp = getPos(nums[i], labelR);
                        return (
                            <text
                                key={`label-${i}`}
                                x={lp.x} y={lp.y}
                                textAnchor="middle"
                                dominantBaseline="central"
                                fontSize="8"
                                fontFamily={fonts.mono}
                                fontWeight={700}
                                fill={t.text1}
                            >
                                {nums[i]}
                            </text>
                        );
                    })}
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
            <div style={{ fontFamily: fonts.serif, fontSize: 12, fontWeight: 600, color: t.text3, letterSpacing: 6, marginBottom: 14 }}>八門法</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, textAlign: "center" }}>
                {layout.map((item, i) =>
                    item ? (
                        <div key={i} style={{ background: `${item.color}10`, border: `1px solid ${item.color}20`, padding: "6px 2px", transition: "all 0.3s" }}>
                            <div style={{ fontSize: 11, color: `${item.color}99`, fontFamily: fonts.serif }}>{item.el}</div>
                            <div style={{ fontSize: 18, fontWeight: 600, color: item.color, fontFamily: fonts.serif }}>{item.val}</div>
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
                <div style={{ fontFamily: fonts.serif, fontSize: 12, fontWeight: 600, color: t.text3, letterSpacing: 6 }}>数理法</div>
                <span style={{ fontSize: 14, fontWeight: 600, color: t.text1, fontFamily: fonts.serif }}>合計 {data.総エネルギー}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 3 }}>
                {gogyo.map((g) => (
                    <div key={g.label} style={{ textAlign: "center" }}>
                        {/* 五行ヘッダー */}
                        <div style={{ fontSize: 12, fontWeight: 600, color: g.color, fontFamily: fonts.serif, marginBottom: 4 }}>{g.label}</div>
                        {/* 陽(+) */}
                        <div style={{ marginBottom: 2 }}>
                            <div style={{ fontSize: 11, color: t.text3, fontFamily: fonts.serif, marginBottom: 1 }}>{g.yang}</div>
                            <div style={{ fontSize: 16, fontWeight: 600, color: t.text1, fontFamily: fonts.serif, background: t.inputBg, padding: "3px 0", transition: "all 0.3s" }}>
                                {data.十干内訳[g.yang] || 0}
                            </div>
                        </div>
                        {/* 陰(-) */}
                        <div>
                            <div style={{ fontSize: 11, color: t.text3, fontFamily: fonts.serif, marginBottom: 1 }}>{g.yin}</div>
                            <div style={{ fontSize: 16, fontWeight: 600, color: t.text1, fontFamily: fonts.serif, background: t.inputBg, padding: "3px 0", transition: "all 0.3s" }}>
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
