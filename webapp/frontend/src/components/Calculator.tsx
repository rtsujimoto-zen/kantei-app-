"use client";
import { useState, useEffect } from 'react';

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
    const [aiPersona, setAiPersona] = useState<'jiya' | 'master'>('jiya');
    const [aiDepth, setAiDepth] = useState<'professional' | 'beginner'>('professional');
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

    const handleAiConsultation = async () => {
        if (!report) return;
        setIsAiLoading(true);
        setAiResult(null);

        // Simulate API call for Mock
        setTimeout(() => {
            const personaName = aiPersona === 'jiya' ? '老執事 (Jiya)' : '厳格な師匠 (Master)';
            const depthName = aiDepth === 'professional' ? '専門的' : '初学者向け';

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
あなた様の本質は『${report.陰占 && report.陰占.日 ? getKanshi(report.陰占.日).kan : '不明'}』、すなわち...（続きが生成されます）」`;

            setAiResult(mockResponse);
            setIsAiLoading(false);
        }, 2000);
    };

    if (!mounted) return null; // Prevent hydration issues

    // Helper to safely extract Kanshi part
    const getKanshi = (str: string | undefined) => {
        if (!str) return { num: '', kan: '' };
        const parts = str.split(' ');
        if (parts.length >= 2) return { num: parts[0], kan: parts[1] };
        return { num: '', kan: str };
    };

    // Helper to get Daiun cycle array
    const getDaiunCycle = (daiun: any) => {
        if (!daiun) return [];
        if (Array.isArray(daiun)) return daiun;
        if (daiun.サイクル && Array.isArray(daiun.サイクル)) return daiun.サイクル;
        return [];
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-gray-100 p-6 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <header className="text-center space-y-2">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 tracking-wider uppercase">
                        Teiou Logic
                    </h1>
                    <p className="text-neutral-400 text-sm">Empower your destiny with imperial wisdom.</p>
                </header>

                {/* Input Form */}
                <div className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 shadow-2xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-amber-500">Date of Birth</label>
                            <input
                                type="date"
                                value={birthday}
                                onChange={(e) => setBirthday(e.target.value)}
                                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-amber-500">Gender</label>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setGender('M')}
                                    className={`flex-1 py-3 rounded-lg border transition-all ${gender === 'M' ? 'bg-amber-600 border-amber-500 text-white' : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:bg-neutral-800'}`}
                                >
                                    Male
                                </button>
                                <button
                                    onClick={() => setGender('F')}
                                    className={`flex-1 py-3 rounded-lg border transition-all ${gender === 'F' ? 'bg-amber-600 border-amber-500 text-white' : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:bg-neutral-800'}`}
                                >
                                    Female
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleCalculate}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-700 text-white font-bold py-4 rounded-lg shadow-lg hover:from-amber-400 hover:to-amber-600 transform hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Analyzing Destiny...' : 'CALCULATE DESTINY'}
                    </button>

                    {error && <p className="text-red-400 text-center">{error}</p>}
                </div>

                {/* Result Display */}
                {report && report.陰占 && report.陽占 && report.天中殺 && (
                    <div className="space-y-8 animate-fade-in-up">

                        {/* 1. In-sen (陰占) */}
                        <section className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
                            <h2 className="text-xl font-bold text-amber-500 mb-4 border-b border-neutral-700 pb-2">陰占 (In-sen)</h2>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="p-4 bg-neutral-900 rounded-lg">
                                    <div className="text-xs text-neutral-500 mb-1">Year</div>
                                    <div className="text-lg font-bold">{getKanshi(report.陰占.年).kan}</div>
                                    <div className="text-xs text-neutral-400 mt-1">{getKanshi(report.陰占.年).num}</div>
                                </div>
                                <div className="p-4 bg-neutral-900 rounded-lg">
                                    <div className="text-xs text-neutral-500 mb-1">Month</div>
                                    <div className="text-lg font-bold">{getKanshi(report.陰占.月).kan}</div>
                                    <div className="text-xs text-neutral-400 mt-1">{getKanshi(report.陰占.月).num}</div>
                                </div>
                                <div className="p-4 bg-neutral-900 rounded-lg border border-amber-900/50">
                                    <div className="text-xs text-amber-500 mb-1">Day (Self)</div>
                                    <div className="text-lg font-bold text-amber-100">{getKanshi(report.陰占.日).kan}</div>
                                    <div className="text-xs text-neutral-400 mt-1">{getKanshi(report.陰占.日).num}</div>
                                </div>
                            </div>
                        </section>

                        {/* 2. Yo-sen (陽占) */}
                        <section className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
                            <h2 className="text-xl font-bold text-amber-500 mb-4 border-b border-neutral-700 pb-2">陽占 (Yo-sen)</h2>
                            <div className="grid grid-cols-3 gap-2 max-w-md mx-auto aspect-square text-sm">
                                {/* Top Row */}
                                <div className="bg-neutral-900 p-1 flex items-center justify-center text-center rounded border border-neutral-700">
                                    {/* Empty */}
                                </div>
                                <div className="bg-neutral-900 p-1 flex items-center justify-center text-center rounded border border-neutral-700">
                                    <div>
                                        <div className="text-[10px] text-neutral-500">頭 (North)</div>
                                        <div className="font-bold text-amber-200">{report.陽占.十大主星.頭}</div>
                                    </div>
                                </div>
                                <div className="bg-neutral-900 p-1 flex items-center justify-center text-center rounded border border-neutral-700">
                                    <div>
                                        <div className="text-[10px] text-neutral-500">初年</div>
                                        <div className="font-bold">{report.陽占.十二大従星詳細?.初年?.full || report.陽占.十二大従星.初年}</div>
                                    </div>
                                </div>

                                {/* Middle Row */}
                                <div className="bg-neutral-900 p-1 flex items-center justify-center text-center rounded border border-neutral-700">
                                    <div>
                                        <div className="text-[10px] text-neutral-500">右手 (West)</div>
                                        <div className="font-bold text-amber-200">{report.陽占.十大主星.右手}</div>
                                    </div>
                                </div>
                                <div className="bg-neutral-900 p-1 flex items-center justify-center text-center rounded border border-amber-600 bg-amber-900/20">
                                    <div>
                                        <div className="text-[10px] text-amber-500">胸 (Center)</div>
                                        <div className="font-bold text-amber-100">{report.陽占.十大主星.胸}</div>
                                    </div>
                                </div>
                                <div className="bg-neutral-900 p-1 flex items-center justify-center text-center rounded border border-neutral-700">
                                    <div>
                                        <div className="text-[10px] text-neutral-500">左手 (East)</div>
                                        <div className="font-bold text-amber-200">{report.陽占.十大主星.左手}</div>
                                    </div>
                                </div>

                                {/* Bottom Row */}
                                <div className="bg-neutral-900 p-1 flex items-center justify-center text-center rounded border border-neutral-700">
                                    <div>
                                        <div className="text-[10px] text-neutral-500">晩年</div>
                                        <div className="font-bold">{report.陽占.十二大従星詳細?.晩年?.full || report.陽占.十二大従星.晩年}</div>
                                    </div>
                                </div>
                                <div className="bg-neutral-900 p-1 flex items-center justify-center text-center rounded border border-neutral-700">
                                    <div>
                                        <div className="text-[10px] text-neutral-500">腹 (South)</div>
                                        <div className="font-bold text-amber-200">{report.陽占.十大主星.腹}</div>
                                    </div>
                                </div>
                                <div className="bg-neutral-900 p-1 flex items-center justify-center text-center rounded border border-neutral-700">
                                    <div>
                                        <div className="text-[10px] text-neutral-500">中年</div>
                                        <div className="font-bold">{report.陽占.十二大従星詳細?.中年?.full || report.陽占.十二大従星.中年}</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. Tenchusatsu */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <section className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
                                <h2 className="text-xl font-bold text-amber-500 mb-4">天中殺 (Tenchusatsu)</h2>
                                <div className="text-2xl font-bold mb-2">{report.天中殺.グループ}天中殺</div>

                                {report.天中殺.タイミング && (
                                    <div className="mt-4 bg-neutral-900 p-4 rounded text-sm space-y-2">
                                        <div className="flex justify-between border-b border-neutral-800 pb-1">
                                            <span className="text-neutral-500">Time</span>
                                            <span>{report.天中殺.タイミング.time}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-neutral-800 pb-1">
                                            <span className="text-neutral-500">Month</span>
                                            <span>{report.天中殺.タイミング.month}</span>
                                        </div>
                                        <div className="pt-1">
                                            <span className="text-neutral-500 block mb-1">Years</span>
                                            <div className="flex flex-wrap gap-2">
                                                {report.天中殺.タイミング.years?.map((y: string) => (
                                                    <span key={y} className="bg-amber-900/40 px-2 py-0.5 rounded text-amber-200 text-xs">{y}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>

                            <section className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
                                <h2 className="text-xl font-bold text-amber-500 mb-4">宿命・異常 (Destiny)</h2>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-xs text-neutral-500">宿命天中殺</div>
                                        <div className="font-medium">
                                            {report.天中殺.宿命天中殺 && report.天中殺.宿命天中殺.length > 0 ? report.天中殺.宿命天中殺.join(', ') : 'なし'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-neutral-500">異常干支</div>
                                        <div className="font-medium">
                                            {report.異常干支 && report.異常干支.length > 0 ? report.異常干支.map(s => <div key={s}>{s}</div>) : 'なし'}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* 4. Daiun */}
                        {report.大運 && (
                            <section className="bg-neutral-800 p-6 rounded-xl border border-neutral-700 overflow-hidden">
                                <h2 className="text-xl font-bold text-amber-500 mb-4">大運 (10-Year Cycle)</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left whitespace-nowrap">
                                        <thead className="bg-neutral-900 text-neutral-400">
                                            <tr>
                                                <th className="p-2">Age</th>
                                                <th className="p-2">干支</th>
                                                <th className="p-2">主星</th>
                                                <th className="p-2">従星</th>
                                                <th className="p-2">位相法</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-700">
                                            {getDaiunCycle(report.大運).map((row: any, i: number) => (
                                                <tr key={i} className="hover:bg-neutral-700/50">
                                                    <td className="p-2 font-bold">{row.年齢}</td>
                                                    <td className="p-2">{row.干支}</td>
                                                    <td className="p-2">{row.十大主星}</td>
                                                    <td className="p-2">{row.十二大従星}</td>
                                                    <td className="p-2 text-xs text-neutral-400">
                                                        {row.位相法 && row.位相法.length > 0 ? row.位相法.join(', ') : '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        )}

                        {/* 5. Prompt Output */}
                        {report.output_text && (
                            <section className="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-amber-500">AI Prompt Ready Text</h2>
                                    <button
                                        onClick={handleCopyText}
                                        className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded text-sm transition-colors border border-neutral-600"
                                    >
                                        {copySuccess || 'Copy to Clipboard'}
                                    </button>
                                </div>
                                <textarea
                                    readOnly
                                    className="w-full h-20 bg-neutral-900 text-neutral-500 font-mono text-xs p-4 rounded border border-neutral-700 focus:outline-none mb-6"
                                    value={report.output_text}
                                />

                                {/* AI Strategist Section */}
                                <div className="border-t border-neutral-700 pt-6 mt-6">
                                    <h3 className="text-lg font-bold text-amber-500 mb-4 flex items-center">
                                        <span className="mr-2">🧠</span> AI軍師 (AI Strategist)
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        {/* Persona Selection */}
                                        <div className="bg-neutral-900 p-4 rounded-lg border border-neutral-700">
                                            <label className="block text-xs text-neutral-400 mb-3">軍師のタイプ (Persona)</label>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setAiPersona('jiya')}
                                                    className={`flex-1 py-2 px-3 rounded text-sm transition-all ${aiPersona === 'jiya' ? 'bg-amber-900/60 text-amber-100 border border-amber-500' : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700'}`}
                                                >
                                                    🏰 老執事 (Jiya)
                                                </button>
                                                <button
                                                    onClick={() => setAiPersona('master')}
                                                    className={`flex-1 py-2 px-3 rounded text-sm transition-all ${aiPersona === 'master' ? 'bg-amber-900/60 text-amber-100 border border-amber-500' : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700'}`}
                                                >
                                                    ⚔️ 師匠 (Master)
                                                </button>
                                            </div>
                                        </div>

                                        {/* Depth Selection */}
                                        <div className="bg-neutral-900 p-4 rounded-lg border border-neutral-700">
                                            <label className="block text-xs text-neutral-400 mb-3">解説レベル (Depth)</label>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setAiDepth('professional')}
                                                    className={`flex-1 py-2 px-3 rounded text-sm transition-all ${aiDepth === 'professional' ? 'bg-amber-900/60 text-amber-100 border border-amber-500' : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700'}`}
                                                >
                                                    📚 専門的
                                                </button>
                                                <button
                                                    onClick={() => setAiDepth('beginner')}
                                                    className={`flex-1 py-2 px-3 rounded text-sm transition-all ${aiDepth === 'beginner' ? 'bg-amber-900/60 text-amber-100 border border-amber-500' : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700'}`}
                                                >
                                                    🔰 初学者
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleAiConsultation}
                                        disabled={isAiLoading}
                                        className="w-full bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-white font-bold py-4 rounded-lg shadow-lg border border-amber-500/30 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        {isAiLoading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>思考中... (Thinking)</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>🔮</span>
                                                <span>運命を解読する (Consult AI)</span>
                                            </>
                                        )}
                                    </button>

                                    {/* AI Result Area */}
                                    {aiResult && (
                                        <div className="mt-6 bg-neutral-900/80 p-6 rounded-lg border border-amber-500/30 text-amber-100 animate-fade-in-up shadow-inner relative">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
                                            <div className="prose prose-invert prose-amber max-w-none text-sm leading-relaxed whitespace-pre-wrap font-serif">
                                                {aiResult}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
}

