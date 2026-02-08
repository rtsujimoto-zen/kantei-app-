import { useState, createContext, useContext } from "react";

// ============================================================
// TEIŌ算命学 — White/Black Monochrome Toggle Design
// ============================================================
// 現行サイト構成: Header → Input → Chart(9 sections) → Prompt Data → AI軍師
// テーマ: teio-light.jsx + teio-monochrome.jsx を統合
// デフォルト: Light（白）
// ============================================================

// --- Theme System ---
const themes = {
    light: {
        bg: "#FAFAF8",
        bgWarm: "#F5F3EF",
        card: "#FFFFFF",
        cardHover: "#F8F7F5",
        border: "#E8E6E2",
        borderLight: "#F0EEEA",
        borderDark: "#D4D1CC",
        text1: "#1A1A1A",
        text2: "#5C5C5C",
        text3: "#999894",
        text4: "#C4C2BD",
        accent: "#1A1A1A",
        warmAccent: "#8B7355",
        vermillion: "#C4513D",
        vermillionBg: "#C4513D0A",
        barFill: "#1A1A1A",
        barTrack: "#F0EEEA",
        inputBg: "rgba(0,0,0,0.02)",
        inputBorder: "#E8E6E2",
        activeChip: "#1A1A1A",
        activeChipText: "#FFFFFF",
        shadowCard: "0 1px 3px rgba(0,0,0,0.04)",
        promptBg: "#F5F3EF",
        toggleBg: "#E8E6E2",
        toggleKnob: "#FFFFFF",
        toggleIcon: "#1A1A1A",
        scrollbarThumb: "#D4D1CC",
    },
    dark: {
        bg: "#050505",
        bgWarm: "#0C0C0C",
        card: "#0C0C0C",
        cardHover: "#111111",
        border: "#1A1A1A",
        borderLight: "#252525",
        borderDark: "#333333",
        text1: "#FFFFFF",
        text2: "#999999",
        text3: "#555555",
        text4: "#333333",
        accent: "#FFFFFF",
        warmAccent: "#666666",
        vermillion: "#FF3B30",
        vermillionBg: "#FF3B3008",
        barFill: "#FFFFFF",
        barTrack: "#1A1A1A",
        inputBg: "rgba(255,255,255,0.04)",
        inputBorder: "#1A1A1A",
        activeChip: "#FFFFFF",
        activeChipText: "#000000",
        shadowCard: "none",
        promptBg: "#0C0C0C",
        toggleBg: "#1A1A1A",
        toggleKnob: "#FFFFFF",
        toggleIcon: "#000000",
        scrollbarThumb: "#333333",
    },
};

const ThemeContext = createContext(themes.light);
const useTheme = () => useContext(ThemeContext);

const fonts = {
    serif: "'Noto Serif JP', serif",
    mono: "'DM Mono', monospace",
    display: "'Cormorant Garamond', serif",
};

// ===== Shared Components =====

const ThemeToggle = ({ isDark, onToggle }) => {
    const t = useTheme();
    return (
        <button
            onClick={onToggle}
            aria-label="テーマ切替"
            style={{
                width: 48,
                height: 26,
                borderRadius: 13,
                border: `1px solid ${t.border}`,
                background: t.toggleBg,
                position: "relative",
                cursor: "pointer",
                transition: "all 0.3s ease",
                flexShrink: 0,
                padding: 0,
            }}
        >
            <div
                style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: t.toggleKnob,
                    position: "absolute",
                    top: 2,
                    left: isDark ? 25 : 3,
                    transition: "left 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                }}
            >
                <span style={{ fontSize: 10, color: t.toggleIcon, lineHeight: 1 }}>
                    {isDark ? "●" : "○"}
                </span>
            </div>
        </button>
    );
};

const Divider = ({ style = {} }) => {
    const t = useTheme();
    return <div style={{ height: 1, background: t.border, width: "100%", ...style }} />;
};

