import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, User, BookOpen } from "lucide-react";

interface AiStrategistProps {
    onConsult: (persona: 'jiya' | 'master', depth: 'professional' | 'beginner') => Promise<void>;
    loading: boolean;
    result: string | null;
    className?: string;
}

export function AiStrategist({ onConsult, loading, result, className }: AiStrategistProps) {
    const [persona, setPersona] = useState<'jiya' | 'master'>('jiya');
    const [depth, setDepth] = useState<'professional' | 'beginner'>('professional');

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
                    onClick={() => onConsult(persona, depth)}
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

                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-6 p-6 rounded-2xl bg-secondary/30 border border-secondary text-foreground/80 leading-relaxed font-medium whitespace-pre-wrap">
                                {result}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}
