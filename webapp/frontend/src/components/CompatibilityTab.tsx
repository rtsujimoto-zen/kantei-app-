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

// ===== 五行ロジック =====
const STEM_TO_GOGYO: { [key: string]: string } = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
    '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
};

const STAR_TO_GOGYO: { [key: string]: string } = {
    '貫索星': '木', '石門星': '木',
    '鳳閣星': '火', '調舒星': '火',
    '禄存星': '土', '司禄星': '土',
    '車騎星': '金', '牽牛星': '金',
    '龍高星': '水', '玉堂星': '水',
};

const STEM_NATURE: { [key: string]: string } = {
    '甲': '大木（樹木）', '乙': '草花', '丙': '太陽', '丁': '灯火',
    '戊': '山岳', '己': '田園', '庚': '鉱石・剣', '辛': '宝石',
    '壬': '大海', '癸': '雨露',
};

const GOGYO_COLORS: { [key: string]: string } = {
    '木': '#6A9E6A', '火': '#E07050', '土': '#A08B6D', '金': '#8B8B8B', '水': '#5A8ECC',
};

type GogyoRelation = '相生' | '相剋' | '比和';

function getGogyoRelation(a: string, b: string): { type: GogyoRelation; detail: string } {
    if (a === b) return { type: '比和', detail: `${a}と${b}（同じ性質）` };
    const sojo: [string, string][] = [['木', '火'], ['火', '土'], ['土', '金'], ['金', '水'], ['水', '木']];
    for (const [from, to] of sojo) {
        if (a === from && b === to) return { type: '相生', detail: `${a}が${b}を生む` };
        if (b === from && a === to) return { type: '相生', detail: `${b}が${a}を生む` };
    }
    return { type: '相剋', detail: `${a}と${b}が刺激し合う` };
}

function extractNikkan(report: SanmeiReport): string | null {
    if (!report.陰占?.日) return null;
    const match = report.陰占.日.match(/\)\s*(.)/);
    return match ? match[1] : null;
}

function extractStarGogyo(report: SanmeiReport, pos: '左手' | '右手' | '胸'): string | null {
    const star = report.陽占?.十大主星?.[pos];
    return star ? (STAR_TO_GOGYO[star] || null) : null;
}

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

