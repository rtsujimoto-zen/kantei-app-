import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, User, BookOpen, Copy, Check, Send, Zap, Brain } from "lucide-react";

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export type AiModel = 'gemini-3.0-pro-high' | 'gemini-3.0-pro-low' | 'gemini-flash';

export type AiPersona = 'jiya' | 'master' | 'tokyo_mother' | 'onmyoji';

interface AiStrategistProps {
    onConsult: (
        persona: AiPersona,
        depth: 'professional' | 'beginner',
        model: AiModel,
        message?: string,
        history?: ChatMessage[]
    ) => Promise<string | null>;
    loading: boolean;
    className?: string;
}

export function AiStrategist({ onConsult, loading, className }: AiStrategistProps) {
    const [persona, setPersona] = useState<AiPersona>('onmyoji');
    const [depth, setDepth] = useState<'professional' | 'beginner'>('professional');
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
        const fullText = messages.map((m, i) =>
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

    return (
        <Card className={cn("border-none shadow-soft rounded-3xl bg-white overflow-hidden", className)}>
            <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 pb-8">
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-orange-900">
                    <Sparkles className="w-5 h-5 text-orange-500" />
                    AI軍師に相談する
                </CardTitle>
                <CardDescription className="text-orange-700/60">
                    最新のGeminiモデルを活用し、深い洞察と戦略を提供します。
                </CardDescription>
            </CardHeader>

            <CardContent className="p-6 md:p-8 -mt-6 bg-white rounded-t-3xl relative z-10 space-y-6">
                {/* Configuration - Always visible */}
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Persona Selection */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                                <User className="w-4 h-4" /> 相談相手
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant={persona === 'onmyoji' ? 'default' : 'outline'}
                                    onClick={() => setPersona('onmyoji')}
                                    className={cn(
                                        "rounded-xl h-auto py-2 shadow-none border-gray-200 flex flex-col items-center gap-0.5",
                                        persona === 'onmyoji' ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-transparent ring-2 ring-indigo-500/20" : "text-gray-500"
                                    )}
                                >
                                    <span className="text-lg">🌙</span>
                                    <span className="font-bold text-xs">現代の陰陽師</span>
                                </Button>
                                <Button
                                    variant={persona === 'tokyo_mother' ? 'default' : 'outline'}
                                    onClick={() => setPersona('tokyo_mother')}
                                    className={cn(
                                        "rounded-xl h-auto py-2 shadow-none border-gray-200 flex flex-col items-center gap-0.5",
                                        persona === 'tokyo_mother' ? "bg-pink-100 text-pink-700 hover:bg-pink-200 border-transparent ring-2 ring-pink-500/20" : "text-gray-500"
                                    )}
                                >
                                    <span className="text-lg">👩</span>
                                    <span className="font-bold text-xs">東京の母</span>
                                </Button>
                                <Button
                                    variant={persona === 'jiya' ? 'default' : 'outline'}
                                    onClick={() => setPersona('jiya')}
                                    className={cn(
                                        "rounded-xl h-auto py-2 shadow-none border-gray-200 flex flex-col items-center gap-0.5",
                                        persona === 'jiya' ? "bg-orange-100 text-orange-700 hover:bg-orange-200 border-transparent ring-2 ring-orange-500/20" : "text-gray-500"
                                    )}
                                >
                                    <span className="text-lg">👴</span>
                                    <span className="font-bold text-xs">老執事</span>
                                </Button>
                                <Button
                                    variant={persona === 'master' ? 'default' : 'outline'}
                                    onClick={() => setPersona('master')}
                                    className={cn(
                                        "rounded-xl h-auto py-2 shadow-none border-gray-200 flex flex-col items-center gap-0.5",
                                        persona === 'master' ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border-transparent ring-2 ring-slate-500/20" : "text-gray-500"
                                    )}
                                >
                                    <span className="text-lg">⚔️</span>
                                    <span className="font-bold text-xs">師匠</span>
                                </Button>
                            </div>
                        </div>

                        {/* Depth Selection */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                                <BookOpen className="w-4 h-4" /> 解説レベル
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    variant={depth === 'professional' ? 'default' : 'outline'}
                                    onClick={() => setDepth('professional')}
                                    className={cn(
                                        "rounded-xl h-12 shadow-none border-gray-200",
                                        depth === 'professional' ? "bg-orange-100 text-orange-700 hover:bg-orange-200 border-transparent" : "text-gray-500"
                                    )}
                                >
                                    専門的
                                </Button>
                                <Button
                                    variant={depth === 'beginner' ? 'default' : 'outline'}
                                    onClick={() => setDepth('beginner')}
                                    className={cn(
                                        "rounded-xl h-12 shadow-none border-gray-200",
                                        depth === 'beginner' ? "bg-green-100 text-green-700 hover:bg-green-200 border-transparent" : "text-gray-500"
                                    )}
                                >
                                    初心者向け
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Model Selection */}
                    <div className="space-y-3 pt-2">
                        <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                            <Brain className="w-4 h-4" /> AIモデル選択
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            <Button
                                variant={model === 'gemini-3.0-pro-high' ? 'default' : 'outline'}
                                onClick={() => setModel('gemini-3.0-pro-high')}
                                className={cn(
                                    "rounded-xl h-auto py-3 shadow-none border-gray-200 flex flex-col items-center gap-1",
                                    model === 'gemini-3.0-pro-high' ? "bg-purple-100 text-purple-700 hover:bg-purple-200 border-transparent ring-2 ring-purple-500/20" : "text-gray-500"
                                )}
                            >
                                <span className="font-bold text-sm">Pro High</span>
                                <span className="text-[10px] opacity-80 font-normal">熟考・最大性能</span>
                            </Button>
                            <Button
                                variant={model === 'gemini-3.0-pro-low' ? 'default' : 'outline'}
                                onClick={() => setModel('gemini-3.0-pro-low')}
                                className={cn(
                                    "rounded-xl h-auto py-3 shadow-none border-gray-200 flex flex-col items-center gap-1",
                                    model === 'gemini-3.0-pro-low' ? "bg-blue-100 text-blue-700 hover:bg-blue-200 border-transparent ring-2 ring-blue-500/20" : "text-gray-500"
                                )}
                            >
                                <span className="font-bold text-sm">Pro Low</span>
                                <span className="text-[10px] opacity-80 font-normal">通常・バランス</span>
                            </Button>
                            <Button
                                variant={model === 'gemini-flash' ? 'default' : 'outline'}
                                onClick={() => setModel('gemini-flash')}
                                className={cn(
                                    "rounded-xl h-auto py-3 shadow-none border-gray-200 flex flex-col items-center gap-1",
                                    model === 'gemini-flash' ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-transparent ring-2 ring-yellow-500/20" : "text-gray-500"
                                )}
                            >
                                <span className="flex items-center gap-1 font-bold text-sm"><Zap className="w-3 h-3" /> Flash</span>
                                <span className="text-[10px] opacity-80 font-normal">Gemini 3 Flash</span>
                            </Button>
                        </div>
                    </div>

                    <Button
                        size="lg"
                        className="w-full h-14 rounded-2xl bg-foreground text-background hover:bg-foreground/90 shadow-lg font-bold text-lg mt-4"
                        onClick={handleInitialConsult}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                                思考中...
                            </span>
                        ) : (
                            "鑑定結果を読み解く"
                        )}
                    </Button>
                </>


                {/* Chat Messages */}
                {messages.length > 0 && (
                    <div className="space-y-4">
                        {/* Copy All Button */}
                        <div className="flex justify-end">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCopyAll}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                {copiedAll ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                                {copiedAll ? 'コピーしました' : '全体をコピー'}
                            </Button>
                        </div>

                        {/* Message List */}
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                            <AnimatePresence>
                                {messages.map((msg, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "relative group rounded-2xl p-4",
                                            msg.role === 'user'
                                                ? "bg-orange-50 ml-8"
                                                : "bg-secondary/30 border border-secondary mr-8"
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="text-2xl flex-shrink-0">
                                                {msg.role === 'user' ? '👤' : (persona === 'jiya' ? '👴' : '⚔️')}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-bold text-muted-foreground">
                                                        {msg.role === 'user' ? 'あなた' : (persona === 'jiya' ? '老執事' : '師匠')}
                                                    </span>
                                                    {msg.role !== 'user' && index === 0 && (
                                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-500 border border-stone-200">
                                                            {model === 'gemini-3.0-pro-high' ? 'Gemini 3.0 Pro High' :
                                                                model === 'gemini-3.0-pro-low' ? 'Gemini 3.0 Pro' : 'Gemini Flash'}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap break-words">
                                                    {msg.content}
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleCopyMessage(index)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                            >
                                                {copiedIndex === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <div ref={chatEndRef} />
                        </div>

                        {/* Quick Question Buttons */}
                        <div className="space-y-3 pt-4 border-t border-secondary">
                            {/* テーマ */}
                            <div>
                                <div className="text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">テーマ</div>
                                <div className="flex flex-wrap gap-1.5">
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
                                            className="px-2.5 py-1 text-xs rounded-full bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 transition-colors"
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* 各ポイント */}
                            <div>
                                <div className="text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wider">各ポイント</div>
                                <div className="flex flex-wrap gap-1.5">
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
                                            className="px-2.5 py-1 text-xs rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Follow-up Input */}
                        <div className="flex gap-2 pt-3">
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="追加で質問する..."
                                className="flex-1 bg-secondary/30 border-none rounded-xl p-3 text-foreground resize-none focus:ring-2 focus:ring-primary/20 outline-none min-h-[48px] max-h-[120px]"
                                rows={1}
                            />
                            <Button
                                onClick={handleFollowUp}
                                disabled={loading || !inputValue.trim()}
                                className="rounded-xl bg-foreground text-background hover:bg-foreground/90 px-4"
                            >
                                {loading ? (
                                    <span className="w-4 h-4 rounded-full border-2 border-background/30 border-t-background animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