const SectionLabel = ({ children, right }) => {
    const t = useTheme();
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
            <span
                style={{
                    fontSize: 9,
                    fontWeight: 500,
                    color: t.text3,
                    letterSpacing: 4,
                    textTransform: "uppercase",
                    fontFamily: fonts.mono,
                }}
            >
                {children}
            </span>
            {right && (
                <span style={{ fontSize: 9, color: t.text4, fontFamily: fonts.mono }}>{right}</span>
            )}
        </div>
    );
};

const Card = ({ children, style = {}, elevated = false }) => {
    const t = useTheme();
    return (
        <div
            style={{
                background: t.card,
                border: `1px solid ${t.border}`,
                borderRadius: 2,
                padding: 20,
                position: "relative",
                transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
                boxShadow: elevated ? t.shadowCard : "none",
                ...style,
            }}
        >
            {children}
        </div>
    );
};

const Seal = ({ text, size = 30 }) => {
    const t = useTheme();
    return (
        <div
            style={{
                width: size,
                height: size,
                border: `1.5px solid ${t.vermillion}`,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: "rotate(-6deg)",
                background: t.vermillionBg,
            }}
        >
            <span
                style={{
                    color: t.vermillion,
                    fontSize: size * 0.4,
                    fontWeight: 700,
                    fontFamily: fonts.serif,
                    lineHeight: 1,
                }}
            >
                {text}
            </span>
        </div>
    );
};

