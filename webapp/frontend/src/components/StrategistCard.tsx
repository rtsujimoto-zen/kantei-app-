import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, User, BookOpen, Copy, Check, Send } from "lucide-react";

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface AiStrategistProps {
    onConsult: (persona: 'jiya' | 'master', depth: 'professional' | 'beginner', message?: string, history?: ChatMessage[]) => Promise<string | null>;
    loading: boolean;
    className?: string;
}

export function AiStrategist({ onConsult, loading, className }: AiStrategistProps) {
    const [persona, setPersona] = useState<'jiya' | 'master'>('jiya');
    const [depth, setDepth] = useState<'professional' | 'beginner'>('professional');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [copiedAll, setCopiedAll] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleInitialConsult = async () => {
        const response = await onConsult(persona, depth, undefined, []);
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

        const response = await onConsult(persona, depth, inputValue.trim(), messages);
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
                    あなたの運勢について、専門的なアドバイスを受け取れます。
                </CardDescription>
            </CardHeader>

            <CardContent className="p-6 md:p-8 -mt-6 bg-white rounded-t-3xl relative z-10 space-y-6">
                {/* Persona & Depth Selection (only show before first message) */}
                {messages.length === 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Persona Selection */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                                    <User className="w-4 h-4" /> 相談相手
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant={persona === 'jiya' ? 'default' : 'outline'}
                                        onClick={() => setPersona('jiya')}
                                        className={cn(
                                            "rounded-xl h-12 shadow-none border-gray-200",
                                            persona === 'jiya' ? "bg-orange-100 text-orange-700 hover:bg-orange-200 border-transparent" : "text-gray-500"
                                        )}
                                    >
                                        👴 老執事
                                    </Button>
                                    <Button
                                        variant={persona === 'master' ? 'default' : 'outline'}
                                        onClick={() => setPersona('master')}
                                        className={cn(
                                            "rounded-xl h-12 shadow-none border-gray-200",
                                            persona === 'master' ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border-transparent" : "text-gray-500"
                                        )}
                                    >
                                        ⚔️ 師匠
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

                        <Button
                            size="lg"
                            className="w-full h-14 rounded-2xl bg-foreground text-background hover:bg-foreground/90 shadow-lg font-bold text-lg"
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
                )}

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
                                                <div className="text-xs font-bold text-muted-foreground mb-1">
                                                    {msg.role === 'user' ? 'あなた' : (persona === 'jiya' ? '老執事' : '師匠')}
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

                        {/* Follow-up Input */}
                        <div className="flex gap-2 pt-4 border-t border-secondary">
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
