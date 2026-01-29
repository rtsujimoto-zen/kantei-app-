import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageSquare, User, BookOpen } from "lucide-react";

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
        <Card className={cn("border-amber-500/20 bg-gradient-to-br from-neutral-900 to-black overflow-hidden relative", className)}>
            {/* Background glow effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <Sparkles className="w-6 h-6 text-amber-500" />
                    AI Strategist
                </CardTitle>
                <CardDescription>
                    Consult your personal military strategist. Choose a persona and depth of analysis.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Persona Selection */}
                    <div className="space-y-3">
                        <label className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <User className="w-3 h-3" /> Persona
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant={persona === 'jiya' ? 'default' : 'outline'}
                                onClick={() => setPersona('jiya')}
                                className={cn(persona === 'jiya' && "bg-amber-700 hover:bg-amber-600 border-amber-600")}
                            >
                                👴 Old Butler
                            </Button>
                            <Button
                                variant={persona === 'master' ? 'default' : 'outline'}
                                onClick={() => setPersona('master')}
                                className={cn(persona === 'master' && "bg-slate-700 hover:bg-slate-600 border-slate-600")}
                            >
                                ⚔️ Master
                            </Button>
                        </div>
                    </div>

                    {/* Depth Selection */}
                    <div className="space-y-3">
                        <label className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <BookOpen className="w-3 h-3" /> Depth
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant={depth === 'professional' ? 'default' : 'outline'}
                                onClick={() => setDepth('professional')}
                            >
                                Create
                            </Button>
                            <Button
                                variant={depth === 'beginner' ? 'default' : 'outline'}
                                onClick={() => setDepth('beginner')}
                            >
                                Beginner
                            </Button>
                        </div>
                    </div>
                </div>

                <Button
                    variant="premium"
                    size="lg"
                    className="w-full text-md h-12 relative overflow-hidden group"
                    onClick={() => onConsult(persona, depth)}
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                            Thinking...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            Consult AI <Sparkles className="w-4 h-4" />
                        </span>
                    )}
                    {/* Shine effect */}
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
                </Button>

                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-4 p-6 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm relative font-serif leading-relaxed text-amber-50/90 whitespace-pre-wrap">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-transparent" />
                                {result}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}
