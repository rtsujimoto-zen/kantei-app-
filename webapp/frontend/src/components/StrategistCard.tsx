"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { useTheme } from "./ThemeContext";

const fonts = {
    serif: "var(--font-noto-serif-jp), 'Noto Serif JP', serif",
    mono: "var(--font-dm-mono), 'DM Mono', monospace",
};

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    personaId?: AiPersona;
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
    layout?: 'panel' | 'float';
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

export function AiStrategist({ onConsult, loading, className, layout = 'panel' }: AiStrategistProps) {
    const { t, isDark } = useTheme();
    const [persona, setPersona] = useState<AiPersona>('onmyoji');
    const [depth, setDepth] = useState<'professional' | 'intermediate' | 'beginner'>('beginner');
    const [model, setModel] = useState<AiModel>('gemini-flash');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [copiedAll, setCopiedAll] = useState(false);
    const [floatOpen, setFloatOpen] = useState(false);
    const [showPersonaPopup, setShowPersonaPopup] = useState(false);
    const [zoomedPersona, setZoomedPersona] = useState<{ icon: string; label: string } | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const chatStartRef = useRef<HTMLDivElement>(null);
    const prevMessagesLenRef = useRef(0);

    useEffect(() => {
        // Scroll to start of new response (not end)
        if (messages.length > prevMessagesLenRef.current && messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            if (lastMsg.role === 'assistant') {
                // Scroll to start of new assistant message
                setTimeout(() => {
                    chatStartRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
        prevMessagesLenRef.current = messages.length;
    }, [messages]);

    // Open float when first message arrives
    useEffect(() => {
        if (messages.length > 0 && layout === 'float') setFloatOpen(true);
    }, [messages, layout]);

    const handleInitialConsult = async () => {
        const currentPersona = persona;
        const response = await onConsult(currentPersona, depth, model, undefined, []);
        if (response) {
            setMessages([{ role: 'assistant', content: response, personaId: currentPersona }]);
        }
    };

    const handleFollowUp = async () => {
        if (!inputValue.trim() || loading) return;
        const currentPersona = persona;
        const userMessage: ChatMessage = { role: 'user', content: inputValue.trim() };
        const newHistory = [...messages, userMessage];
        setMessages(newHistory);
        setInputValue('');
        const response = await onConsult(currentPersona, depth, model, inputValue.trim(), messages);
        if (response) {
            setMessages([...newHistory, { role: 'assistant', content: response, personaId: currentPersona }]);
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
        // Enterは改行を許可。送信はボタンのみ
    };

    const getPersonaDisplay = (id?: AiPersona) => {
        const targetId = id || persona;
        const p = personas.find(p => p.id === targetId);
        return p || personas[0];
    };

    // SVG copy icon component
    const CopyIcon = ({ size = 12, color = t.text4 }: { size?: number; color?: string }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
    );

    // ============================================
    // Shared UI fragments
    // ============================================
    const personaSelector = (
        <div style={{ marginBottom: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 500, color: t.text3, fontFamily: fonts.serif, letterSpacing: 2, marginBottom: 8 }}>
                👤 相談相手
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {personas.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => { setPersona(p.id); setShowPersonaPopup(false); }}
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
                        <div style={{
                            width: 36, height: 36, borderRadius: "50%", overflow: "hidden",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <img src={p.icon} alt={p.label} style={{
                                width: p.id === 'tokyo_mother' ? 52 : 36,
                                height: p.id === 'tokyo_mother' ? 52 : 36,
                                objectFit: "cover",
                                objectPosition: p.id === 'tokyo_mother' ? "center 20%" : "center",
                            }} />
                        </div>
                        <span style={{ fontSize: 9, color: persona === p.id ? t.text1 : t.text4, fontFamily: fonts.serif, lineHeight: 1.2, textAlign: "center" }}>{p.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );

    const depthSelector = (
        <div style={{ marginBottom: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 500, color: t.text3, fontFamily: fonts.serif, letterSpacing: 2, marginBottom: 8 }}>
                📖 解説レベル
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                {([
                    { id: 'professional' as const, label: '専門的', desc: '算命学用語で深く' },
                    { id: 'intermediate' as const, label: '中級者向け', desc: 'わかりやすく丁寧に' },
                    { id: 'beginner' as const, label: '初心者向け', desc: '結論ファースト' },
                ]).map((d) => (
                    <button
                        key={d.id}
                        onClick={() => setDepth(d.id)}
                        style={{
                            padding: "10px 4px",
                            border: `1px solid ${depth === d.id ? t.text1 + "40" : t.border}`,
                            background: depth === d.id ? `${t.text1}08` : "transparent",
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                            transition: "all 0.2s",
                            borderRadius: 0,
                        }}
                    >
                        <span style={{ fontSize: 13, fontWeight: depth === d.id ? 600 : 400, color: depth === d.id ? t.text1 : t.text3, fontFamily: fonts.serif }}>{d.label}</span>
                        <span style={{ fontSize: 9, color: t.text4, fontFamily: fonts.mono }}>{d.desc}</span>
                    </button>
                ))}
            </div>
        </div>
    );

    const modelSelector = (
        <div style={{ marginBottom: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 500, color: t.text3, fontFamily: fonts.serif, letterSpacing: 2, marginBottom: 8 }}>
                🤖 AIモデル
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
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
                        <span style={{ fontSize: 13, fontWeight: model === m.id ? 600 : 400, color: model === m.id ? t.text1 : t.text3, fontFamily: fonts.mono }}>{m.label}</span>
                        <span style={{ fontSize: 10, color: t.text4, fontFamily: fonts.mono }}>{m.sub}</span>
                    </button>
                ))}
            </div>
        </div>
    );

    const chatMessages = (
        <div className="chat-scroll-area" style={{ flex: 1, overflowY: "auto", padding: "16px 16px", WebkitOverflowScrolling: "touch" }}>
            {messages.length > 0 && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                    <button onClick={handleCopyAll} style={{ background: "none", border: "none", fontSize: 11, color: copiedAll ? t.vermillion : t.text4, cursor: "pointer", fontFamily: fonts.mono, display: "flex", alignItems: "center", gap: 3 }}>
                        {copiedAll ? '✓ Copied' : <><CopyIcon size={13} color={t.text4} /> 全コピー</>}
                    </button>
                </div>
            )}
            {messages.map((msg, i) => {
                const isUser = msg.role === 'user';
                // Place scroll marker before the last assistant message
                const isLastAssistant = !isUser && i === messages.length - 1;
                const msgPersona = getPersonaDisplay(msg.personaId);
                return (
                    <div key={i}>
                        {isLastAssistant && <div ref={chatStartRef} />}
                        <div style={{
                            display: "flex",
                            flexDirection: isUser ? "row-reverse" : "row",
                            alignItems: "flex-start",
                            gap: 10,
                            marginBottom: 18,
                        }}>
                            {/* アイコン（軍師のみ）- タップでアップ表示 */}
                            {!isUser && (
                                <img
                                    src={msgPersona.icon}
                                    alt={msgPersona.label}
                                    onClick={() => setZoomedPersona(msgPersona)}
                                    style={{ width: 40, height: 40, objectFit: "contain", flexShrink: 0, marginTop: 2, cursor: "pointer", borderRadius: "50%" }}
                                />
                            )}
                            {/* 吹き出し */}
                            <div style={{ maxWidth: "80%", position: "relative" }}>
                                {/* 名前 */}
                                <div style={{
                                    fontSize: 10,
                                    color: t.text4,
                                    fontFamily: fonts.mono,
                                    marginBottom: 3,
                                    textAlign: isUser ? "right" : "left",
                                }}>
                                    {isUser ? 'あなた' : msgPersona.label}
                                </div>
                                {/* メッセージ本体 */}
                                <div style={{
                                    position: "relative",
                                    padding: "10px 14px",
                                    borderRadius: isUser ? "14px 2px 14px 14px" : "2px 14px 14px 14px",
                                    background: isUser
                                        ? (isDark ? '#2a4a3a' : '#dcf8c6')
                                        : (isDark ? `${t.text1}0a` : '#ffffff'),
                                    border: isUser ? 'none' : `1px solid ${t.border}`,
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                                    fontSize: 14,
                                    lineHeight: 1.85,
                                    color: t.text1,
                                    fontFamily: isUser ? fonts.mono : fonts.serif,
                                    whiteSpace: isUser ? "pre-wrap" : "normal",
                                }}>
                                    {isUser ? msg.content : (
                                        <div className="ai-message-md">
                                            <ReactMarkdown
                                                components={{
                                                    h1: ({ children }) => <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text1, margin: '20px 0 8px', fontFamily: fonts.serif, borderBottom: `1px solid ${t.border}`, paddingBottom: 6 }}>{children}</h3>,
                                                    h2: ({ children }) => <h3 style={{ fontSize: 15, fontWeight: 700, color: t.text1, margin: '18px 0 6px', fontFamily: fonts.serif }}>{children}</h3>,
                                                    h3: ({ children }) => <h4 style={{ fontSize: 14, fontWeight: 700, color: t.vermillion, margin: '16px 0 6px', fontFamily: fonts.serif }}>{children}</h4>,
                                                    p: ({ children }) => <p style={{ margin: '8px 0', lineHeight: 1.85 }}>{children}</p>,
                                                    strong: ({ children }) => <strong style={{ fontWeight: 700, color: t.text1 }}>{children}</strong>,
                                                    em: ({ children }) => <em style={{ fontStyle: 'normal', color: t.text2, borderBottom: `1px dotted ${t.text4}` }}>{children}</em>,
                                                    ul: ({ children }) => <ul style={{ margin: '6px 0', paddingLeft: 18, listStyleType: 'disc' }}>{children}</ul>,
                                                    ol: ({ children }) => <ol style={{ margin: '6px 0', paddingLeft: 18 }}>{children}</ol>,
                                                    li: ({ children }) => <li style={{ margin: '4px 0', lineHeight: 1.75 }}>{children}</li>,
                                                    hr: () => <hr style={{ border: 'none', borderTop: `1px solid ${t.border}`, margin: '16px 0' }} />,
                                                    blockquote: ({ children }) => <blockquote style={{ borderLeft: `3px solid ${t.vermillion}40`, paddingLeft: 12, margin: '8px 0', color: t.text2, fontStyle: 'italic' }}>{children}</blockquote>,
                                                    code: ({ children }) => <code style={{ background: `${t.text1}08`, padding: '1px 4px', borderRadius: 3, fontSize: 13, fontFamily: fonts.mono }}>{children}</code>,
                                                }}
                                            >{msg.content}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                                {/* コピーボタン - 右下固定 */}
                                <button
                                    onClick={() => handleCopyMessage(i)}
                                    style={{
                                        background: "none", border: "none",
                                        fontSize: 10, color: copiedIndex === i ? t.vermillion : t.text4,
                                        cursor: "pointer", fontFamily: fonts.mono,
                                        marginTop: 4,
                                        float: "right",
                                        display: "flex", alignItems: "center", gap: 3,
                                    }}
                                >
                                    {copiedIndex === i ? '✓ コピー済' : <CopyIcon size={14} color={t.text4} />}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}

            {loading && messages.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                    <img src={getPersonaDisplay().icon} alt="" style={{ width: 40, height: 40, objectFit: "contain" }} />
                    <div style={{
                        padding: "10px 14px",
                        borderRadius: "2px 14px 14px 14px",
                        background: isDark ? `${t.text1}0a` : '#ffffff',
                        border: `1px solid ${t.border}`,
                        fontSize: 13,
                        color: t.text3,
                        fontFamily: fonts.mono,
                    }}>
                        <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: t.vermillion, animation: "pulse 1s infinite", marginRight: 8, verticalAlign: "middle" }} />
                        思考中...
                    </div>
                </div>
            )}
            <div ref={chatEndRef} />
        </div>
    );

    const themeTopics = [
        { label: '恋愛', text: '恋愛運について詳しく教えてください。私の宿命から見える恋愛の傾向、理想のパートナー像、気をつけるべき点などを解説してください。' },
        { label: '仕事', text: '仕事運について詳しく教えてください。私の宿命に適した職業、働き方、成功へのポイントを解説してください。' },
        { label: 'お金', text: 'お金・財運について詳しく教えてください。私の宿命から見える金運の傾向、お金との付き合い方を解説してください。' },
        { label: '健康', text: '健康運について詳しく教えてください。私の宿命から見える健康面での注意点、体質の傾向を解説してください。' },
        { label: '運氣UP', text: '運氣を開いた人生を送るためのポイントを教えてください。私の宿命を活かして開運するための具体的なアドバイスをお願いします。' },
        { label: '今年', text: '今年の運氣について詳しく教えてください。年運から見える今年のテーマ、チャンス、注意点を解説してください。' },
    ];

    const pointTopics = [
        { label: '陰占と陽占', text: '陰占と陽占について詳しく解説してください。それぞれの読み方と、私の命式ではどのような意味を持つか教えてください。' },
        { label: '陽占', text: '陽占（人体星図）について詳しく解説してください。各星の配置と意味、精神構造の全体像を教えてください。' },
        { label: '大運', text: '大運について詳しく解説してください。これまでの大運の流れと、今後の大運のテーマを教えてください。' },
        { label: '年運', text: '年運について詳しく解説してください。直近5年と今後5年の運気の流れを教えてください。' },
        { label: '宇宙盤', text: '宇宙盤（八門法）について詳しく解説してください。私のエネルギー分布と、どの領域を意識すべきか教えてください。' },
    ];

    // Auto-resize textarea up to 10 lines
    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        const ta = textareaRef.current;
        if (ta) {
            ta.style.height = 'auto';
            const lineHeight = 20;
            const maxHeight = lineHeight * 10; // 10 lines
            ta.style.height = Math.min(ta.scrollHeight, maxHeight) + 'px';
        }
    };

    const chatInput = (
        <div style={{ display: "flex", gap: 6, background: t.inputBg, padding: "3px 3px 3px 6px", border: `1px solid ${t.border}`, alignItems: "flex-end" }}>
            {/* Persona icon in input bar */}
            <button
                onClick={() => setShowPersonaPopup(!showPersonaPopup)}
                style={{
                    width: 32, height: 32,
                    border: `1px solid ${t.border}`,
                    borderRadius: "50%",
                    background: "transparent",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    marginBottom: 2,
                }}
            >
                <img src={getPersonaDisplay().icon} alt="" style={{ width: 20, height: 20, objectFit: "contain" }} />
            </button>
            <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="追加で質問する..."
                rows={1}
                style={{
                    flex: 1, background: "none", border: "none",
                    color: t.text1, fontFamily: fonts.serif, fontSize: 14,
                    outline: "none", resize: "none",
                    minHeight: 36, maxHeight: 200,
                    padding: "8px 0",
                    lineHeight: '20px',
                    overflow: 'auto',
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
    );

    // ============================================
    // PANEL MODE (PC Right Pane)
    // ============================================
    if (layout === 'panel') {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                background: t.card,
            }}>
                {/* Panel Header */}
                <div style={{ padding: "16px 20px 12px", borderBottom: `1px solid ${t.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <img src={getPersonaDisplay().icon} alt="" style={{ width: 28, height: 28, objectFit: "contain" }} />
                        <span style={{ fontSize: 15, fontWeight: 600, color: t.text1, fontFamily: fonts.serif, letterSpacing: 2 }}>AI軍師</span>
                        <span style={{ fontSize: 10, color: t.text4, fontFamily: fonts.mono, marginLeft: "auto", letterSpacing: 1 }}>{getPersonaDisplay().label}</span>
                    </div>
                    {personaSelector}
                    {depthSelector}
                    {modelSelector}
                    {messages.length === 0 && (
                        <button
                            onClick={handleInitialConsult}
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px 0",
                                border: `1.5px solid ${t.text1}`,
                                borderRadius: 0,
                                cursor: loading ? "wait" : "pointer",
                                fontSize: 14,
                                fontWeight: 600,
                                fontFamily: fonts.serif,
                                letterSpacing: 3,
                                color: t.text1,
                                background: "transparent",
                                transition: "all 0.2s",
                                opacity: loading ? 0.5 : 1,
                            }}
                        >
                            {loading ? '思考中...' : '鑑定結果を読み解く'}
                        </button>
                    )}
                </div>

                {/* Chat area */}
                {messages.length > 0 && (
                    <>
                        {chatMessages}

                        {/* Quick topics */}
                        {!loading && (
                            <div style={{ padding: "0 20px 8px" }}>
                                <div style={{ marginBottom: 10 }}>
                                    <div style={{ fontSize: 10, fontWeight: 600, color: t.text4, fontFamily: fonts.serif, letterSpacing: 2, marginBottom: 5 }}>テーマ</div>
                                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                                        {themeTopics.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => { setInputValue(item.text); }}
                                                style={{
                                                    padding: "3px 10px",
                                                    border: `1px solid ${t.border}`,
                                                    background: `${t.text1}04`,
                                                    fontSize: 11,
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
                                <div>
                                    <div style={{ fontSize: 10, fontWeight: 600, color: t.text4, fontFamily: fonts.serif, letterSpacing: 2, marginBottom: 5 }}>各ポイント</div>
                                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                                        {pointTopics.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => { setInputValue(item.text); }}
                                                style={{
                                                    padding: "3px 10px",
                                                    border: `1px solid ${t.border}`,
                                                    background: `${t.text1}04`,
                                                    fontSize: 11,
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
                            </div>
                        )}

                        {/* Input */}
                        <div style={{ padding: "0 20px 16px" }}>
                            {chatInput}
                        </div>
                    </>
                )}
            </div>
        );
    }

    // ============================================
    // FLOAT MODE (Mobile Full-Screen Overlay)
    // ============================================
    return (
        <>
            {/* Persona Popup */}
            {showPersonaPopup && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 1098,
                        background: "rgba(0,0,0,0.3)",
                    }}
                    onClick={() => setShowPersonaPopup(false)}
                />
            )}
            {showPersonaPopup && (
                <div style={{
                    position: "fixed",
                    bottom: 70,
                    left: 16,
                    zIndex: 1099,
                    background: t.card,
                    border: `1px solid ${t.border}`,
                    boxShadow: "0 -4px 24px rgba(0,0,0,0.15)",
                    padding: 16,
                    width: 280,
                    borderRadius: 4,
                }}>
                    {personaSelector}
                    {depthSelector}
                    {modelSelector}
                </div>
            )}

            {/* Full-Screen Chat Overlay */}
            <div style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                background: t.card,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                transform: floatOpen ? "translateX(0)" : "translateX(100%)",
                transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                willChange: "transform",
                pointerEvents: floatOpen ? "auto" : "none",
            }}>
                {/* Header */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "14px 16px",
                    borderBottom: `1px solid ${t.border}`,
                    flexShrink: 0,
                }}>
                    <img src={getPersonaDisplay().icon} alt="" style={{ width: 28, height: 28, objectFit: "contain" }} />
                    <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 15, fontWeight: 600, color: t.text1, fontFamily: fonts.serif, letterSpacing: 2 }}>AI軍師</span>
                        <span style={{ fontSize: 10, color: t.text4, fontFamily: fonts.mono, marginLeft: 8, letterSpacing: 1 }}>{getPersonaDisplay().label}</span>
                    </div>
                    {/* Collapse button */}
                    <button
                        onClick={() => setFloatOpen(false)}
                        aria-label="たたむ"
                        style={{
                            padding: "6px 14px",
                            border: `1px solid ${t.border}`,
                            background: "transparent",
                            color: t.text3,
                            fontSize: 12,
                            fontFamily: fonts.serif,
                            cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 4,
                            flexShrink: 0,
                            letterSpacing: 1,
                        }}
                    >
                        <span style={{ fontSize: 11, fontFamily: fonts.mono }}>&gt;&gt;</span> たたむ
                    </button>
                </div>

                {/* Persona icon in chat mode (shown after first message) */}
                {messages.length > 0 && (
                    <div style={{ padding: "6px 16px", borderBottom: `1px solid ${t.border}`, flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
                        <button
                            onClick={() => setShowPersonaPopup(!showPersonaPopup)}
                            style={{
                                width: 32, height: 32,
                                border: `1px solid ${t.border}`,
                                borderRadius: "50%",
                                background: "transparent",
                                cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <img src={getPersonaDisplay().icon} alt="" style={{ width: 20, height: 20, objectFit: "contain" }} />
                        </button>
                        <span style={{ fontSize: 10, color: t.text4, fontFamily: fonts.mono }}>{getPersonaDisplay().label} / {models.find(m => m.id === model)?.label}</span>
                    </div>
                )}

                {/* Selectors: shown only before first message */}
                {messages.length === 0 && (
                    <div style={{ padding: "10px 16px", borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
                        {personaSelector}
                        {depthSelector}
                        {modelSelector}
                        <button
                            onClick={handleInitialConsult}
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px 0",
                                border: `1.5px solid ${t.text1}`,
                                borderRadius: 0,
                                cursor: loading ? "wait" : "pointer",
                                fontSize: 14,
                                fontWeight: 600,
                                fontFamily: fonts.serif,
                                letterSpacing: 3,
                                color: t.text1,
                                background: "transparent",
                                transition: "all 0.2s",
                                opacity: loading ? 0.5 : 1,
                                marginTop: 8,
                            }}
                        >
                            {loading ? '思考中...' : '鑑定結果を読み解く'}
                        </button>
                    </div>
                )}

                {/* Chat messages area (full screen after first message) */}
                {messages.length > 0 && (
                    <>
                        {chatMessages}

                        {/* Quick topics */}
                        {!loading && (
                            <div style={{ padding: "0 16px 6px", flexShrink: 0 }}>
                                <div style={{ marginBottom: 8 }}>
                                    <div style={{ fontSize: 10, fontWeight: 600, color: t.text4, fontFamily: fonts.serif, letterSpacing: 2, marginBottom: 4 }}>テーマ</div>
                                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                                        {themeTopics.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setInputValue(prev => prev ? prev + '\n' + item.text : item.text)}
                                                style={{
                                                    padding: "3px 10px",
                                                    border: `1px solid ${t.border}`,
                                                    background: `${t.text1}04`,
                                                    fontSize: 11,
                                                    color: t.text2,
                                                    fontFamily: fonts.serif,
                                                    cursor: "pointer",
                                                    borderRadius: 0,
                                                }}
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 10, fontWeight: 600, color: t.text4, fontFamily: fonts.serif, letterSpacing: 2, marginBottom: 4 }}>各ポイント</div>
                                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                                        {pointTopics.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setInputValue(prev => prev ? prev + '\n' + item.text : item.text)}
                                                style={{
                                                    padding: "3px 10px",
                                                    border: `1px solid ${t.border}`,
                                                    background: `${t.text1}04`,
                                                    fontSize: 11,
                                                    color: t.text2,
                                                    fontFamily: fonts.serif,
                                                    cursor: "pointer",
                                                    borderRadius: 0,
                                                }}
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div style={{ padding: "0 16px", paddingBottom: "max(12px, env(safe-area-inset-bottom))", flexShrink: 0 }}>
                            {chatInput}
                        </div>
                    </>
                )}
            </div>

            {/* Bottom bar for initial state (no messages yet) */}
            {!floatOpen && messages.length === 0 && (
                <div style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 800,
                    background: t.card,
                    borderTop: `1px solid ${t.border}`,
                    boxShadow: "0 -2px 12px rgba(0,0,0,0.08)",
                    padding: "10px 16px",
                    paddingBottom: "max(10px, env(safe-area-inset-bottom))",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                }}>
                    <button
                        onClick={() => setShowPersonaPopup(!showPersonaPopup)}
                        style={{
                            width: 40, height: 40,
                            border: `1px solid ${t.border}`,
                            borderRadius: "50%",
                            background: "transparent",
                            color: t.text1,
                            fontSize: 20,
                            cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <img src={getPersonaDisplay().icon} alt="" style={{ width: 24, height: 24, objectFit: "contain" }} />
                    </button>
                    <button
                        onClick={() => { setFloatOpen(true); }}
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: "10px 0",
                            border: `1.5px solid ${t.text1}`,
                            borderRadius: 0,
                            cursor: loading ? "wait" : "pointer",
                            fontSize: 14,
                            fontWeight: 600,
                            fontFamily: fonts.serif,
                            letterSpacing: 2,
                            color: t.text1,
                            background: "transparent",
                            opacity: loading ? 0.5 : 1,
                        }}
                    >
                        {loading ? '思考中...' : 'AI軍師を開く'}
                    </button>
                </div>
            )}

            {/* Side tab button on right edge (shown after chat has messages & overlay is closed) */}
            {!floatOpen && messages.length > 0 && (
                <button
                    onClick={() => setFloatOpen(true)}
                    style={{
                        position: "fixed",
                        right: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 800,
                        width: 24,
                        height: 140,
                        border: `1px solid ${t.border}`,
                        borderRight: "none",
                        borderRadius: "6px 0 0 6px",
                        background: `${t.card}ee`,
                        boxShadow: "-2px 0 8px rgba(0,0,0,0.06)",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0,
                        padding: "8px 2px",
                    }}
                >
                    {'チャットを開く'.split('').map((char, i) => (
                        <span key={i} style={{ fontSize: 10, color: t.text3, fontFamily: fonts.serif, lineHeight: 1.5 }}>{char}</span>
                    ))}
                </button>
            )}

            {/* Persona Zoom Modal */}
            {zoomedPersona && (
                <div
                    onClick={() => setZoomedPersona(null)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 2000,
                        background: "rgba(0,0,0,0.75)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 16,
                        cursor: "pointer",
                    }}
                >
                    <img
                        src={zoomedPersona.icon}
                        alt={zoomedPersona.label}
                        style={{
                            width: 180,
                            height: 180,
                            objectFit: "contain",
                            borderRadius: "50%",
                            background: `${t.card}`,
                            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                            padding: 12,
                        }}
                    />
                    <span style={{
                        color: "#fff",
                        fontSize: 16,
                        fontFamily: fonts.serif,
                        letterSpacing: 3,
                        textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                    }}>
                        {zoomedPersona.label}
                    </span>
                </div>
            )}
        </>
    );
}
