"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "./ThemeContext";

const fonts = {
    serif: "var(--font-noto-serif-jp), 'Noto Serif JP', serif",
    mono: "var(--font-dm-mono), 'DM Mono', monospace",
};

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export type AiModel = 'gemini-3.0-pro-high' | 'gemini-3.0-pro-low' | 'gemini-flash';

export type AiPersona = 'jiya' | 'master' | 'tokyo_mother' | 'onmyoji';

interface AiStrategistProps {
    onConsult: (
        persona: AiPersona,
        depth: 'professional' | 'intermediate' | 'beginner',
        model: AiModel,
        message?: string,
        history?: ChatMessage[]
    ) => Promise<string | null>;
    loading: boolean;
    className?: string;
}

const personas: { id: AiPersona; icon: string; label: string }[] = [
    { id: "onmyoji", icon: "/icons/onmyoji.png", label: "現代の陰陽師" },
    { id: "tokyo_mother", icon: "/icons/mother.png", label: "東京の母" },
    { id: "jiya", icon: "/icons/butler.png", label: "老執事" },
    { id: "master", icon: "/icons/master.png", label: "師匠" },
];

const models: { id: AiModel; label: string; sub: string }[] = [
    { id: "gemini-3.0-pro-high", label: "Pro High", sub: "熟考・最大性能" },
    { id: "gemini-3.0-pro-low", label: "Pro Low", sub: "通常・バランス" },
    { id: "gemini-flash", label: "⚡ Flash", sub: "Gemini 3 Flash" },
];

