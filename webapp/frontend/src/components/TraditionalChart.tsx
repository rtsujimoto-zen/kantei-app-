"use client";
import { Card } from '@/components/ui/card';

// =====================================
// 【陰占】Insen Section
// =====================================
interface InsenData {
    年: string;
    月: string;
    日: string;
    蔵干: { 年: string; 月: string; 日: string; 遷移: string };
}

export function InsenSection({ data }: { data: InsenData }) {
    // Parse format like "(5) 戊辰" -> { number: 5, kanshi: "戊辰" }
    const parseKanshi = (str: string) => {
        const match = str.match(/\((\d+)\)\s*(.+)/);
        if (match) {
            return { number: match[1], kan: match[2][0], shi: match[2][1] };
        }
        return { number: '', kan: str[0] || '', shi: str[1] || '' };
    };

    const year = parseKanshi(data.年);
    const month = parseKanshi(data.月);
    const day = parseKanshi(data.日);

    // Parse 蔵干 "辰: 乙 癸 戊" -> ["乙", "癸", "戊"]
    const parseZokan = (str: string) => {
        const parts = str.split(':');
        if (parts.length > 1) {
            return parts[1].trim().split(' ');
        }
        return [];
    };

    const zokanYear = parseZokan(data.蔵干.年);
    const zokanMonth = parseZokan(data.蔵干.月);
    const zokanDay = parseZokan(data.蔵干.日);

    // Parse 遷移 "> 壬 > 乙 > 戊" -> ["壬", "乙", "戊"]
    const senyi = data.蔵干.遷移.replace(/>/g, '').trim().split(' ').filter(Boolean);

    return (
        <div className="font-mono text-sm">
            <h3 className="font-bold mb-2">【陰占】</h3>
            <div className="space-y-1">
                {/* Row 1: Numbers */}
                <div className="flex gap-4 text-gray-500">
                    <span className="w-12 text-right">({day.number})</span>
                    <span className="w-12 text-right">({month.number})</span>
                    <span className="w-12 text-right">({year.number})</span>
                </div>
                {/* Row 2: Kan (天干) */}
                <div className="flex gap-4">
                    <span className="w-12 text-right">{day.kan}</span>
                    <span className="w-12 text-right">{month.kan}</span>
                    <span className="w-12 text-right">{year.kan}</span>
                </div>
                {/* Row 3: Shi labels */}
                <div className="flex gap-4 text-xs text-gray-500">
                    <span className="w-12 text-right">{day.shi}{day.kan}</span>
                    <span className="w-12 text-right">{month.shi}</span>
                    <span className="w-12 text-right">{year.shi}</span>
                </div>
                {/* Row 4: Branch indicator */}
                <div className="flex gap-4 text-xs">
                    <span className="w-12 text-right">{zokanDay[0]}</span>
                    <span className="w-12 text-right">{zokanMonth[0]}</span>
                    <span className="w-12 text-right">{zokanYear[0]}</span>
                </div>
                {/* Row 5: Senyi */}
                <div className="flex gap-4 text-xs text-gray-500">
                    <span className="w-12 text-right">&gt; {senyi[0]}</span>
                    <span className="w-12 text-right">&gt; {senyi[1]}</span>
                    <span className="w-12 text-right">&gt; {senyi[2]}</span>
                </div>
            </div>
        </div>
    );
}

// =====================================
// 【陽占】Yosen Section
// =====================================
interface YosenData {
    十大主星: { 頭: string; 胸: string; 腹: string; 左手: string; 右手: string };
    十二大従星: { 初年: string; 中年: string; 晩年: string };
}

