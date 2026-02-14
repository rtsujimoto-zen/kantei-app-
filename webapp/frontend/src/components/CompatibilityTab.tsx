"use client";

import { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';

const fonts = {
    serif: "var(--font-noto-serif-jp), 'Noto Serif JP', serif",
    mono: "var(--font-dm-mono), 'DM Mono', monospace",
};

interface PersonInput {
    birthday: string;
    gender: 'M' | 'F';
    nickname: string;
}

interface SanmeiReport {
    陰占?: any;
    陽占?: any;
    天中殺?: any;
    異常干支?: string[];
    位相法?: string[];
    数理法?: any;
    気図法?: any;
    八門法?: any;
    大運?: any;
    年運?: any[];
    宇宙盤?: { 干支番号: number[] };
    output_text?: string;
}

interface CompatibilityTabProps {
    isDesktop: boolean;
}

// A/Bのテーマカラー
const PERSON_COLORS = {
    A: { main: '#E07050', light: '#E0705030', bg: '#E0705010', border: '#E0705040' },
    B: { main: '#5A8ECC', light: '#5A8ECC30', bg: '#5A8ECC10', border: '#5A8ECC40' },
};

// ===== 宇宙盤の重なり表示 =====
function UchubanOverlap({
    numsA, numsB, nameA, nameB, isDesktop,
}: {
    numsA: number[]; numsB: number[]; nameA: string; nameB: string; isDesktop: boolean;
}) {
    const { t, isDark } = useTheme();
    const cx = 150, cy = 150;
    const outerR = 138, numberR = 122, tickR = 132, innerR = 110, dotR = 100;

    const getPos = (num: number, r: number) => {
        const angle = ((num - 1) / 60) * 2 * Math.PI - Math.PI / 2;
        return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    };

    const positionsA = numsA.map(n => getPos(n, dotR));
    const positionsB = numsB.map(n => getPos(n, dotR));

    // 重なり判定: 三角形の頂点が同じセクション（4分割）にあるかチェック
    const getQuadrant = (num: number) => {
        if (num >= 1 && num <= 15) return 0;
        if (num >= 16 && num <= 30) return 1;
        if (num >= 31 && num <= 45) return 2;
        return 3;
    };

    const quadrantsA = new Set(numsA.map(getQuadrant));
    const quadrantsB = new Set(numsB.map(getQuadrant));
    const overlapCount = [...quadrantsA].filter(q => quadrantsB.has(q)).length;

    // 重なりの評価
    let overlapType: '一部重なる' | '全く重ならない' | '大部分が重なる';
    let overlapScore: number;
    let overlapDesc: string;
    let overlapAdvice: string;

    if (overlapCount === 0) {
        overlapType = '全く重ならない';
        overlapScore = 1;
        overlapDesc = '価値観が正反対なため、無意識に付き合うと衝突しますが、役割を分担すれば自分にない視点（異能）を補完し合える「爆発的な可能性」を秘めています。';
        overlapAdvice = '重なりがない場合でも、「年齢が10歳以上離れている」「国籍が異なる」などの条件があれば、宿命の摩擦は解消され、むしろ良好な関係を築けます。';
    } else if (overlapCount >= 3) {
        overlapType = '大部分が重なる';
        overlapScore = 1;
        overlapDesc = '非常に仲が良く、阿吽の呼吸で動けますが、二人だけの世界に閉じこもりやすく、組織としては第三者が入りにくい排他的な空間を作るリスクがあります。';
        overlapAdvice = '二人の世界を楽しみつつも、意識的に外部との交流を保つことが長続きの秘訣です。';
    } else {
        overlapType = '一部重なる';
        overlapScore = 2;
        overlapDesc = '互いに共通言語を持ちつつ、知らない世界を見せ合える最高の相性です。';
        overlapAdvice = '共通の価値観を軸にしながら、お互いの異なる視点を活かし合うことで、さらに関係が深まります。';
    }

    // 区切り線
    const dividers = [1, 16, 31, 46].map(n => {
        const inner = getPos(n, 40);
        const outer = getPos(n, innerR);
        return { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y };
    });

    const allNums = new Set([...numsA, ...numsB]);

    return (
        <div style={{
            background: t.card,
            border: `1px solid ${t.border}`,
            borderRadius: 2,
            padding: 20,
            transition: "all 0.3s",
            boxShadow: t.shadowCard,
            marginBottom: 20,
        }}>
            <div style={{ fontFamily: fonts.serif, fontSize: 12, fontWeight: 600, color: t.text3, letterSpacing: 6, marginBottom: 14 }}>
                宇宙盤の重なり
            </div>

            <div style={{ display: "flex", flexDirection: isDesktop ? "row" : "column", gap: 20, alignItems: isDesktop ? "flex-start" : "center" }}>
                {/* SVG Chart */}
                <div style={{ flexShrink: 0 }}>
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
                            const isHighlighted = allNums.has(num);
                            return (
                                <g key={num}>
                                    <line
                                        x1={tickStart.x} y1={tickStart.y}
                                        x2={tickEnd.x} y2={tickEnd.y}
                                        stroke={`${t.text1}${isHighlighted ? '60' : '20'}`}
                                        strokeWidth={num % 5 === 0 ? 1 : 0.5}
                                    />
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

                        {/* Person A ポリゴン */}
                        {positionsA.length >= 3 && (
                            <polygon
                                points={positionsA.map(p => `${p.x},${p.y}`).join(' ')}
                                fill={PERSON_COLORS.A.light}
                                stroke={PERSON_COLORS.A.main}
                                strokeWidth="1.5"
                                opacity="0.6"
                            />
                        )}

                        {/* Person B ポリゴン */}
                        {positionsB.length >= 3 && (
                            <polygon
                                points={positionsB.map(p => `${p.x},${p.y}`).join(' ')}
                                fill={PERSON_COLORS.B.light}
                                stroke={PERSON_COLORS.B.main}
                                strokeWidth="1.5"
                                opacity="0.6"
                            />
                        )}

                        {/* A の点 */}
                        {positionsA.map((p, i) => (
                            <circle key={`a-${i}`} cx={p.x} cy={p.y} r="4.5" fill={PERSON_COLORS.A.main} opacity="0.85" />
                        ))}

                        {/* B の点 */}
                        {positionsB.map((p, i) => (
                            <circle key={`b-${i}`} cx={p.x} cy={p.y} r="4.5" fill={PERSON_COLORS.B.main} opacity="0.85" />
                        ))}
                    </svg>

                    {/* 凡例 */}
                    <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: PERSON_COLORS.A.main }} />
                            <span style={{ fontSize: 11, color: t.text2, fontFamily: fonts.serif }}>{nameA}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: PERSON_COLORS.B.main }} />
                            <span style={{ fontSize: 11, color: t.text2, fontFamily: fonts.serif }}>{nameB}</span>
                        </div>
                    </div>
                </div>

                {/* 解説 */}
                <div style={{ flex: 1, minWidth: 200 }}>
                    {/* Score badge */}
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 14px",
                        background: overlapScore === 2 ? (isDark ? '#3a5a2e' : '#e8f5e9') : (isDark ? '#4a3a2e' : '#fff8e1'),
                        border: `1px solid ${overlapScore === 2 ? (isDark ? '#5a7a4e' : '#a5d6a7') : (isDark ? '#6a5a4e' : '#ffe082')}`,
                        borderRadius: 2,
                        marginBottom: 14,
                    }}>
                        <span style={{ fontSize: 16 }}>{overlapScore === 2 ? '◎' : '○'}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, fontFamily: fonts.serif, color: t.text1 }}>
                            {overlapType}
                        </span>
                        <span style={{ fontSize: 11, color: t.text3, fontFamily: fonts.mono }}>+{overlapScore}</span>
                    </div>

                    <p style={{ fontSize: 13, lineHeight: 1.8, color: t.text2, fontFamily: fonts.serif, marginBottom: 14, margin: "0 0 14px" }}>
                        {overlapDesc}
                    </p>

                    <div style={{
                        padding: "10px 14px",
                        background: isDark ? `${t.text1}06` : '#f8f6f3',
                        border: `1px solid ${t.border}`,
                        borderRadius: 2,
                    }}>
                        <div style={{ fontSize: 10, fontWeight: 600, color: t.text4, fontFamily: fonts.serif, letterSpacing: 2, marginBottom: 6 }}>
                            アドバイス
                        </div>
                        <p style={{ fontSize: 12, lineHeight: 1.7, color: t.text3, fontFamily: fonts.serif, margin: 0 }}>
                            {overlapAdvice}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function CompatibilityTab({ isDesktop }: CompatibilityTabProps) {
    const { t, isDark } = useTheme();

    const [personA, setPersonA] = useState<PersonInput>({ birthday: '', gender: 'M', nickname: '' });
    const [personB, setPersonB] = useState<PersonInput>({ birthday: '', gender: 'F', nickname: '' });
    const [relationship, setRelationship] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [reportA, setReportA] = useState<SanmeiReport | null>(null);
    const [reportB, setReportB] = useState<SanmeiReport | null>(null);

    const formatBirthday = (value: string) => {
        let v = value.replace(/[^\d]/g, '');
        if (v.length > 8) v = v.slice(0, 8);
        if (v.length >= 5) v = v.slice(0, 4) + '-' + v.slice(4);
        if (v.length >= 8) v = v.slice(0, 7) + '-' + v.slice(7);
        return v;
    };

    const isValidDate = (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d);
    const canSubmit = isValidDate(personA.birthday) && isValidDate(personB.birthday) && !loading;

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        setReportA(null);
        setReportB(null);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://kantei-api-538317999249.us-central1.run.app';
            const [resA, resB] = await Promise.all([
                fetch(`${apiUrl}/calculate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ birthday: personA.birthday, gender: personA.gender }),
                }),
                fetch(`${apiUrl}/calculate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ birthday: personB.birthday, gender: personB.gender }),
                }),
            ]);
            if (!resA.ok || !resB.ok) throw new Error('鑑定データの取得に失敗しました');
            const dataA = await resA.json();
            const dataB = await resB.json();
            setReportA(dataA.report);
            setReportB(dataB.report);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'エラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    // Names
    const nameA = personA.nickname || 'Aさん';
    const nameB = personB.nickname || 'Bさん';

    // Shared field styles
    const inputStyle = {
        width: "100%",
        background: t.inputBg,
        border: `1px solid ${t.inputBorder}`,
        borderRadius: 0,
        padding: "10px 12px",
        color: t.text1,
        fontFamily: fonts.serif,
        fontSize: 15,
        outline: "none",
        transition: "all 0.3s",
        boxSizing: "border-box" as const,
    };

    const labelStyle = {
        display: "block" as const,
        fontSize: 10,
        color: t.text4,
        letterSpacing: 2,
        fontFamily: fonts.serif,
        marginBottom: 6,
    };

    const personCard = (person: PersonInput, setPerson: (p: PersonInput) => void, id: 'A' | 'B', placeholder: string) => {
        const color = PERSON_COLORS[id];
        return (
            <div style={{ flex: 1, minWidth: 260 }}>
                {/* Person label */}
                <div style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: t.text2,
                    fontFamily: fonts.serif,
                    letterSpacing: 4,
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                }}>
                    <span style={{
                        width: 24, height: 24,
                        border: `1.5px solid ${color.main}`,
                        borderRadius: 2,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, color: color.main, fontWeight: 700,
                        fontFamily: fonts.serif,
                        background: color.bg,
                    }}>{id}</span>
                    <span style={{ color: color.main }}>{person.nickname || placeholder}</span>
                </div>

                {/* Nickname */}
                <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>ニックネーム（任意）</label>
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={person.nickname}
                        onChange={(e) => setPerson({ ...person, nickname: e.target.value })}
                        style={{ ...inputStyle, borderColor: person.nickname ? color.border : t.inputBorder }}
                    />
                </div>

                {/* Birthday */}
                <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>生年月日</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="1990-01-01"
                        value={person.birthday}
                        onChange={(e) => setPerson({ ...person, birthday: formatBirthday(e.target.value) })}
                        maxLength={10}
                        style={inputStyle}
                    />
                </div>

                {/* Gender */}
                <div>
                    <label style={labelStyle}>性別</label>
                    <div style={{ display: "flex", border: `1px solid ${t.inputBorder}`, background: t.inputBg }}>
                        {(["M", "F"] as const).map((g) => (
                            <button
                                key={g}
                                onClick={() => setPerson({ ...person, gender: g })}
                                style={{
                                    flex: 1,
                                    padding: "10px 0",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: 14,
                                    fontFamily: fonts.serif,
                                    fontWeight: person.gender === g ? 600 : 300,
                                    color: person.gender === g ? color.main : t.text3,
                                    background: person.gender === g ? color.bg : "transparent",
                                    transition: "all 0.2s",
                                }}
                            >
                                {g === "M" ? "男性" : "女性"}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const hasResults = reportA && reportB && reportA.宇宙盤 && reportB.宇宙盤;

    return (
        <div style={{ padding: isDesktop ? "24px 32px 80px" : "20px 16px 120px", maxWidth: isDesktop ? 900 : 600, margin: "0 auto" }}>
            <div style={{ fontFamily: fonts.serif, fontSize: 12, fontWeight: 600, color: t.text3, letterSpacing: 6, marginBottom: 14 }}>
                相性診断
            </div>

            {/* Input Form */}
            <div style={{
                background: t.card,
                border: `1px solid ${t.border}`,
                borderRadius: 2,
                padding: "24px",
                boxShadow: t.shadowCard,
                transition: "all 0.3s",
                marginBottom: 24,
            }}>
                {/* Two person inputs */}
                <div style={{
                    display: "flex",
                    flexDirection: isDesktop ? "row" : "column",
                    gap: isDesktop ? 32 : 24,
                    marginBottom: 24,
                }}>
                    {personCard(personA, setPersonA, 'A', "Aさん")}

                    {/* Divider */}
                    {isDesktop ? (
                        <div style={{ width: 1, background: t.border, alignSelf: "stretch" }} />
                    ) : (
                        <div style={{ height: 1, background: t.border, width: "100%" }} />
                    )}

                    {personCard(personB, setPersonB, 'B', "Bさん")}
                </div>

                {/* Relationship (optional) */}
                <div style={{ marginBottom: 24 }}>
                    <label style={labelStyle}>関係性（任意）</label>
                    <input
                        type="text"
                        placeholder="例: 恋人、夫婦、ビジネスパートナー、友人..."
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                {/* Submit button */}
                <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    style={{
                        width: "100%",
                        padding: "13px 0",
                        border: `1.5px solid ${t.text1}`,
                        borderRadius: 0,
                        cursor: canSubmit ? "pointer" : "default",
                        fontSize: 15,
                        fontWeight: 600,
                        fontFamily: fonts.serif,
                        letterSpacing: 4,
                        color: t.text1,
                        background: "transparent",
                        transition: "all 0.2s",
                        opacity: canSubmit ? 1 : 0.4,
                    }}
                >
                    {loading ? '鑑定中...' : '相性を鑑定する'}
                </button>

                {error && (
                    <p style={{ color: '#E07050', textAlign: "center", fontSize: 14, marginTop: 12, background: PERSON_COLORS.A.bg, padding: "8px", fontFamily: fonts.mono }}>
                        {error}
                    </p>
                )}
            </div>

            {/* Results */}
            {hasResults && (
                <>
                    <div style={{ height: 1, background: t.border, width: "100%", margin: "4px 0 20px" }} />

                    {/* 宇宙盤の重なり */}
                    <UchubanOverlap
                        numsA={reportA.宇宙盤!.干支番号}
                        numsB={reportB.宇宙盤!.干支番号}
                        nameA={nameA}
                        nameB={nameB}
                        isDesktop={isDesktop}
                    />
                </>
            )}
        </div>
    );
}