// ===== 五行循環グラフ =====
function GogyoCycleGraph({
    gogyoA, gogyoB, nameA, nameB, relation,
}: {
    gogyoA: string; gogyoB: string; nameA: string; nameB: string; relation: GogyoRelation;
}) {
    const { t, isDark } = useTheme();
    const cx = 140, cy = 140, r = 90;
    const elements = ['木', '火', '土', '金', '水'];
    const positions = elements.map((_, i) => {
        const angle = (i / 5) * 2 * Math.PI - Math.PI / 2;
        return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    });

    // 相生の矢印（円周に沿って）
    const sojoArrows = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]];
    // 相剋の線（星形）
    const sokokLines = [[0, 2], [2, 4], [4, 1], [1, 3], [3, 0]];

    const idxA = elements.indexOf(gogyoA);
    const idxB = elements.indexOf(gogyoB);

    return (
        <svg viewBox="0 0 280 280" style={{ width: 240, height: 240, maxWidth: "100%" }}>
            {/* 相生の円弧矢印 */}
            {sojoArrows.map(([from, to], i) => {
                const f = positions[from], tr = positions[to];
                const mx = (f.x + tr.x) / 2 + (tr.y - f.y) * 0.15;
                const my = (f.y + tr.y) / 2 - (tr.x - f.x) * 0.15;
                return (
                    <path
                        key={`sojo-${i}`}
                        d={`M ${f.x} ${f.y} Q ${mx} ${my} ${tr.x} ${tr.y}`}
                        fill="none"
                        stroke={`${t.text1}20`}
                        strokeWidth="1.5"
                        markerEnd="url(#arrowGogyo)"
                    />
                );
            })}

            {/* 相剋の星形線 */}
            {sokokLines.map(([from, to], i) => (
                <line
                    key={`sokok-${i}`}
                    x1={positions[from].x} y1={positions[from].y}
                    x2={positions[to].x} y2={positions[to].y}
                    stroke={`${t.text1}10`}
                    strokeWidth="1"
                    strokeDasharray="3,3"
                />
            ))}

            {/* A→B の関係を強調 */}
            {idxA >= 0 && idxB >= 0 && idxA !== idxB && (
                <line
                    x1={positions[idxA].x} y1={positions[idxA].y}
                    x2={positions[idxB].x} y2={positions[idxB].y}
                    stroke={relation === '相生' ? '#6A9E6A' : relation === '相剋' ? '#E07050' : '#A08B6D'}
                    strokeWidth="2.5"
                    opacity="0.6"
                    markerEnd={relation === '相生' ? 'url(#arrowSojo)' : 'url(#arrowSokok)'}
                />
            )}

            {/* 五行ノード */}
            {elements.map((el, i) => {
                const p = positions[i];
                const isA = i === idxA;
                const isB = i === idxB;
                const nodeR = (isA || isB) ? 22 : 18;
                return (
                    <g key={el}>
                        <circle
                            cx={p.x} cy={p.y} r={nodeR}
                            fill={isA ? PERSON_COLORS.A.light : isB ? PERSON_COLORS.B.light : (isDark ? `${t.text1}08` : '#f5f3ef')}
                            stroke={isA ? PERSON_COLORS.A.main : isB ? PERSON_COLORS.B.main : `${t.text1}30`}
                            strokeWidth={isA || isB ? 2.5 : 1}
                        />
                        <text
                            x={p.x} y={p.y}
                            textAnchor="middle" dominantBaseline="central"
                            fontSize={isA || isB ? 16 : 14}
                            fontWeight={isA || isB ? 700 : 500}
                            fill={GOGYO_COLORS[el]}
                            fontFamily={fonts.serif}
                        >
                            {el}
                        </text>
                        {isA && (
                            <text x={p.x} y={p.y + nodeR + 12} textAnchor="middle" fontSize={9} fill={PERSON_COLORS.A.main} fontFamily={fonts.serif}>
                                {nameA}
                            </text>
                        )}
                        {isB && (
                            <text x={p.x} y={p.y + nodeR + 12} textAnchor="middle" fontSize={9} fill={PERSON_COLORS.B.main} fontFamily={fonts.serif}>
                                {nameB}
                            </text>
                        )}
                    </g>
                );
            })}

            {/* Arrow markers */}
            <defs>
                <marker id="arrowGogyo" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6" fill={`${t.text1}30`} />
                </marker>
                <marker id="arrowSojo" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8" fill="#6A9E6A" />
                </marker>
                <marker id="arrowSokok" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8" fill="#E07050" />
                </marker>
            </defs>
        </svg>
    );
}

