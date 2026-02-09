"use client";
import { useState, useEffect } from 'react';
import { ThemeProvider, useTheme, ThemeToggle } from './ThemeContext';
import { TraditionalChart } from './TraditionalChart';
import { AiStrategist, AiModel, AiPersona } from './StrategistCard';

// Types definition
interface SanmeiReport {
    陰占?: {
        年: string; 月: string; 日: string;
        蔵干: { 年: string; 月: string; 日: string; 遷移: string };
    };
    陽占?: {
        十大主星: { 頭: string; 胸: string; 腹: string; 左手: string; 右手: string };
        十二大従星: { 初年: string; 中年: string; 晩年: string };
        十二大従星詳細?: { [key: string]: { name: string; alias: string; full: string } };
    };
    天中殺?: {
        グループ: string;
        宿命天中殺: string[];
        タイミング?: { time: string; month: string; years: string[] };
    };
    異常干支?: string[];
    位相法?: string[];
    数理法?: { 総エネルギー: number; 五行分布: any; 十干内訳: { [key: string]: number } };
    気図法?: any;
    八門法?: { [key: string]: number };
    大運?: { 立運: number; 方向: string; サイクル: any[] };
    年運?: any[];
    宇宙盤?: { 干支番号: number[] };
    output_text?: string;
}

const fonts = {
    serif: "var(--font-noto-serif-jp), 'Noto Serif JP', serif",
    mono: "var(--font-dm-mono), 'DM Mono', monospace",
    display: "var(--font-cormorant), 'Cormorant Garamond', serif",
};