export function YosenSection({ data }: { data: YosenData }) {
    return (
        <div className="font-mono text-sm">
            <h3 className="font-bold mb-2">【陽占】</h3>
            <table className="border-collapse">
                <tbody>
                    <tr>
                        <td className="border border-gray-300 px-2 py-1"></td>
                        <td className="border border-gray-300 px-2 py-1 text-center">{data.十大主星.頭}</td>
                        <td className="border border-gray-300 px-2 py-1 text-center">{data.十二大従星.初年}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-2 py-1 text-center">{data.十大主星.右手}</td>
                        <td className="border border-gray-300 px-2 py-1 text-center">{data.十大主星.胸}</td>
                        <td className="border border-gray-300 px-2 py-1 text-center">{data.十大主星.左手}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-2 py-1 text-center">{data.十二大従星.晩年}</td>
                        <td className="border border-gray-300 px-2 py-1 text-center">{data.十大主星.腹}</td>
                        <td className="border border-gray-300 px-2 py-1 text-center">{data.十二大従星.中年}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

// =====================================
// 【位相法】Isohou Section
// =====================================
export function IsohouSection({ data, shis }: { data: string[]; shis: { 年: string; 月: string; 日: string } }) {
    // Parse shi from format "(5) 戊辰" -> "辰"
    const getShi = (str: string) => {
        const match = str.match(/\((\d+)\)\s*(.+)/);
        if (match && match[2].length >= 2) {
            return match[2][1];
        }
        return str.length >= 2 ? str[1] : '';
    };

    const shiYear = getShi(shis.年);
    const shiMonth = getShi(shis.月);
    const shiDay = getShi(shis.日);

    // Extract special relationships and mark in red
    const isSpecial = (item: string) => {
        const specials = ['半会', '会局', '支合', '冲', '害', '刑', '破', '天剋地冲'];
        return specials.some(s => item.includes(s));
    };

    return (
        <div className="font-mono text-sm">
            <h3 className="font-bold mb-2">【位相法】</h3>
            <div className="grid grid-cols-3 gap-2 mb-2 text-center">
                <span>{shiDay}</span>
                <span>{shiMonth}</span>
                <span>{shiYear}</span>
            </div>
            <div className="space-y-1">
                {data.map((item, i) => (
                    <div key={i} className={isSpecial(item) ? 'text-red-600' : ''}>
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
}

// =====================================
// 【大運】Daiun Section
// =====================================
interface DaiunCycle {
    年齢: number;
    西暦: number;
    干支: string;
    十大主星: string;
    十二大従星: string;
    位相法: string[];
    天中殺: string;
}

interface DaiunData {
    立運: number;
    方向: string;
    サイクル: DaiunCycle[];
}

export function DaiunSection({ data, birthYear }: { data: DaiunData; birthYear: number }) {
    const currentYear = new Date().getFullYear();

    // Find current daiun index
    const getCurrentDaiunIndex = () => {
        for (let i = data.サイクル.length - 1; i >= 0; i--) {
            if (currentYear >= data.サイクル[i].西暦) return i;
        }
        return 0;
    };

    const currentIdx = getCurrentDaiunIndex();

    const isSpecial = (item: string) => {
        const specials = ['半会', '会局', '支合', '冲', '害', '刑', '破', '天剋地冲'];
        return specials.some(s => item.includes(s));
    };

    return (
        <div className="font-mono text-xs">
            <h3 className="font-bold mb-2 text-sm">【大運】</h3>
            <table className="border-collapse w-full">
                <tbody>
                    {data.サイクル.map((row, i) => (
                        <tr key={i} className={i === currentIdx ? 'bg-yellow-50' : ''}>
                            <td className="px-1">{i === currentIdx ? '>' : ''}</td>
                            <td className="px-1 text-right">{row.西暦}</td>
                            <td className="px-1 text-right">{row.年齢}</td>
                            <td className="px-1">{row.干支}</td>
                            <td className="px-1">{row.十大主星}</td>
                            <td className="px-1">{row.十二大従星}</td>
                            <td className="px-1">
                                {row.位相法.map((p, j) => (
                                    <span key={j} className={isSpecial(p) ? 'text-red-600' : ''}>
                                        {p}{j < row.位相法.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </td>
                            <td className={`px-1 ${row.天中殺 ? 'text-red-600' : ''}`}>{row.天中殺}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// =====================================
// 【年運】Nenun Section  
// =====================================
interface NenunData {
    西暦: number;
    年齢: number;
    干支: string;
    十大主星: string;
    十二大従星: string;
    位相法: string[];
    天中殺: string;
}

export function NenunSection({ data, limit = 12 }: { data: NenunData[]; limit?: number }) {
    const currentYear = new Date().getFullYear();

    // Find index of current year or closest
    const currentIdx = data.findIndex(d => d.西暦 === currentYear);

    // Show years around current
    const startIdx = Math.max(0, currentIdx - 6);
    const displayData = data.slice(startIdx, startIdx + limit);

    const isSpecial = (item: string) => {
        const specials = ['半会', '会局', '支合', '冲', '害', '刑', '破', '天剋地冲', '納音'];
        return specials.some(s => item.includes(s));
    };

    return (
        <div className="font-mono text-xs">
            <div className="flex items-center gap-4 mb-2">
                <h3 className="font-bold text-sm">【年運】</h3>
                <span className="text-blue-600 underline cursor-pointer">直近{limit}年</span>
            </div>
            <table className="border-collapse w-full">
                <tbody>
                    {displayData.map((row, i) => (
                        <tr key={i} className={row.西暦 === currentYear ? 'bg-yellow-50' : ''}>
                            <td className="px-1">{row.西暦 === currentYear ? '>' : ''}</td>
                            <td className="px-1 text-right">{row.西暦}</td>
                            <td className="px-1 text-right">{row.年齢}</td>
                            <td className="px-1">{row.干支}</td>
                            <td className="px-1">{row.十大主星}</td>
                            <td className="px-1">{row.十二大従星}</td>
                            <td className="px-1">
                                {row.位相法.map((p, j) => (
                                    <span key={j} className={isSpecial(p) ? 'text-red-600' : ''}>
                                        {p}{j < row.位相法.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </td>
                            <td className={`px-1 ${row.天中殺 ? 'text-red-600' : ''}`}>{row.天中殺}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// =====================================
// 【宇宙盤】Uchuban Section
// =====================================
export function UchubanSection({ data }: { data: { 干支番号: number[] } }) {
    // Draw lines based on 干支番号
    const nums = data.干支番号;

    // Calculate positions on circle (60 positions, like clock)
    const getPosition = (num: number, radius: number = 40) => {
        const angle = ((num - 1) / 60) * 2 * Math.PI - Math.PI / 2;
        return {
            x: 50 + radius * Math.cos(angle),
            y: 50 + radius * Math.sin(angle)
        };
    };

    const positions = nums.map(n => getPosition(n));

    return (
        <div className="font-mono text-sm">
            <h3 className="font-bold mb-2">【宇宙盤】</h3>
            <svg viewBox="0 0 100 100" className="w-32 h-32">
                {/* Circle */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#000" strokeWidth="0.5" />
                {/* Lines connecting positions */}
                {positions.length >= 3 && (
                    <>
                        <line x1={positions[0].x} y1={positions[0].y} x2={positions[1].x} y2={positions[1].y} stroke="blue" strokeWidth="0.5" />
                        <line x1={positions[1].x} y1={positions[1].y} x2={positions[2].x} y2={positions[2].y} stroke="blue" strokeWidth="0.5" />
                        <line x1={positions[2].x} y1={positions[2].y} x2={positions[0].x} y2={positions[0].y} stroke="blue" strokeWidth="0.5" />
                    </>
                )}
                {/* Points */}
                {positions.map((pos, i) => (
                    <circle key={i} cx={pos.x} cy={pos.y} r="2" fill="blue" />
                ))}
            </svg>
        </div>
    );
}

// =====================================
// 【八門法】Hachimon Section
// =====================================
interface HachimonData {
    [key: string]: number;
}

export function HachimonSection({ data }: { data: HachimonData }) {
    // Map to 五行
    const gogyoValues = {
        水: data['北方(親・目上/習得)'] || 0,
        木: data['中央(自分/比劫)'] || 0,
        火: data['南方(子供・目下/伝達)'] || 0,
        土: data['東方(家庭・配偶者/蓄積)'] || 0,
        金: data['西方(仕事・社会/名誉)'] || 0,
    };

    return (
        <div className="font-mono text-sm">
            <h3 className="font-bold mb-2">【八門法】</h3>
            <div className="flex flex-col gap-1">
                <div className="text-center">水<br />{gogyoValues.水}</div>
                <div className="flex justify-between">
                    <div className="text-center">金<br />{gogyoValues.金}</div>
                    <div className="text-center">木<br />{gogyoValues.木}</div>
                    <div className="text-center">土<br />{gogyoValues.土}</div>
                </div>
                <div className="text-center">火<br />{gogyoValues.火}</div>
            </div>
        </div>
    );
}

// =====================================
// 【数理法】Surihou Section
// =====================================
interface SurihouData {
    総エネルギー: number;
    十干内訳: { [key: string]: number };
}

export function SurihouSection({ data }: { data: SurihouData }) {
    const kans = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

    return (
        <div className="font-mono text-sm">
            <h3 className="font-bold mb-2">【数理法】</h3>
            <table className="border-collapse text-xs">
                <thead>
                    <tr>
                        {kans.map(k => (
                            <th key={k} className="border border-gray-300 px-1">{k}</th>
                        ))}
                        <th className="border border-gray-300 px-1">合計</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {kans.map(k => (
                            <td key={k} className="border border-gray-300 px-1 text-center">
                                {data.十干内訳[k] || 0}
                            </td>
                        ))}
                        <td className="border border-gray-300 px-1 text-center font-bold">
                            {data.総エネルギー}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

// =====================================
// Main TraditionalChart Component
// =====================================
interface TraditionalChartProps {
    report: {
        陰占: InsenData;
        陽占: YosenData;
        位相法: string[];
        大運: DaiunData;
        年運: NenunData[];
        宇宙盤: { 干支番号: number[] };
        八門法: HachimonData;
        数理法: SurihouData;
    };
    birthYear: number;
}

export function TraditionalChart({ report, birthYear }: TraditionalChartProps) {
    return (
        <Card className="p-6 bg-white">
            {/* Top Row: 陰占, 陽占, 位相法 */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <InsenSection data={report.陰占} />
                <YosenSection data={report.陽占} />
                <IsohouSection
                    data={report.位相法}
                    shis={{
                        年: report.陰占.年,
                        月: report.陰占.月,
                        日: report.陰占.日
                    }}
                />
            </div>

            {/* Middle Row: 大運, 年運 */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                <DaiunSection data={report.大運} birthYear={birthYear} />
                <NenunSection data={report.年運} />
            </div>

            {/* Bottom Row: 宇宙盤, 八門法, 数理法 */}
            <div className="grid grid-cols-3 gap-6">
                <UchubanSection data={report.宇宙盤} />
                <HachimonSection data={report.八門法} />
                <SurihouSection data={report.数理法} />
            </div>
        </Card>
    );
}

export default TraditionalChart;