// ===== 五行相性セクション =====
function GogyoCompatibility({
    reportA, reportB, nameA, nameB, isDesktop,
}: {
    reportA: SanmeiReport; reportB: SanmeiReport; nameA: string; nameB: string; isDesktop: boolean;
}) {
    const { t, isDark } = useTheme();

    const nikkanA = extractNikkan(reportA);
    const nikkanB = extractNikkan(reportB);
    if (!nikkanA || !nikkanB) return null;

    const gogyoA = STEM_TO_GOGYO[nikkanA];
    const gogyoB = STEM_TO_GOGYO[nikkanB];
    if (!gogyoA || !gogyoB) return null;

    const spiritRel = getGogyoRelation(gogyoA, gogyoB);

    // 東方（左手）= 仕事の星
    const eastGogyoA = extractStarGogyo(reportA, '左手');
    const eastGogyoB = extractStarGogyo(reportB, '左手');
    const eastRel = eastGogyoA && eastGogyoB ? getGogyoRelation(eastGogyoA, eastGogyoB) : null;

    // 西方（右手）= パートナーの星、中央（胸）= 本質
    const westGogyoA = extractStarGogyo(reportA, '右手');
    const centerGogyoB = extractStarGogyo(reportB, '胸');
    const westRel = westGogyoA && centerGogyoB ? getGogyoRelation(westGogyoA, centerGogyoB) : null;

    const getRelMsg = (rel: GogyoRelation): { icon: string; color: string; score: number; title: string; desc: string } => {
        switch (rel) {
            case '相生': return {
                icon: '◎', color: isDark ? '#3a5a2e' : '#e8f5e9', score: 2,
                title: '生かし合う関係',
                desc: '一緒にいると自然にやる気が湧く、応援し合える関係です。どちらかが支え、どちらかが伸びる。未来を語るパートナーに最適。',
            };
            case '相剋': return {
                icon: '○', color: isDark ? '#4a3a2e' : '#fff8e1', score: 1,
                title: '魂を磨き合う関係',
                desc: '自分にない視点を与えてくれる、魂を磨き合う関係です。剋する側は「責任感」を、剋される側は「忍耐と成長」を学びます。',
            };
            case '比和': return {
                icon: '◎', color: isDark ? '#3a5a2e' : '#e8f5e9', score: 2,
                title: '同志のような深い理解',
                desc: '価値観が近く、同志のような深い理解が得られる関係です。一緒にいるとエネルギーが安定し、運気が巡ります。',
            };
        }
    };

    const spiritMsg = getRelMsg(spiritRel.type);

    // 総合スコア
    const totalScore = spiritMsg.score
        + (eastRel ? getRelMsg(eastRel.type).score : 0)
        + (westRel ? getRelMsg(westRel.type).score : 0);

    const sectionCard = (title: string, subtitle: string, rel: { type: GogyoRelation; detail: string }, msg: ReturnType<typeof getRelMsg>) => (
        <div style={{
            padding: 14,
            background: isDark ? `${t.text1}04` : '#faf9f7',
            border: `1px solid ${t.border}`,
            borderRadius: 2,
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.text1, fontFamily: fonts.serif }}>{title}</div>
                    <div style={{ fontSize: 10, color: t.text4, fontFamily: fonts.mono, marginTop: 2 }}>{subtitle}</div>
                </div>
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "3px 10px",
                    background: msg.color,
                    border: `1px solid ${rel.type === '相剋' ? (isDark ? '#6a5a4e' : '#ffe082') : (isDark ? '#5a7a4e' : '#a5d6a7')}`,
                    borderRadius: 2,
                    fontSize: 11, fontWeight: 600, color: t.text1, fontFamily: fonts.serif,
                }}>
                    {msg.icon} {rel.type} +{msg.score}
                </div>
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.7, color: t.text2, fontFamily: fonts.serif, margin: 0 }}>
                {msg.desc}
            </p>
        </div>
    );

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
                五行相性ナビゲーター
            </div>

            <div style={{ display: "flex", flexDirection: isDesktop ? "row" : "column", gap: 20, alignItems: isDesktop ? "flex-start" : "center", marginBottom: 20 }}>
                {/* 五行循環グラフ */}
                <div style={{ flexShrink: 0 }}>
                    <GogyoCycleGraph
                        gogyoA={gogyoA} gogyoB={gogyoB}
                        nameA={nameA} nameB={nameB}
                        relation={spiritRel.type}
                    />
                    {/* 凡例 */}
                    <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: PERSON_COLORS.A.main }} />
                            <span style={{ fontSize: 10, color: t.text2, fontFamily: fonts.serif }}>{nameA}（{nikkanA}・{STEM_NATURE[nikkanA]}）</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: PERSON_COLORS.B.main }} />
                            <span style={{ fontSize: 10, color: t.text2, fontFamily: fonts.serif }}>{nameB}（{nikkanB}・{STEM_NATURE[nikkanB]}）</span>
                        </div>
                    </div>
                </div>

                {/* 診断項目 */}
                <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* ① 精神の土台 */}
                    {sectionCard(
                        '精神のシンクロ率',
                        `日干: ${nikkanA}(${gogyoA}) × ${nikkanB}(${gogyoB})`,
                        spiritRel,
                        spiritMsg,
                    )}

                    {/* ② ビジネス加速力 */}
                    {eastRel && (
                        sectionCard(
                            'ビジネス加速力',
                            `東方の星: ${reportA.陽占?.十大主星?.左手 || '?'}(${eastGogyoA}) × ${reportB.陽占?.十大主星?.左手 || '?'}(${eastGogyoB})`,
                            eastRel,
                            getRelMsg(eastRel.type),
                        )
                    )}

                    {/* ③ プライベートの安らぎ */}
                    {westRel && (
                        sectionCard(
                            'プライベートの安らぎ',
                            `Aの西方: ${reportA.陽占?.十大主星?.右手 || '?'}(${westGogyoA}) × Bの中心: ${reportB.陽占?.十大主星?.胸 || '?'}(${centerGogyoB})`,
                            westRel,
                            getRelMsg(westRel.type),
                        )
                    )}
                </div>
            </div>

            {/* 帝王のアドバイス */}
            <div style={{
                padding: "14px 16px",
                background: isDark ? `${t.text1}06` : '#f8f6f3',
                border: `1px solid ${t.border}`,
                borderRadius: 2,
            }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: t.text4, fontFamily: fonts.serif, letterSpacing: 2, marginBottom: 8 }}>
                    帝王のアドバイス
                </div>
                {spiritRel.type === '相剋' ? (
                    <p style={{ fontSize: 13, lineHeight: 1.8, color: t.text2, fontFamily: fonts.serif, margin: 0 }}>
                        違いは間違いではない。相手の不快を認めることで、あなたの器は拡大し、新たな宇宙（可能性）が生まれます。
                        剋し合う関係こそ、最も大きな成長をもたらします。逃げずに「在り方」を変えることが覚醒の鍵です。
                    </p>
                ) : spiritRel.type === '比和' ? (
                    <p style={{ fontSize: 13, lineHeight: 1.8, color: t.text2, fontFamily: fonts.serif, margin: 0 }}>
                        同じ五行を持つ二人は、阿吽の呼吸で動けます。しかし、同じ世界に閉じこもりすぎると
                        成長が止まるリスクも。意識的に「異質な風」を取り入れることで、関係性がさらに進化します。
                    </p>
                ) : (
                    <p style={{ fontSize: 13, lineHeight: 1.8, color: t.text2, fontFamily: fonts.serif, margin: 0 }}>
                        生かし合う関係は、最も自然で調和のとれたエネルギーの流れを生みます。
                        支える側は「与える喜び」を、伸びる側は「感謝の力」を忘れないことが、
                        この美しい循環を永続させる秘訣です。
                    </p>
                )}
            </div>
        </div>
    );
}