export function AiStrategist({ onConsult, loading, className }: AiStrategistProps) {
    const { t, isDark } = useTheme();
    const [persona, setPersona] = useState<AiPersona>('onmyoji');
    const [depth, setDepth] = useState<'professional' | 'intermediate' | 'beginner'>('professional');
    const [model, setModel] = useState<AiModel>('gemini-3.0-pro-high');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [copiedAll, setCopiedAll] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleInitialConsult = async () => {
        const response = await onConsult(persona, depth, model, undefined, []);
        if (response) {
            setMessages([{ role: 'assistant', content: response }]);
        }
    };

    const handleFollowUp = async () => {
        if (!inputValue.trim() || loading) return;
        const userMessage: ChatMessage = { role: 'user', content: inputValue.trim() };
        const newHistory = [...messages, userMessage];
        setMessages(newHistory);
        setInputValue('');
        const response = await onConsult(persona, depth, model, inputValue.trim(), messages);
        if (response) {
            setMessages([...newHistory, { role: 'assistant', content: response }]);
        }
    };

    const handleCopyMessage = async (index: number) => {
        await navigator.clipboard.writeText(messages[index].content);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleCopyAll = async () => {
        const fullText = messages.map((m) =>
            `${m.role === 'user' ? '【質問】' : '【AI軍師】'}\n${m.content}`
        ).join('\n\n---\n\n');
        await navigator.clipboard.writeText(fullText);
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleFollowUp();
        }
    };

    const getPersonaDisplay = () => {
        const p = personas.find(p => p.id === persona);
        return p || personas[0];
    };

    return (
        <div style={{
            background: t.card,
            border: `1px solid ${t.border}`,
            borderRadius: 2,
            overflow: "hidden",
            transition: "all 0.3s",
        }}>
            {/* Header */}
            <div style={{ padding: "20px 24px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 3, height: 14, background: t.text1, borderRadius: 1, opacity: 0.4 }} />
                    <span style={{ fontSize: 15, fontWeight: 600, color: t.text1, fontFamily: fonts.serif, letterSpacing: 2 }}>AI軍師</span>
                    <span style={{ fontSize: 10, color: t.text4, fontFamily: fonts.mono, marginLeft: "auto", letterSpacing: 2 }}>IMPERIAL STRATEGIST</span>
                </div>

                {/* Persona Selection */}
                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 500, color: t.text3, fontFamily: fonts.mono, letterSpacing: 2, marginBottom: 8 }}>
                        👤 相談相手
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                        {personas.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setPersona(p.id)}
                                style={{
                                    padding: "8px 4px",
                                    border: `1px solid ${persona === p.id ? t.text1 + "40" : t.border}`,
                                    background: persona === p.id ? `${t.text1}08` : "transparent",
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 4,
                                    transition: "all 0.2s",
                                    borderRadius: 0,
                                }}
                            >
                                <img src={p.icon} alt={p.label} style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                                <span style={{
                                    fontSize: 11,
                                    fontWeight: persona === p.id ? 600 : 300,
                                    color: persona === p.id ? t.text1 : t.text3,
                                    fontFamily: fonts.serif,
                                }}>{p.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Depth Selection */}
                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 500, color: t.text3, fontFamily: fonts.mono, letterSpacing: 2, marginBottom: 8 }}>
                        📖 解説レベル
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                        {([
                            { id: "professional" as const, label: "専門的" },
                            { id: "intermediate" as const, label: "中級者向け" },
                            { id: "beginner" as const, label: "初心者向け" },
                        ]).map((d) => (
                            <button
                                key={d.id}
                                onClick={() => setDepth(d.id)}
                                style={{
                                    padding: "10px 0",
                                    border: `1px solid ${depth === d.id ? t.text1 + "40" : t.border}`,
                                    background: depth === d.id ? `${t.text1}08` : "transparent",
                                    cursor: "pointer",
                                    fontSize: 14,
                                    fontWeight: depth === d.id ? 600 : 300,
                                    color: depth === d.id ? t.text1 : t.text3,
                                    fontFamily: fonts.serif,
                                    transition: "all 0.2s",
                                    borderRadius: 0,
                                }}
                            >
                                {d.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Model Selection */}
                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 500, color: t.text3, fontFamily: fonts.mono, letterSpacing: 2, marginBottom: 8 }}>
                        🧠 AIモデル選択
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                        {models.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setModel(m.id)}
                                style={{
                                    padding: "10px 4px",
                                    border: `1px solid ${model === m.id ? t.text1 + "40" : t.border}`,
                                    background: model === m.id ? `${t.text1}08` : "transparent",
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 2,
                                    transition: "all 0.2s",
                                    borderRadius: 0,
                                }}
                            >
                                <span style={{
                                    fontSize: 13,
                                    fontWeight: model === m.id ? 600 : 400,
                                    color: model === m.id ? t.text1 : t.text3,
                                    fontFamily: fonts.mono,
                                }}>{m.label}</span>
                                <span style={{ fontSize: 10, color: t.text4, fontFamily: fonts.mono }}>{m.sub}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Consult Button */}
                <button
                    onClick={handleInitialConsult}
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
                        letterSpacing: 3,
                        color: t.text1,
                        background: "transparent",
                        transition: "all 0.2s",
                        opacity: loading ? 0.5 : 1,
                    }}
                >
                    {loading && messages.length === 0 ? (
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.vermillion, animation: "pulse 1s infinite" }} />
                            思考中...
                        </span>
                    ) : "鑑定結果を読み解く"}
                </button>
            </div>

            {/* Chat Messages */}
            {messages.length > 0 && (
                <div style={{ borderTop: `1px solid ${t.border}`, padding: "20px 24px" }}>
                    {/* Copy All */}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                        <button
                            onClick={handleCopyAll}
                            style={{ background: "none", border: "none", color: copiedAll ? t.vermillion : t.text3, fontSize: 12, cursor: "pointer", fontFamily: fonts.mono }}
                        >
                            {copiedAll ? '✓ コピーしました' : '全体をコピー'}
                        </button>
                    </div>

                    {/* Message List */}
                    <div style={{ maxHeight: 500, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: 16,
                                    borderLeft: msg.role === 'assistant' ? `2px solid ${t.text1}20` : "none",
                                    background: msg.role === 'user' ? `${t.text1}04` : "transparent",
                                    position: "relative",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                    {msg.role === 'user' ? (
                                        <span style={{ fontSize: 16 }}>👤</span>
                                    ) : (
                                        <img src={getPersonaDisplay().icon} alt={getPersonaDisplay().label} style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover" }} />
                                    )}
                                    <span style={{ fontSize: 12, fontWeight: 600, color: t.text3, fontFamily: fonts.mono }}>
                                        {msg.role === 'user' ? 'あなた' : getPersonaDisplay().label}
                                    </span>
                                    {msg.role !== 'user' && index === 0 && (
                                        <span style={{
                                            fontSize: 10, padding: "1px 6px",
                                            border: `1px solid ${t.border}`,
                                            color: t.text4,
                                            fontFamily: fonts.mono,
                                        }}>
                                            {model === 'gemini-3.0-pro-high' ? 'Gemini 3.0 Pro High' :
                                                model === 'gemini-3.0-pro-low' ? 'Gemini 3.0 Pro' : 'Gemini Flash'}
                                        </span>
                                    )}
                                    <button
                                        onClick={() => handleCopyMessage(index)}
                                        style={{
                                            marginLeft: "auto", background: "none", border: "none",
                                            color: copiedIndex === index ? t.vermillion : t.text4,
                                            fontSize: 12, cursor: "pointer", fontFamily: fonts.mono,
                                        }}
                                    >
                                        {copiedIndex === index ? '✓' : '⎘'}
                                    </button>
                                </div>
                                <div style={{
                                    color: t.text1,
                                    lineHeight: 2,
                                    fontSize: 15,
                                    fontFamily: fonts.serif,
                                    fontWeight: 300,
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                    transition: "color 0.3s",
                                }}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Quick Question Buttons */}
                    <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 16, marginTop: 16 }}>
                        {/* テーマ */}
                        <div style={{ marginBottom: 12 }}>
                            <div style={{ fontSize: 10, fontWeight: 600, color: t.text4, fontFamily: fonts.mono, letterSpacing: 2, marginBottom: 6, textTransform: "uppercase" as const }}>テーマ</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                                {[
                                    { label: '💕 恋愛', text: '恋愛運について詳しく教えてください。私の宿命から見える恋愛の傾向、理想のパートナー像、気をつけるべき点などを解説してください。' },
                                    { label: '💼 仕事', text: '仕事運について詳しく教えてください。私の宿命に適した職業、働き方、成功へのポイントを解説してください。' },
                                    { label: '💰 お金', text: 'お金・財運について詳しく教えてください。私の宿命から見える金運の傾向、お金との付き合い方を解説してください。' },
                                    { label: '🏥 健康', text: '健康運について詳しく教えてください。私の宿命から見える健康面での注意点、体質の傾向を解説してください。' },
                                    { label: '✨ 運氣UP', text: '運氣を開いた人生を送るためのポイントを教えてください。私の宿命を活かして開運するための具体的なアドバイスをお願いします。' },
                                    { label: '📅 今年', text: '今年の運氣について詳しく教えてください。年運から見える今年のテーマ、チャンス、注意点を解説してください。' },
                                ].map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={() => setInputValue(item.text)}
                                        style={{
                                            padding: "3px 10px",
                                            fontSize: 11,
                                            border: `1px solid ${t.border}`,
                                            background: `${t.text1}04`,
                                            color: t.text2,
                                            fontFamily: fonts.serif,
                                            cursor: "pointer",
                                            transition: "all 0.2s",
                                            borderRadius: 0,
                                        }}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* 各ポイント */}
                        <div>
                            <div style={{ fontSize: 10, fontWeight: 600, color: t.text4, fontFamily: fonts.mono, letterSpacing: 2, marginBottom: 6, textTransform: "uppercase" as const }}>各ポイント</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                                {[
                                    { label: '陰占と陽占', text: '陰占と陽占について詳しく解説してください。それぞれの読み方と、私の命式ではどのような意味を持つか教えてください。' },
                                    { label: '陽占', text: '陽占（人体星図）について詳しく解説してください。各星の配置と意味、精神構造の全体像を教えてください。' },
                                    { label: '大運', text: '大運について詳しく解説してください。これまでの大運の流れと、今後の大運のテーマを教えてください。' },
                                    { label: '年運', text: '年運について詳しく解説してください。直近5年と今後5年の運気の流れを教えてください。' },
                                    { label: '宇宙盤', text: '宇宙盤（八門法）について詳しく解説してください。私のエネルギー分布と、どの領域を意識すべきか教えてください。' },
                                ].map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={() => setInputValue(item.text)}
                                        style={{
                                            padding: "3px 10px",
                                            fontSize: 11,
                                            border: `1px solid ${t.border}`,
                                            background: "transparent",
                                            color: t.text3,
                                            fontFamily: fonts.serif,
                                            cursor: "pointer",
                                            transition: "all 0.2s",
                                            borderRadius: 0,
                                        }}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Follow-up Input */}
                    <div style={{ display: "flex", gap: 6, marginTop: 16, background: t.inputBg, padding: "3px 3px 3px 14px", border: `1px solid ${t.border}` }}>
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="追加で質問する..."
                            rows={1}
                            style={{
                                flex: 1, background: "none", border: "none",
                                color: t.text1, fontFamily: fonts.serif, fontSize: 14,
                                outline: "none", resize: "none",
                                minHeight: 36, maxHeight: 120,
                                padding: "8px 0",
                            }}
                        />
                        <button
                            onClick={handleFollowUp}
                            disabled={loading || !inputValue.trim()}
                            style={{
                                width: 36, height: 36,
                                border: `1px solid ${t.border}`,
                                background: "transparent",
                                color: loading ? t.text4 : t.text1,
                                cursor: loading || !inputValue.trim() ? "default" : "pointer",
                                fontSize: 16,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                opacity: loading || !inputValue.trim() ? 0.3 : 1,
                                transition: "all 0.2s",
                                alignSelf: "flex-end",
                                flexShrink: 0,
                            }}
                        >
                            {loading ? "…" : "↑"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