// ===== Header =====
const Header = ({ isDark, onToggle }) => {
    const t = useTheme();
    return (
        <header style={{ padding: "44px 24px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 9, color: t.text3, letterSpacing: 2 }}>
                        算命学鑑定
                    </div>
                    <h1
                        style={{
                            fontFamily: fonts.display,
                            fontSize: 40,
                            fontWeight: 300,
                            color: t.text1,
                            letterSpacing: 12,
                            lineHeight: 1,
                            margin: "8px 0 4px",
                        }}
                    >
                        TEIŌ
                    </h1>
                    <div style={{ fontFamily: fonts.mono, fontSize: 8, color: t.text4, letterSpacing: 4 }}>
                        IMPERIAL STUDIES
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <ThemeToggle isDark={isDark} onToggle={onToggle} />
                    <Seal text="帝" />
                </div>
            </div>
            <div style={{ marginTop: 20 }}>
                <Divider />
            </div>
        </header>
    );
};

// ===== Input Section =====
const InputSection = () => {
    const t = useTheme();
    const [gender, setGender] = useState("M");
    return (
        <div style={{ padding: "24px 24px 0" }}>
            <SectionLabel>鑑定入力</SectionLabel>
            <Card elevated style={{ padding: 24 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                    <div>
                        <label style={{ display: "block", fontSize: 8, color: t.text4, letterSpacing: 2, fontFamily: fonts.mono, textTransform: "uppercase", marginBottom: 6 }}>
                            生年月日
                        </label>
                        <input
                            type="date"
                            defaultValue="1988-03-21"
                            style={{
                                width: "100%",
                                background: t.inputBg,
                                border: `1px solid ${t.inputBorder}`,
                                borderRadius: 0,
                                padding: "10px 12px",
                                color: t.text1,
                                fontFamily: fonts.mono,
                                fontSize: 13,
                                outline: "none",
                                transition: "all 0.3s",
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: 8, color: t.text4, letterSpacing: 2, fontFamily: fonts.mono, textTransform: "uppercase", marginBottom: 6 }}>
                            性別
                        </label>
                        <div style={{ display: "flex", border: `1px solid ${t.inputBorder}`, background: t.inputBg }}>
                            {["M", "F"].map((g) => (
                                <button
                                    key={g}
                                    onClick={() => setGender(g)}
                                    style={{
                                        flex: 1,
                                        padding: "10px 0",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: 12,
                                        fontFamily: fonts.serif,
                                        fontWeight: gender === g ? 600 : 300,
                                        color: gender === g ? t.activeChipText : t.text3,
                                        background: gender === g ? t.activeChip : "transparent",
                                        transition: "all 0.2s",
                                    }}
                                >
                                    {g === "M" ? "男性" : "女性"}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <button
                    style={{
                        width: "100%",
                        padding: "13px 0",
                        border: `1.5px solid ${t.text1}`,
                        borderRadius: 0,
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: fonts.serif,
                        letterSpacing: 4,
                        color: t.text1,
                        background: "transparent",
                        transition: "all 0.2s",
                    }}
                >
                    鑑定する
                </button>
            </Card>
        </div>
    );
};

// ===== 陰占 =====
const InsenSection = () => {
    const t = useTheme();
    const cols = [
        { label: "日", num: "01", kan: "庚", shi: "寅", zo: "甲", sen: "壬" },
        { label: "月", num: "55", kan: "甲", shi: "寅", zo: "甲", sen: "丁" },
        { label: "年", num: "05", kan: "戊", shi: "辰", zo: "乙", sen: "癸" },
    ];
    return (
        <Card elevated>
            <SectionLabel>陰占</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, textAlign: "center" }}>
                {cols.map((c) => (
                    <div key={c.label}>
                        <div style={{ fontSize: 9, color: t.text3, fontFamily: fonts.mono, marginBottom: 4 }}>
                            {c.label}({c.num})
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 200, color: t.text1, fontFamily: fonts.serif, lineHeight: 1.2 }}>
                            {c.kan}
                        </div>
                        <div style={{ fontSize: 16, color: t.text2, fontFamily: fonts.serif }}>{c.shi}</div>
                        <div style={{ fontSize: 9, color: t.text3, marginTop: 6, fontFamily: fonts.serif }}>{c.zo}</div>
                        <div style={{ fontSize: 8, color: t.text4 }}>→ {c.sen}</div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

// ===== 陽占 =====
const YosenSection = () => {
    const t = useTheme();
    const grid = [
        [null, "貫索星", "天報星"],
        ["石門星", { main: true, v: "鳳閣星" }, "禄存星"],
        ["司禄星", "天庫星", "天将星"],
    ];
    return (
        <Card elevated>
            <SectionLabel>陽占</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
                {grid.flat().map((item, i) => {
                    if (!item) return <div key={i} />;
                    const isMain = typeof item === "object";
                    const label = isMain ? item.v : item;
                    return (
                        <div
                            key={i}
                            style={{
                                background: isMain ? `${t.text1}08` : t.inputBg,
                                border: isMain ? `1px solid ${t.text1}20` : `1px solid ${t.border}`,
                                borderRadius: 0,
                                padding: "7px 3px",
                                textAlign: "center",
                                fontSize: isMain ? 11 : 10,
                                fontWeight: isMain ? 600 : 300,
                                color: isMain ? t.text1 : t.text2,
                                fontFamily: fonts.serif,
                                transition: "all 0.3s",
                            }}
                        >
                            {label}
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

// ===== 位相法 =====
const IsohouSection = () => {
    const t = useTheme();
    const tags = ["半会(火)", "害(未-丑)", "なし"];
    const isActive = (tag) => ["半会", "会局", "支合", "冲", "害", "刑", "破"].some((s) => tag.includes(s));
    return (
        <Card elevated>
            <SectionLabel>位相法</SectionLabel>
            <div style={{ position: "relative", width: "100%", height: 100, marginBottom: 10 }}>
                <svg viewBox="0 0 120 90" style={{ width: "100%", height: "100%" }}>
                    <line x1="60" y1="12" x2="20" y2="72" stroke={`${t.text1}15`} strokeWidth="1" />
                    <line x1="60" y1="12" x2="100" y2="72" stroke={`${t.text1}15`} strokeWidth="1" />
                    <line x1="20" y1="72" x2="100" y2="72" stroke={`${t.text1}15`} strokeWidth="1" />
                    <text x="60" y="10" textAnchor="middle" fill={t.text1} fontSize="10" fontFamily={fonts.serif}>寅</text>
                    <text x="15" y="82" textAnchor="middle" fill={t.text2} fontSize="10" fontFamily={fonts.serif}>寅</text>
                    <text x="105" y="82" textAnchor="middle" fill={t.text2} fontSize="10" fontFamily={fonts.serif}>辰</text>
                </svg>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {tags.map((tag, i) => (
                    <span
                        key={i}
                        style={{
                            fontSize: 9,
                            padding: "2px 8px",
                            border: `1px solid ${isActive(tag) ? t.text1 + "30" : t.border}`,
                            color: isActive(tag) ? t.text1 : t.text3,
                            fontFamily: fonts.serif,
                            background: isActive(tag) ? `${t.text1}06` : "transparent",
                            transition: "all 0.3s",
                        }}
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </Card>
    );
};

// ===== 天中殺 =====
const TenchuSection = () => {
    const t = useTheme();
    return (
        <Card elevated style={{ borderColor: `${t.vermillion}20` }}>
            <div
                style={{
                    display: "inline-block",
                    fontSize: 9,
                    fontWeight: 600,
                    color: t.vermillion,
                    background: t.vermillionBg,
                    padding: "2px 8px",
                    fontFamily: fonts.serif,
                    marginBottom: 10,
                    letterSpacing: 1,
                }}
            >
                天中殺
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: t.text1, fontFamily: fonts.serif, marginBottom: 12 }}>
                午未天中殺
            </div>
            <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 9, color: t.text3, fontFamily: fonts.mono, marginBottom: 3, letterSpacing: 1 }}>宿命天中殺</div>
                <span style={{ fontSize: 9, padding: "2px 6px", background: t.vermillionBg, color: t.vermillion, fontFamily: fonts.serif }}>
                    生月天中殺
                </span>
            </div>
            <div>
                <div style={{ fontSize: 9, color: t.text4, fontFamily: fonts.mono, marginBottom: 3, letterSpacing: 1 }}>異常干支</div>
                <span style={{ fontSize: 10, color: t.text3, fontFamily: fonts.serif }}>なし</span>
            </div>
        </Card>
    );
};

// ===== Table Row Helper =====
const DataTable = ({ headers, rows, currentCheck }) => {
    const t = useTheme();
    const isSpecial = (tag) => ["半会", "会局", "支合", "冲", "害", "刑", "破", "納音"].some((s) => tag.includes(s));
    return (
        <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", fontSize: 10, borderCollapse: "collapse", fontFamily: fonts.serif }}>
                <thead>
                    <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                        {headers.map((h) => (
                            <th key={h} style={{ padding: "5px 3px", textAlign: "left", fontWeight: 400, fontSize: 9, color: t.text3, fontFamily: fonts.mono, letterSpacing: 1 }}>
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, i) => {
                        const isCurrent = currentCheck(r);
                        return (
                            <tr key={i} style={{ borderBottom: `1px solid ${t.border}`, background: isCurrent ? `${t.text1}04` : "transparent", transition: "background 0.3s" }}>
                                <td style={{ padding: "6px 3px", color: t.text2, fontFamily: fonts.mono }}>
                                    {isCurrent && <span style={{ marginRight: 3 }}>▸</span>}
                                    {r.yr}
                                </td>
                                <td style={{ padding: "6px 3px", color: t.text3, fontFamily: fonts.mono }}>{r.age}</td>
                                <td style={{ padding: "6px 3px", color: t.text1, fontWeight: 500 }}>{r.ks}</td>
                                <td style={{ padding: "6px 3px", color: t.text2 }}>{r.main}</td>
                                <td style={{ padding: "6px 3px", color: t.text3 }}>{r.sub}</td>
                                <td style={{ padding: "6px 3px" }}>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                        {(r.iso || []).map((p, j) => (
                                            <span key={j} style={{ fontSize: 8, padding: "1px 4px", background: isSpecial(p) ? `${t.text1}08` : "transparent", color: isSpecial(p) ? t.text1 : t.text3, border: `1px solid ${isSpecial(p) ? t.text1 + "20" : "transparent"}` }}>
                                                {p}
                                            </span>
                                        ))}
                                        {r.tc && (
                                            <span style={{ fontSize: 8, padding: "1px 4px", background: t.vermillionBg, color: t.vermillion }}>
                                                {r.tc}
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
    );
};

// ===== 大運 =====
const DaiunSection = () => {
    const t = useTheme();
    const rows = [
        { yr: 1995, age: 7, ks: "乙丑", main: "調舒星", sub: "天将星", iso: ["半会"], tc: "" },
        { yr: 2005, age: 17, ks: "甲子", main: "禄存星", sub: "天庫星", iso: ["冲"], tc: "" },
        { yr: 2015, age: 27, ks: "癸亥", main: "司禄星", sub: "天報星", iso: [], tc: "" },
        { yr: 2025, age: 37, ks: "壬戌", main: "車騎星", sub: "天南星", iso: ["害"], tc: "天中殺" },
        { yr: 2035, age: 47, ks: "辛酉", main: "牽牛星", sub: "天禄星", iso: [], tc: "" },
    ];
    return (
        <Card elevated>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                <SectionLabel>大運</SectionLabel>
                <span style={{ fontSize: 9, color: t.text4, fontFamily: fonts.mono }}>開始7歳順</span>
            </div>
            <DataTable headers={["西暦", "歳", "干支", "主星", "従星", "位相法"]} rows={rows} currentCheck={(r) => r.yr === 2025} />
        </Card>
    );
};

// ===== 年運 =====
const NenunSection = () => {
    const t = useTheme();
    const rows = [
        { yr: 2024, age: 36, ks: "甲辰", main: "禄存星", sub: "天胡星", iso: [], tc: "" },
        { yr: 2025, age: 37, ks: "乙巳", main: "司禄星", sub: "天堂星", iso: ["半会"], tc: "" },
        { yr: 2026, age: 38, ks: "丙午", main: "車騎星", sub: "天将星", iso: [], tc: "天中殺" },
        { yr: 2027, age: 39, ks: "丁未", main: "牽牛星", sub: "天禄星", iso: ["冲"], tc: "天中殺" },
        { yr: 2028, age: 40, ks: "戊申", main: "龍高星", sub: "天南星", iso: [], tc: "" },
    ];
    return (
        <Card elevated>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                <SectionLabel>年運</SectionLabel>
                <span style={{ fontSize: 9, color: t.text3, fontFamily: fonts.mono }}>直近10年</span>
            </div>
            <DataTable headers={["西暦", "歳", "干支", "主星", "従星", "位相法"]} rows={rows} currentCheck={(r) => r.yr === 2026} />
        </Card>
    );
};

// ===== 宇宙盤 =====
const UchubanSection = () => {
    const t = useTheme();
    const nums = [1, 55, 5];
    const getPos = (n) => {
        const a = ((n - 1) / 60) * 2 * Math.PI - Math.PI / 2;
        return { x: 50 + 35 * Math.cos(a), y: 50 + 35 * Math.sin(a) };
    };
    const pos = nums.map(getPos);
    return (
        <Card elevated>
            <SectionLabel>宇宙盤</SectionLabel>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <svg viewBox="0 0 100 100" style={{ width: 100, height: 100 }}>
                    <circle cx="50" cy="50" r="40" fill="none" stroke={`${t.text1}10`} strokeWidth="0.8" />
                    <circle cx="50" cy="50" r="28" fill="none" stroke={`${t.text1}06`} strokeWidth="0.5" />
                    {pos.length >= 3 && (
                        <polygon
                            points={`${pos[0].x},${pos[0].y} ${pos[1].x},${pos[1].y} ${pos[2].x},${pos[2].y}`}
                            fill={`${t.text1}05`}
                            stroke={t.text1}
                            strokeWidth="1"
                            opacity="0.4"
                        />
                    )}
                    {pos.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r="3" fill={t.text1} opacity="0.6" />
                    ))}
                </svg>
            </div>
        </Card>
    );
};

// ===== 八門法 =====
const HachimonSection = () => {
    const t = useTheme();
    const items = [
        { el: "水", val: 3, color: "#5A8EAA" },
        { el: "金", val: 5, color: t.text2 },
        { el: "木", val: 4, color: "#6A9E6A" },
        { el: "土", val: 2, color: "#8B7355" },
        { el: "火", val: 6, color: "#C75B39" },
    ];
    const layout = [null, items[0], null, items[1], items[2], items[3], null, items[4], null];
    return (
        <Card elevated>
            <SectionLabel>八門法</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, textAlign: "center" }}>
                {layout.map((item, i) =>
                    item ? (
                        <div key={i} style={{ background: `${item.color}10`, border: `1px solid ${item.color}20`, padding: "6px 2px", transition: "all 0.3s" }}>
                            <div style={{ fontSize: 9, color: `${item.color}99`, fontFamily: fonts.serif }}>{item.el}</div>
                            <div style={{ fontSize: 16, fontWeight: 600, color: item.color, fontFamily: fonts.mono }}>{item.val}</div>
                        </div>
                    ) : <div key={i} />
                )}
            </div>
        </Card>
    );
};

// ===== 数理法 =====
const SurihouSection = () => {
    const t = useTheme();
    const row1 = [{ k: "甲", v: 12 }, { k: "乙", v: 9 }, { k: "丙", v: 18 }, { k: "丁", v: 6 }, { k: "戊", v: 15 }];
    const row2 = [{ k: "己", v: 3 }, { k: "庚", v: 21 }, { k: "辛", v: 7 }, { k: "壬", v: 14 }, { k: "癸", v: 10 }];
    const total = [...row1, ...row2].reduce((s, r) => s + r.v, 0);
    return (
        <Card elevated>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                <SectionLabel>数理法</SectionLabel>
                <span style={{ fontSize: 12, fontWeight: 600, color: t.text1, fontFamily: fonts.mono }}>合計 {total}</span>
            </div>
            {[row1, row2].map((row, ri) => (
                <div key={ri} style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 3, marginBottom: ri === 0 ? 4 : 0 }}>
                    {row.map((item) => (
                        <div key={item.k} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 9, color: t.text3, fontFamily: fonts.serif, marginBottom: 2 }}>{item.k}</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: t.text1, fontFamily: fonts.mono, background: t.inputBg, padding: "3px 0", transition: "all 0.3s" }}>
                                {item.v}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </Card>
    );
};

// ===== Prompt Data =====
const PromptDataSection = () => {
    const t = useTheme();
    return (
        <Card style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", borderBottom: `1px solid ${t.border}` }}>
                <span style={{ fontSize: 10, fontWeight: 500, color: t.text3, letterSpacing: 3, fontFamily: fonts.mono }}>PROMPT DATA</span>
                <button style={{ background: "none", border: "none", color: t.text3, fontSize: 10, cursor: "pointer", fontFamily: fonts.mono }}>Copy</button>
            </div>
            <pre style={{ padding: 20, color: t.text2, fontSize: 10, fontFamily: fonts.mono, lineHeight: 1.8, whiteSpace: "pre-wrap", maxHeight: 220, overflowY: "auto", margin: 0, background: t.promptBg, transition: "all 0.3s" }}>
                {`■ 陰占
日柱: 庚寅  月柱: 甲寅  年柱: 戊辰
蔵干: 甲 甲 乙
遷移: 壬 丁 癸
...`}
            </pre>
        </Card>
    );
};

// ===== AI軍師 =====
const StrategistSection = () => {
    const t = useTheme();
    return (
        <Card style={{ padding: 0, overflow: "hidden", borderColor: `${t.text1}15` }}>
            <div style={{ padding: "20px 24px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 3, height: 14, background: t.text1, borderRadius: 1, opacity: 0.4 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: t.text1, fontFamily: fonts.serif, letterSpacing: 2 }}>AI軍師</span>
                    <span style={{ fontSize: 8, color: t.text4, fontFamily: fonts.mono, marginLeft: "auto", letterSpacing: 2 }}>IMPERIAL STRATEGIST</span>
                </div>
                <div style={{ display: "flex", gap: 5, marginBottom: 16, flexWrap: "wrap" }}>
                    {["陰陽師", "プロ向け", "Gemini Pro"].map((label) => (
                        <span key={label} style={{ fontSize: 9, padding: "3px 10px", border: `1px solid ${t.border}`, color: t.text3, fontFamily: fonts.serif, background: t.inputBg, transition: "all 0.3s" }}>
                            {label}
                        </span>
                    ))}
                </div>
                <button style={{ width: "100%", padding: "13px 0", border: `1.5px solid ${t.text1}`, borderRadius: 0, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: fonts.serif, letterSpacing: 3, color: t.text1, background: "transparent", transition: "all 0.2s" }}>
                    軍師に相談する
                </button>
            </div>
            <div style={{ borderTop: `1px solid ${t.border}`, padding: "20px 24px" }}>
                <div style={{ borderLeft: `2px solid ${t.text1}20`, paddingLeft: 16 }}>
                    <p style={{ fontSize: 13, lineHeight: 2, color: t.text1, fontFamily: fonts.serif, fontWeight: 300, margin: 0, transition: "color 0.3s" }}>
                        庚金の日干を持つあなたは、意志の強さと決断力を本質に持つ人物です。寅月生まれであることから、木の気が旺盛な季節に金が磨かれる形となり、外柔内剛の器を備えています。
                    </p>
                </div>
            </div>
            <div style={{ padding: "0 24px 20px" }}>
                <div style={{ display: "flex", gap: 6, background: t.inputBg, padding: "3px 3px 3px 14px", border: `1px solid ${t.border}`, transition: "all 0.3s" }}>
                    <input placeholder="追加で質問する..." style={{ flex: 1, background: "none", border: "none", color: t.text1, fontFamily: fonts.serif, fontSize: 12, outline: "none" }} />
                    <button style={{ width: 32, height: 32, border: `1px solid ${t.border}`, background: "transparent", color: t.text1, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        ↑
                    </button>
                </div>
            </div>
        </Card>
    );
};

// ===== Main Page =====
export default function TeioSanmeiRedesign() {
    const [isDark, setIsDark] = useState(false);
    const t = isDark ? themes.dark : themes.light;

    return (
        <ThemeContext.Provider value={t}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@200;300;400;500;600;700;900&family=DM+Mono:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { transition: background 0.4s ease; }
      `}</style>

            <div
                style={{
                    minHeight: "100vh",
                    background: t.bg,
                    fontFamily: fonts.serif,
                    transition: "background 0.4s ease, color 0.4s ease",
                    position: "relative",
                }}
            >
                <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 80px", position: "relative" }}>
                    <Header isDark={isDark} onToggle={() => setIsDark(!isDark)} />
                    <InputSection />

                    <div style={{ padding: "24px 24px 0" }}>
                        <Divider />
                    </div>

                    {/* Chart Results */}
                    <div style={{ padding: "24px 24px 0", display: "flex", flexDirection: "column", gap: 12 }}>
                        {/* Row 1 */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                            <InsenSection />
                            <YosenSection />
                            <IsohouSection />
                        </div>
                        {/* Row 2 */}
                        <div style={{ display: "grid", gridTemplateColumns: "2fr 5fr 5fr", gap: 8 }}>
                            <TenchuSection />
                            <DaiunSection />
                            <NenunSection />
                        </div>
                        {/* Row 3 */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                            <UchubanSection />
                            <HachimonSection />
                            <SurihouSection />
                        </div>
                        {/* Prompt Data */}
                        <PromptDataSection />
                        {/* AI軍師 */}
                        <StrategistSection />
                    </div>

                    {/* Footer */}
                    <div style={{ textAlign: "center", padding: "40px 0 0" }}>
                        <div style={{ fontFamily: fonts.mono, fontSize: 8, color: t.text4, letterSpacing: 4 }}>
                            THE ART OF SOVEREIGN WISDOM
                        </div>
                    </div>
                </div>
            </div>
        </ThemeContext.Provider>
    );
}
