"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResultGrid, BentoItem } from './ResultGrid';
import { InsenCard } from './InsenCard';
import { YosenCard } from './YosenCard';
import { DaiunCard } from './DaiunCard';
import { AiStrategist, AiModel, AiPersona } from './StrategistCard';

// Types definition
interface SanmeiReport {
    陰占?: {
        年: string; 月: string; 日: string;
        蔵干: any;
    };
    陽占?: {
        十大主星: { [key: string]: string };
        十二大従星: { [key: string]: string };
        十二大従星詳細?: { [key: string]: { name: string; alias: string; full: string } };
    };
    天中殺?: {
        グループ: string;
        宿命天中殺: string[];
        タイミング?: { time: string; month: string; years: string[] };
    };
    異常干支?: string[];
    数理法?: { 総エネルギー: number; 五行分布: any };
    気図法?: any;
    八門法?: any;
    大運?: { サイクル: any[];[key: string]: any } | any[];
    年運?: any[];
    output_text?: string;
}

export default function Calculator() {
    const [birthday, setBirthday] = useState('1988-03-21');
    const [gender, setGender] = useState('M');
    const [report, setReport] = useState<SanmeiReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');

    // AI Strategist State
    const [isAiLoading, setIsAiLoading] = useState(false);


    useEffect(() => {
        setMounted(true);
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
            console.log("API Response:", data); // Debug logging
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
        depth: 'professional' | 'beginner',
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

    if (!mounted) return null; // Prevent hydration issues

    return (
        <div className="min-h-screen pb-20 selection:bg-orange-100">
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">

                {/* Header */}
                <header className="text-center space-y-4 py-10">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient-sunrise inline-block mb-2">
                            算命学
                        </h1>
                        <p className="text-muted-foreground text-sm tracking-wide">
                            あなたの本質と運命を、シンプルに紐解く
                        </p>
                    </motion.div>
                </header>

                {/* Input Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="max-w-xl mx-auto"
                >
                    <Card className="glass-card border-none rounded-3xl overflow-hidden p-2">
                        <CardContent className="p-6 md:p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">生年月日</label>
                                    <input
                                        type="date"
                                        value={birthday}
                                        onChange={(e) => setBirthday(e.target.value)}
                                        className="w-full bg-secondary/50 border-none rounded-2xl p-4 text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono text-lg shadow-inner"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">性別</label>
                                    <div className="flex bg-secondary/50 p-1 rounded-2xl">
                                        <button
                                            onClick={() => setGender('M')}
                                            className={`flex-1 py-3 rounded-xl transition-all text-sm font-bold ${gender === 'M' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            男性
                                        </button>
                                        <button
                                            onClick={() => setGender('F')}
                                            className={`flex-1 py-3 rounded-xl transition-all text-sm font-bold ${gender === 'F' ? 'bg-white text-rose-400 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            女性
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleCalculate}
                                disabled={loading}
                                className="w-full text-lg h-16 rounded-2xl bg-gradient-sunrise hover:opacity-90 transition-opacity shadow-lg shadow-orange-200 font-bold tracking-wide"
                            >
                                {loading ? '計算中...' : '鑑定する'}
                            </Button>

                            {error && <p className="text-destructive text-center text-sm bg-red-50 py-2 rounded-lg">{error}</p>}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Result Display */}
                <AnimatePresence mode="wait">
                    {report && report.陰占 && report.陽占 && report.天中殺 && (
                        <ResultGrid>

                            {/* Row 1: Core Analysis */}
                            <BentoItem colSpan="md:col-span-12 lg:col-span-4" delay={0.1}>
                                <InsenCard data={report.陰占} />
                            </BentoItem>

                            <BentoItem colSpan="md:col-span-12 lg:col-span-4" delay={0.2}>
                                <YosenCard data={report.陽占} />
                            </BentoItem>

                            <BentoItem colSpan="md:col-span-12 lg:col-span-4" delay={0.3}>
                                <div className="grid grid-cols-1 gap-6 h-full">
                                    <Card className="h-full border-none shadow-soft rounded-3xl bg-white/60 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="text-purple-400 text-lg">宿命情報</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <div className="text-xs text-muted-foreground mb-1">天中殺</div>
                                                <div className="text-2xl font-bold text-foreground">{report.天中殺.グループ}天中殺</div>
                                            </div>
                                            <div className="space-y-4 pt-2">
                                                <div className="bg-purple-50/50 p-3 rounded-xl">
                                                    <div className="text-xs text-purple-400 font-bold mb-1">宿命天中殺</div>
                                                    <div className="font-medium text-sm text-foreground">
                                                        {report.天中殺.宿命天中殺 && report.天中殺.宿命天中殺.length > 0 ? report.天中殺.宿命天中殺.join(', ') : 'なし'}
                                                    </div>
                                                </div>
                                                <div className="bg-purple-50/50 p-3 rounded-xl">
                                                    <div className="text-xs text-purple-400 font-bold mb-1">異常干支</div>
                                                    <div className="font-medium text-sm text-foreground">
                                                        {report.異常干支 && report.異常干支.length > 0 ? report.異常干支.join(', ') : 'なし'}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </BentoItem>

                            {/* Row 2: Daiun */}
                            <BentoItem colSpan="md:col-span-12" delay={0.4}>
                                <DaiunCard data={report.大運} />
                            </BentoItem>

                            {/* Row 5: Prompt Data (Copy) */}
                            {report.output_text && (
                                <BentoItem colSpan="md:col-span-12" delay={0.6}>
                                    <div className="mx-auto max-w-4xl">
                                        <Card className="glass-card border-none rounded-3xl overflow-hidden">
                                            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-black/20">
                                                <CardTitle className="text-sm font-bold text-stone-400 tracking-widest font-mono pl-2">PROMPT DATA</CardTitle>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleCopyText}
                                                    className="text-stone-400 hover:text-white hover:bg-stone-800"
                                                >
                                                    {copySuccess || 'Copy'}
                                                </Button>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <pre className="bg-black/80 p-6 text-stone-300 text-xs font-mono whitespace-pre-wrap overflow-x-auto max-h-[300px] overflow-y-auto leading-relaxed">
                                                    {report.output_text}
                                                </pre>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </BentoItem>
                            )}

                            {/* Row 4: AI Strategist */}
                            <BentoItem colSpan="md:col-span-12" delay={0.5}>
                                <AiStrategist
                                    onConsult={handleAiConsultation}
                                    loading={isAiLoading}
                                />
                            </BentoItem>

                        </ResultGrid>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