function CalculatorInner() {
    const { t, isDark } = useTheme();
    const [birthday, setBirthday] = useState('1988-03-21');
    const [gender, setGender] = useState('M');
    const [report, setReport] = useState<SanmeiReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copySuccess, setCopySuccess] = useState('');

    // AI Strategist State
    const [isAiLoading, setIsAiLoading] = useState(false);

    // Responsive: PC (≥1024px) vs Mobile
    const [isDesktop, setIsDesktop] = useState(false);
    useEffect(() => {
        const check = () => setIsDesktop(window.innerWidth >= 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const handleCalculate = async () => {
        setLoading(true);
        setError('');
        setCopySuccess('');
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://kantei-api-538317999249.us-central1.run.app';
            const res = await fetch(`${apiUrl}/calculate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ birthday, gender }),
            });
            if (!res.ok) throw new Error('Failed to fetch data');
            const data = await res.json();
            console.log("API Response:", data);
            setReport(data.report);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyText = async () => {
        if (report?.output_text) {
            try {
                await navigator.clipboard.writeText(report.output_text);
                setCopySuccess('Copied!');
                setTimeout(() => setCopySuccess(''), 2000);
            } catch (err) {
                console.error('Failed to copy!', err);
            }
        }
    };

    interface ChatMessage {
        role: 'user' | 'assistant';
        content: string;
    }

    const handleAiConsultation = async (
        persona: AiPersona,
        depth: 'professional' | 'intermediate' | 'beginner',
        model: AiModel,
        message?: string,
        history?: ChatMessage[]
    ): Promise<string | null> => {
        if (!report) return null;
        setIsAiLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://kantei-api-538317999249.us-central1.run.app';
            const res = await fetch(`${apiUrl}/ai/consult`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    report,
                    persona,
                    depth,
                    model,
                    message,
                    history: history || []
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.detail || 'AI consultation failed');
            }

            const data = await res.json();
            return data.response;
        } catch (err: any) {
            console.error('AI consultation error:', err);
            return `エラー: ${err.message || 'AI軍師への接続に失敗しました'}`;
        } finally {
            setIsAiLoading(false);
        }
    };

    // Left pane content (chart results)
    const leftPaneContent = (
        <>
            {/* Input Section */}
            <div style={{ padding: "0 0 20px" }}>
                <div style={{ fontFamily: fonts.serif, fontSize: 12, fontWeight: 600, color: t.text3, letterSpacing: 6, marginBottom: 14 }}>
                    鑑定入力
                </div>
                <div style={{
                    background: t.card,
                    border: `1px solid ${t.border}`,
                    borderRadius: 2,
                    padding: "24px",
                    boxShadow: t.shadowCard,
                    transition: "all 0.3s",
                }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                        <div>
                            <label style={{ display: "block", fontSize: 10, color: t.text4, letterSpacing: 2, fontFamily: fonts.serif, marginBottom: 6 }}>
                                生年月日
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="1990-01-01"
                                value={birthday}
                                onChange={(e) => {
                                    let v = e.target.value.replace(/[^\d]/g, '');
                                    if (v.length > 8) v = v.slice(0, 8);
                                    if (v.length >= 5) v = v.slice(0, 4) + '-' + v.slice(4);
                                    if (v.length >= 8) v = v.slice(0, 7) + '-' + v.slice(7);
                                    setBirthday(v);
                                }}
                                maxLength={10}
                                style={{
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
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: 10, color: t.text4, letterSpacing: 2, fontFamily: fonts.serif, marginBottom: 6 }}>
                                性別
                            </label>
                            <div style={{ display: "flex", border: `1px solid ${t.inputBorder}`, background: t.inputBg }}>
                                {(["M", "F"] as const).map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => setGender(g)}
                                        style={{
                                            flex: 1,
                                            padding: "10px 0",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: 14,
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
                        onClick={handleCalculate}
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "13px 0",
                            border: `1.5px solid ${t.text1}`,
                            borderRadius: 0,
                            cursor: loading ? "wait" : "pointer",
                            fontSize: 15,
                            fontWeight: 600,
                            fontFamily: fonts.serif,
                            letterSpacing: 4,
                            color: t.text1,
                            background: "transparent",
                            transition: "all 0.2s",
                            opacity: loading ? 0.5 : 1,
                        }}
                    >
                        {loading ? '計算中...' : '鑑定する'}
                    </button>
                    {error && (
                        <p style={{ color: t.vermillion, textAlign: "center", fontSize: 14, marginTop: 12, background: t.vermillionBg, padding: "8px", fontFamily: fonts.mono }}>
                            {error}
                        </p>
                    )}
                </div>
            </div>

            {/* Chart Results */}
            {report && report.陰占 && report.陽占 && report.大運 && report.年運 && (
                <>
                    <div style={{ height: 1, background: t.border, width: "100%", margin: "4px 0 20px" }} />
                    <TraditionalChart
                        report={{
                            陰占: report.陰占,
                            陽占: report.陽占,
                            位相法: report.位相法 || [],
                            大運: report.大運,
                            年運: report.年運,
                            宇宙盤: report.宇宙盤 || { 干支番号: [] },
                            八門法: report.八門法 || {},
                            数理法: report.数理法 || { 総エネルギー: 0, 五行分布: {}, 十干内訳: {} },
                            天中殺: report.天中殺,
                            異常干支: report.異常干支
                        }}
                        birthYear={parseInt(birthday.split('-')[0])}
                    />

                    {/* Prompt Data */}
                    {report.output_text && (
                        <div style={{ marginTop: 12 }}>
                            <div style={{
                                background: t.card,
                                border: `1px solid ${t.border}`,
                                borderRadius: 2,
                                overflow: "hidden",
                                transition: "all 0.3s",
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
                                        onClick={handleCopyText}
                                        style={{
                                            background: "none", border: "none",
                                            color: copySuccess ? t.vermillion : t.text3,
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
                                    background: t.promptBg,
                                    transition: "all 0.3s",
                                }}>
                                    {report.output_text}
                                </pre>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );

    const hasReport = report && report.陰占 && report.陽占 && report.大運 && report.年運;

    return (
        <div
            style={{
                minHeight: "100vh",
                background: t.bg,
                fontFamily: fonts.serif,
                transition: "background 0.4s ease, color 0.4s ease",
            }}
        >
            {/* Header */}
            <header style={{
                padding: "20px 24px",
                borderBottom: `1px solid ${t.border}`,
                position: "sticky",
                top: 0,
                background: t.bg,
                zIndex: 100,
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: isDesktop ? "none" : 900, margin: "0 auto" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {/* Seal */}
                        <div style={{
                            width: 30, height: 30,
                            border: `1.5px solid ${t.vermillion}`,
                            borderRadius: 2,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transform: "rotate(-6deg)",
                            background: t.vermillionBg,
                        }}>
                            <span style={{
                                color: t.vermillion, fontSize: 14, fontWeight: 700,
                                fontFamily: fonts.serif, lineHeight: 1,
                            }}>帝</span>
                        </div>
                        <div>
                            <h1 style={{
                                fontFamily: fonts.display,
                                fontSize: 24,
                                fontWeight: 300,
                                color: t.text1,
                                letterSpacing: 6,
                                lineHeight: 1,
                                margin: 0,
                            }}>
                                Teō
                            </h1>
                            <div style={{ fontFamily: fonts.serif, fontSize: 9, color: t.text4, letterSpacing: 3, marginTop: 2 }}>
                                帝王学鑑定
                            </div>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            {/* Main Content */}
            {isDesktop ? (
                /* ========== PC: 2-Pane Layout ========== */
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "55fr 45fr",
                    minHeight: "calc(100vh - 70px)",
                }}>
                    {/* Left Pane: Chart */}
                    <div style={{
                        padding: "24px 32px 80px",
                        overflowY: "auto",
                        borderRight: `1px solid ${t.border}`,
                    }}>
                        {leftPaneContent}
                    </div>

                    {/* Right Pane: AI Strategist (sticky) */}
                    <div style={{
                        position: "sticky",
                        top: 70,
                        height: "calc(100vh - 70px)",
                        overflowY: "auto",
                    }}>
                        {hasReport ? (
                            <AiStrategist
                                onConsult={handleAiConsultation}
                                loading={isAiLoading}
                                layout="panel"
                            />
                        ) : (
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                color: t.text4,
                                fontFamily: fonts.serif,
                                fontSize: 13,
                                gap: 12,
                                padding: 40,
                                textAlign: "center",
                            }}>
                                <div style={{ fontSize: 40, opacity: 0.3 }}>🔮</div>
                                <div>鑑定を実行すると</div>
                                <div>AI軍師に相談できます</div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* ========== Mobile: Single Column + Float ========== */
                <div style={{
                    maxWidth: 600,
                    margin: "0 auto",
                    padding: "20px 16px 120px",
                }}>
                    {leftPaneContent}

                    {/* Mobile: AI not inline, shown as float */}
                    {hasReport && !isDesktop && (
                        <AiStrategist
                            onConsult={handleAiConsultation}
                            loading={isAiLoading}
                            layout="float"
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default function Calculator() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <ThemeProvider>
            <CalculatorInner />
        </ThemeProvider>
    );
}
