"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResultGrid, BentoItem } from './ResultGrid';
import { InsenCard } from './InsenCard';
import { YosenCard } from './YosenCard';
import { DaiunCard } from './DaiunCard';
import { AiStrategist } from './StrategistCard';

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
    const [aiResult, setAiResult] = useState<string | null>(null);


    useEffect(() => {
        setMounted(true);
    }, []);

    const handleCalculate = async () => {
        setLoading(true);
        setError('');
        setCopySuccess('');
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://kantei-app.onrender.com';
            const res = await fetch(`${apiUrl}/calculate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ birthday, gender }),
            });
            if (!res.ok) throw new Error('Failed to fetch data');
            const data = await res.json();
            console.log("API Response:", data); // Debug logging
            setReport(data);
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

    const handleAiConsultation = async (persona: 'jiya' | 'master', depth: 'professional' | 'beginner') => {
        if (!report) return;
        setIsAiLoading(true);
        setAiResult(null);

        // Simulate API call for Mock
        setTimeout(() => {
            const personaName = persona === 'jiya' ? '老執事 (Jiya)' : '厳格な師匠 (Master)';
            const depthName = depth === 'professional' ? '専門的' : '初学者向け';

            // Note: In a real implementation, we would call the backend here with persona/depth

            const mockResponse =
                `【MOCK MODE】
これはモックアップ（試作）の応答です。
本来はここで OpenAI API から生成された文章が表示されます。

---
**設定されたモード**:
・軍師: ${personaName}
・解説: ${depthName}

**想定される出力（例: 老執事モード）**:
「お待ちしておりました、王よ。
あなた様の本質は『${report.陰占?.日 ? report.陰占.日.split(' ')[1] : '不明'}』、すなわち...（続きが生成されます）」`;

            setAiResult(mockResponse);
            setIsAiLoading(false);
        }, 2000);
    };

    if (!mounted) return null; // Prevent hydration issues

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black text-gray-100 font-sans pb-20 selection:bg-amber-500/30">
            {/* Ambient Background Lights */}
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px] pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[128px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 relative z-10">

                {/* Header */}
                <header className="text-center space-y-4 py-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 tracking-tighter drop-shadow-sm">
                            TEIOU LOGIC
                        </h1>
                        <p className="text-neutral-400 text-sm md:text-base font-medium tracking-widest mt-4 uppercase">
                            Empower your destiny with imperial wisdom
                        </p>
                    </motion.div>
                </header>

                {/* Input Section - Hero Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-2xl mx-auto"
                >
                    <Card className="border-amber-500/30 shadow-2xl shadow-amber-900/10 bg-black/40 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-center text-amber-500">Analysis Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={birthday}
                                        onChange={(e) => setBirthday(e.target.value)}
                                        className="w-full bg-neutral-900/50 border border-neutral-700/50 rounded-lg p-3 text-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Gender</label>
                                    <div className="flex bg-neutral-900/50 p-1 rounded-lg border border-neutral-700/50">
                                        <button
                                            onClick={() => setGender('M')}
                                            className={`flex-1 py-2 rounded-md transition-all text-sm font-medium ${gender === 'M' ? 'bg-amber-600 text-white shadow' : 'text-neutral-400 hover:text-white'}`}
                                        >
                                            Male
                                        </button>
                                        <button
                                            onClick={() => setGender('F')}
                                            className={`flex-1 py-2 rounded-md transition-all text-sm font-medium ${gender === 'F' ? 'bg-amber-600 text-white shadow' : 'text-neutral-400 hover:text-white'}`}
                                        >
                                            Female
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleCalculate}
                                disabled={loading}
                                variant="premium"
                                className="w-full text-lg h-14 font-serif"
                            >
                                {loading ? 'Reading the Stars...' : 'REVEAL DESTINY'}
                            </Button>

                            {error && <p className="text-destructive text-center text-sm">{error}</p>}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Result Display - Bento Grid */}
                <AnimatePresence mode="wait">
                    {report && report.陰占 && report.陽占 && report.天中殺 && (
                        <ResultGrid>

                            {/* Row 1: Core Analysis (Insen & Yosen) */}
                            <BentoItem colSpan="md:col-span-12 lg:col-span-4" delay={0.1}>
                                <InsenCard data={report.陰占} />
                            </BentoItem>

                            <BentoItem colSpan="md:col-span-12 lg:col-span-4" delay={0.2}>
                                <YosenCard data={report.陽占} />
                            </BentoItem>

                            <BentoItem colSpan="md:col-span-12 lg:col-span-4" delay={0.3}>
                                <div className="grid grid-cols-1 gap-6 h-full">
                                    {/* Tenchusatsu & Destiny Info */}
                                    <Card className="h-full border-l-4 border-l-purple-500/50">
                                        <CardHeader>
                                            <CardTitle className="text-purple-400">Destiny & Void</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <div className="text-xs text-muted-foreground uppercase">Tenchusatsu Group</div>
                                                <div className="text-2xl font-bold text-foreground">{report.天中殺.グループ}天中殺</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-xs text-muted-foreground uppercase">Fate Valid</div>
                                                    <div className="font-medium text-sm text-neutral-300">
                                                        {report.天中殺.宿命天中殺 && report.天中殺.宿命天中殺.length > 0 ? report.天中殺.宿命天中殺.join(', ') : 'None'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-muted-foreground uppercase">Anomalies</div>
                                                    <div className="font-medium text-sm text-neutral-300">
                                                        {report.異常干支 && report.異常干支.length > 0 ? report.異常干支.join(', ') : 'None'}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </BentoItem>

                            {/* Row 2: Daiun (Timeline) */}
                            <BentoItem colSpan="md:col-span-12" delay={0.4}>
                                <DaiunCard data={report.大運} />
                            </BentoItem>

                            {/* Row 3: AI Strategist */}
                            <BentoItem colSpan="md:col-span-12 lg:col-span-8" delay={0.5}>
                                <AiStrategist
                                    onConsult={handleAiConsultation}
                                    loading={isAiLoading}
                                    result={aiResult}
                                />
                            </BentoItem>

                            {/* Row 3: Prompt Text (Side) */}
                            <BentoItem colSpan="md:col-span-12 lg:col-span-4" delay={0.6}>
                                <Card className="h-full bg-secondary/20">
                                    <CardHeader>
                                        <CardTitle className="text-base text-muted-foreground">Prompt Data</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="relative">
                                            <textarea
                                                readOnly
                                                className="w-full h-40 bg-black/50 text-xs font-mono text-muted-foreground p-3 rounded border border-white/5 resize-none focus:outline-none"
                                                value={report.output_text}
                                            />
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="absolute bottom-2 right-2 text-xs h-7"
                                                onClick={handleCopyText}
                                            >
                                                {copySuccess || "Copy"}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </BentoItem>

                        </ResultGrid>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