export function CompatibilityTab({ isDesktop }: CompatibilityTabProps) {
    const { t, isDark } = useTheme();

    const [personA, setPersonA] = useState<PersonInput>({ birthday: '1992-04-23', gender: 'F', nickname: '' });
    const [personB, setPersonB] = useState<PersonInput>({ birthday: '1988-03-21', gender: 'M', nickname: '' });
    const [relationship, setRelationship] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [reportA, setReportA] = useState<SanmeiReport | null>(null);
    const [reportB, setReportB] = useState<SanmeiReport | null>(null);
    const [copySuccess, setCopySuccess] = useState('');

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

    // Build prompt text for copy
    const buildPromptText = () => {
        if (!reportA || !reportB) return '';
        const header = `=== 相性診断データ ===\n${nameA}（${personA.birthday} / ${personA.gender === 'M' ? '男性' : '女性'}）\n${nameB}（${personB.birthday} / ${personB.gender === 'M' ? '男性' : '女性'}）\n${relationship ? `関係性: ${relationship}` : ''}\n`;
        const textA = `\n--- ${nameA} の鑑定データ ---\n${reportA.output_text || '(データなし)'}`;
        const textB = `\n--- ${nameB} の鑑定データ ---\n${reportB.output_text || '(データなし)'}`;
        return header + textA + textB;
    };

    const handleCopyPrompt = async () => {
        try {
            await navigator.clipboard.writeText(buildPromptText());
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

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

    // Energy data
    const energyA = reportA?.数理法?.総エネルギー ?? 0;
    const energyB = reportB?.数理法?.総エネルギー ?? 0;
    const maxEnergy = Math.max(energyA, energyB, 1);
    const energyDiff = Math.abs(energyA - energyB);
    const higherName = energyA >= energyB ? nameA : nameB;
    const lowerName = energyA >= energyB ? nameB : nameA;
    const higherEnergy = Math.max(energyA, energyB);
    const lowerEnergy = Math.min(energyA, energyB);

    // Energy evaluation
    let energyEval: { type: string; score: number; desc: string; advice: string };
    if (energyDiff <= 50) {
        energyEval = {
            type: 'バランス良好',
            score: 2,
            desc: 'エネルギーの総量が近く、対等な関係を築きやすい理想的なバランスです。お互いの力を引き出し合えます。',
            advice: '対等なパートナーシップを活かし、共同で目標に向かうと最大の成果が出ます。',
        };
    } else if (energyDiff <= 120) {
        energyEval = {
            type: '程よい格差',
            score: 1,
            desc: `${higherName}のエネルギーが高く、${lowerName}をリードする立場になりやすい関係です。高い側が意識的にペースを合わせることで良好な関係を保てます。`,
            advice: `${lowerName}は「他力」を使いこなし、${higherName}のエネルギーを借りることで大きく飛躍できます。`,
        };
    } else {
        energyEval = {
            type: '大きな格差',
            score: 0,
            desc: `エネルギーの格差が大きいため、${higherName}が「自分が正しい、同じようにできるはずだ」と押し付けると、${lowerName}の器がパンクし、病気や精神的摩耗（陰転）を引き起こすリスクがあります。`,
            advice: `${higherName}は意識的にペースダウンし、${lowerName}のリズムを尊重することが重要です。逆に${lowerName}が「他力」を使いこなせれば、${higherName}のエネルギーを借りて飛躍できます。`,
        };
    }

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

                    {/* 五行相性ナビゲーター */}
                    <GogyoCompatibility
                        reportA={reportA}
                        reportB={reportB}
                        nameA={nameA}
                        nameB={nameB}
                        isDesktop={isDesktop}
                    />

                    {/* エネルギー比較（数理法） */}
                    {reportA.数理法 && reportB.数理法 && (
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
                                エネルギーの力学（数理法）
                            </div>

                            {/* Bar comparison */}
                            <div style={{ marginBottom: 20 }}>
                                {/* Person A bar */}
                                <div style={{ marginBottom: 12 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: PERSON_COLORS.A.main }} />
                                            <span style={{ fontSize: 12, color: t.text2, fontFamily: fonts.serif }}>{nameA}</span>
                                        </div>
                                        <span style={{ fontSize: 18, fontWeight: 700, color: PERSON_COLORS.A.main, fontFamily: fonts.serif }}>{energyA}</span>
                                    </div>
                                    <div style={{ width: "100%", height: 8, background: isDark ? `${t.text1}10` : '#f0ede8', borderRadius: 4 }}>
                                        <div style={{
                                            width: `${(energyA / maxEnergy) * 100}%`,
                                            height: "100%",
                                            background: `linear-gradient(90deg, ${PERSON_COLORS.A.main}, ${PERSON_COLORS.A.main}aa)`,
                                            borderRadius: 4,
                                            transition: "width 0.6s ease",
                                        }} />
                                    </div>
                                </div>

                                {/* Person B bar */}
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: PERSON_COLORS.B.main }} />
                                            <span style={{ fontSize: 12, color: t.text2, fontFamily: fonts.serif }}>{nameB}</span>
                                        </div>
                                        <span style={{ fontSize: 18, fontWeight: 700, color: PERSON_COLORS.B.main, fontFamily: fonts.serif }}>{energyB}</span>
                                    </div>
                                    <div style={{ width: "100%", height: 8, background: isDark ? `${t.text1}10` : '#f0ede8', borderRadius: 4 }}>
                                        <div style={{
                                            width: `${(energyB / maxEnergy) * 100}%`,
                                            height: "100%",
                                            background: `linear-gradient(90deg, ${PERSON_COLORS.B.main}, ${PERSON_COLORS.B.main}aa)`,
                                            borderRadius: 4,
                                            transition: "width 0.6s ease",
                                        }} />
                                    </div>
                                </div>

                                {/* Difference label */}
                                <div style={{
                                    textAlign: "center",
                                    marginTop: 12,
                                    fontSize: 12,
                                    color: t.text3,
                                    fontFamily: fonts.mono,
                                }}>
                                    差: {energyDiff}点
                                </div>
                            </div>

                            {/* Evaluation */}
                            <div style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "6px 14px",
                                background: energyEval.score === 2 ? (isDark ? '#3a5a2e' : '#e8f5e9') : energyEval.score === 1 ? (isDark ? '#4a3a2e' : '#fff8e1') : (isDark ? '#5a2e2e' : '#fce4ec'),
                                border: `1px solid ${energyEval.score === 2 ? (isDark ? '#5a7a4e' : '#a5d6a7') : energyEval.score === 1 ? (isDark ? '#6a5a4e' : '#ffe082') : (isDark ? '#7a4e4e' : '#ef9a9a')}`,
                                borderRadius: 2,
                                marginBottom: 14,
                            }}>
                                <span style={{ fontSize: 16 }}>{energyEval.score === 2 ? '◎' : energyEval.score === 1 ? '○' : '△'}</span>
                                <span style={{ fontSize: 13, fontWeight: 600, fontFamily: fonts.serif, color: t.text1 }}>
                                    {energyEval.type}
                                </span>
                                <span style={{ fontSize: 11, color: t.text3, fontFamily: fonts.mono }}>+{energyEval.score}</span>
                            </div>

                            <p style={{ fontSize: 13, lineHeight: 1.8, color: t.text2, fontFamily: fonts.serif, margin: "0 0 14px" }}>
                                {energyEval.desc}
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
                                    {energyEval.advice}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* プロンプトコピー枠 */}
                    {(reportA.output_text || reportB.output_text) && (
                        <div style={{
                            background: t.card,
                            border: `1px solid ${t.border}`,
                            borderRadius: 2,
                            overflow: "hidden",
                            transition: "all 0.3s",
                            boxShadow: t.shadowCard,
                        }}>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "10px 20px",
                                borderBottom: `1px solid ${t.border}`,
                            }}>
                                <span style={{ fontSize: 12, fontWeight: 500, color: t.text3, letterSpacing: 3, fontFamily: fonts.mono }}>
                                    PROMPT DATA
                                </span>
                                <button
                                    onClick={handleCopyPrompt}
                                    style={{
                                        background: "none", border: "none",
                                        color: copySuccess ? '#E07050' : t.text3,
                                        fontSize: 12, cursor: "pointer",
                                        fontFamily: fonts.mono,
                                    }}
                                >
                                    {copySuccess || 'Copy'}
                                </button>
                            </div>
                            <pre style={{
                                padding: 20,
                                color: t.text2,
                                fontSize: 12,
                                fontFamily: fonts.mono,
                                lineHeight: 1.8,
                                whiteSpace: "pre-wrap",
                                maxHeight: 300,
                                overflowY: "auto",
                                margin: 0,
                                background: isDark ? `${t.text1}04` : '#faf9f7',
                                transition: "all 0.3s",
                            }}>
                                {buildPromptText()}
                            </pre>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
