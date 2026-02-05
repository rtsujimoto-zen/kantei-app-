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
    const senyi = data.蔵干.遷移.replace(/>/g, '').trim().split(' ').filter(Boolean);

    return (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 shadow-sm border border-slate-200/50">
            <h3 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                陰占
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
                {/* Day */}
                <div className="space-y-1">
                    <div className="text-xs text-slate-400 font-medium">日</div>
                    <div className="text-xs text-slate-400">({day.number})</div>
                    <div className="text-2xl font-bold text-slate-800">{day.kan}</div>
                    <div className="text-lg text-slate-600">{day.shi}</div>
                    <div className="text-xs text-slate-400 pt-1 border-t border-slate-200">
                        {zokanDay.join(' ')}
                    </div>
                    <div className="text-xs text-indigo-500">→ {senyi[0]}</div>
                </div>
                {/* Month */}
                <div className="space-y-1">
                    <div className="text-xs text-slate-400 font-medium">月</div>
                    <div className="text-xs text-slate-400">({month.number})</div>
                    <div className="text-2xl font-bold text-slate-800">{month.kan}</div>
                    <div className="text-lg text-slate-600">{month.shi}</div>
                    <div className="text-xs text-slate-400 pt-1 border-t border-slate-200">
                        {zokanMonth.join(' ')}
                    </div>
                    <div className="text-xs text-indigo-500">→ {senyi[1]}</div>
                </div>
                {/* Year */}
                <div className="space-y-1">
                    <div className="text-xs text-slate-400 font-medium">年</div>
                    <div className="text-xs text-slate-400">({year.number})</div>
                    <div className="text-2xl font-bold text-slate-800">{year.kan}</div>
                    <div className="text-lg text-slate-600">{year.shi}</div>
                    <div className="text-xs text-slate-400 pt-1 border-t border-slate-200">
                        {zokanYear.join(' ')}
                    </div>
                    <div className="text-xs text-indigo-500">→ {senyi[2]}</div>
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
    const StarCell = ({ star, type = 'main' }: { star: string; type?: 'main' | 'sub' }) => (
        <div className={`
            ${type === 'main'
                ? 'bg-white text-slate-700 border-slate-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }
            border rounded-lg p-2 text-center text-sm font-medium shadow-sm
        `}>
            {star}
        </div>
    );

    return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 shadow-sm border border-amber-200/50">
            <h3 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                陽占
            </h3>
            <div className="grid grid-cols-3 gap-2">
                <div></div>
                <StarCell star={data.十大主星.頭} />
                <StarCell star={data.十二大従星.初年} type="sub" />

                <StarCell star={data.十大主星.右手} />
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border border-indigo-400 rounded-lg p-2 text-center text-sm font-bold shadow-md">
                    {data.十大主星.胸}
                </div>
                <StarCell star={data.十大主星.左手} />

                <StarCell star={data.十二大従星.晩年} type="sub" />
                <StarCell star={data.十大主星.腹} />
                <StarCell star={data.十二大従星.中年} type="sub" />
            </div>
        </div>
    );
}

// =====================================
// 【位相法】Isohou Section
// =====================================
export function IsohouSection({ data, shis }: { data: string[]; shis: { 年: string; 月: string; 日: string } }) {
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

    const isSpecial = (item: string) => {
        const specials = ['半会', '会局', '支合', '冲', '害', '刑', '破', '天剋地冲'];
        return specials.some(s => item.includes(s));
    };

    return (
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-5 shadow-sm border border-rose-200/50">
            <h3 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                位相法
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white rounded-lg p-2 text-center shadow-sm border border-slate-200">
                    <div className="text-xs text-slate-400">日</div>
                    <div className="text-xl font-bold text-slate-700">{shiDay}</div>
                </div>
                <div className="bg-white rounded-lg p-2 text-center shadow-sm border border-slate-200">
                    <div className="text-xs text-slate-400">月</div>
                    <div className="text-xl font-bold text-slate-700">{shiMonth}</div>
                </div>
                <div className="bg-white rounded-lg p-2 text-center shadow-sm border border-slate-200">
                    <div className="text-xs text-slate-400">年</div>
                    <div className="text-xl font-bold text-slate-700">{shiYear}</div>
                </div>
            </div>
            <div className="space-y-2">
                {data.map((item, i) => (
                    <div
                        key={i}
                        className={`
                            text-sm px-3 py-1.5 rounded-lg
                            ${isSpecial(item)
                                ? 'bg-rose-100 text-rose-700 font-medium'
                                : 'bg-white/50 text-slate-600'}
                        `}
                    >
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
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-5 shadow-sm border border-violet-200/50">
            <h3 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                大運
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-xs text-slate-400 border-b border-slate-200">
                            <th className="py-2 px-2 text-left"></th>
                            <th className="py-2 px-2 text-right">西暦</th>
                            <th className="py-2 px-2 text-right">歳</th>
                            <th className="py-2 px-2 text-left">干支</th>
                            <th className="py-2 px-2 text-left">主星</th>
                            <th className="py-2 px-2 text-left">従星</th>
                            <th className="py-2 px-2 text-left">位相</th>
                            <th className="py-2 px-2 text-left"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.サイクル.map((row, i) => (
                            <tr
                                key={i}
                                className={`
                                    border-b border-slate-100 transition-colors
                                    ${i === currentIdx
                                        ? 'bg-violet-100/50 font-medium'
                                        : 'hover:bg-white/50'}
                                `}
                            >
                                <td className="py-2 px-2 text-violet-600 font-bold">
                                    {i === currentIdx ? '▶' : ''}
                                </td>
                                <td className="py-2 px-2 text-right text-slate-600">{row.西暦}</td>
                                <td className="py-2 px-2 text-right text-slate-500">{row.年齢}</td>
                                <td className="py-2 px-2 font-medium text-slate-700">{row.干支}</td>
                                <td className="py-2 px-2 text-slate-600">{row.十大主星}</td>
                                <td className="py-2 px-2 text-slate-500">{row.十二大従星}</td>
                                <td className="py-2 px-2">
                                    <div className="flex flex-wrap gap-1">
                                        {row.位相法.map((p, j) => (
                                            <span
                                                key={j}
                                                className={`
                                                    text-xs px-1.5 py-0.5 rounded
                                                    ${isSpecial(p)
                                                        ? 'bg-rose-100 text-rose-600'
                                                        : 'bg-slate-100 text-slate-500'}
                                                `}
                                            >
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className={`py-2 px-2 text-xs font-medium ${row.天中殺 ? 'text-rose-500' : ''}`}>
                                    {row.天中殺}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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
    const currentIdx = data.findIndex(d => d.西暦 === currentYear);
    const startIdx = Math.max(0, currentIdx - 2);
    const displayData = data.slice(startIdx, startIdx + limit);

    const isSpecial = (item: string) => {
        const specials = ['半会', '会局', '支合', '冲', '害', '刑', '破', '天剋地冲', '納音'];
        return specials.some(s => item.includes(s));
    };

    return (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 shadow-sm border border-emerald-200/50">
            <h3 className="text-base font-bold text-slate-700 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    年運
                </span>
                <span className="text-xs font-normal text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                    直近{limit}年
                </span>
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-xs text-slate-400 border-b border-slate-200">
                            <th className="py-2 px-2 text-left"></th>
                            <th className="py-2 px-2 text-right">西暦</th>
                            <th className="py-2 px-2 text-right">歳</th>
                            <th className="py-2 px-2 text-left">干支</th>
                            <th className="py-2 px-2 text-left">主星</th>
                            <th className="py-2 px-2 text-left">従星</th>
                            <th className="py-2 px-2 text-left">位相</th>
                            <th className="py-2 px-2 text-left"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayData.map((row, i) => (
                            <tr
                                key={i}
                                className={`
                                    border-b border-slate-100 transition-colors
                                    ${row.西暦 === currentYear
                                        ? 'bg-emerald-100/50 font-medium'
                                        : 'hover:bg-white/50'}
                                `}
                            >
                                <td className="py-2 px-2 text-emerald-600 font-bold">
                                    {row.西暦 === currentYear ? '▶' : ''}
                                </td>
                                <td className="py-2 px-2 text-right text-slate-600">{row.西暦}</td>
                                <td className="py-2 px-2 text-right text-slate-500">{row.年齢}</td>
                                <td className="py-2 px-2 font-medium text-slate-700">{row.干支}</td>
                                <td className="py-2 px-2 text-slate-600">{row.十大主星}</td>
                                <td className="py-2 px-2 text-slate-500">{row.十二大従星}</td>
                                <td className="py-2 px-2">
                                    <div className="flex flex-wrap gap-1">
                                        {row.位相法.map((p, j) => (
                                            <span
                                                key={j}
                                                className={`
                                                    text-xs px-1.5 py-0.5 rounded
                                                    ${isSpecial(p)
                                                        ? 'bg-rose-100 text-rose-600'
                                                        : 'bg-slate-100 text-slate-500'}
                                                `}
                                            >
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className={`py-2 px-2 text-xs font-medium ${row.天中殺 ? 'text-rose-500' : ''}`}>
                                    {row.天中殺}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// =====================================
// 【宇宙盤】Uchuban Section
// =====================================
export function UchubanSection({ data }: { data: { 干支番号: number[] } }) {
    const nums = data.干支番号;

    const getPosition = (num: number, radius: number = 38) => {
        const angle = ((num - 1) / 60) * 2 * Math.PI - Math.PI / 2;
        return {
            x: 50 + radius * Math.cos(angle),
            y: 50 + radius * Math.sin(angle)
        };
    };

    const positions = nums.map(n => getPosition(n));

    return (
        <div className="bg-gradient-to-br from-sky-50 to-cyan-50 rounded-2xl p-5 shadow-sm border border-sky-200/50">
            <h3 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                宇宙盤
            </h3>
            <div className="flex justify-center">
                <svg viewBox="0 0 100 100" className="w-36 h-36">
                    <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                    {/* Outer circle */}
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2,2" />
                    {/* Triangle lines */}
                    {positions.length >= 3 && (
                        <>
                            <line x1={positions[0].x} y1={positions[0].y} x2={positions[1].x} y2={positions[1].y}
                                stroke="url(#lineGradient)" strokeWidth="2" strokeLinecap="round" />
                            <line x1={positions[1].x} y1={positions[1].y} x2={positions[2].x} y2={positions[2].y}
                                stroke="url(#lineGradient)" strokeWidth="2" strokeLinecap="round" />
                            <line x1={positions[2].x} y1={positions[2].y} x2={positions[0].x} y2={positions[0].y}
                                stroke="url(#lineGradient)" strokeWidth="2" strokeLinecap="round" />
                        </>
                    )}
                    {/* Points */}
                    {positions.map((pos, i) => (
                        <g key={i}>
                            <circle cx={pos.x} cy={pos.y} r="5" fill="#fff" stroke="#3b82f6" strokeWidth="2" />
                            <circle cx={pos.x} cy={pos.y} r="2" fill="#3b82f6" />
                        </g>
                    ))}
                </svg>
            </div>
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
    const gogyoValues = {
        水: data['北方(親・目上/習得)'] || 0,
        木: data['中央(自分/比劫)'] || 0,
        火: data['南方(子供・目下/伝達)'] || 0,
        土: data['東方(家庭・配偶者/蓄積)'] || 0,
        金: data['西方(仕事・社会/名誉)'] || 0,
    };

    const ElementBox = ({ element, value, color }: { element: string; value: number; color: string }) => (
        <div className={`${color} rounded-lg p-2 text-center shadow-sm`}>
            <div className="text-xs text-slate-500 mb-1">{element}</div>
            <div className="text-lg font-bold text-slate-700">{value}</div>
        </div>
    );

    return (
        <div className="bg-gradient-to-br from-lime-50 to-green-50 rounded-2xl p-5 shadow-sm border border-lime-200/50">
            <h3 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-lime-500"></span>
                八門法
            </h3>
            <div className="grid grid-cols-3 gap-2">
                <div></div>
                <ElementBox element="水" value={gogyoValues.水} color="bg-blue-100" />
                <div></div>

                <ElementBox element="金" value={gogyoValues.金} color="bg-slate-100" />
                <ElementBox element="木" value={gogyoValues.木} color="bg-green-100" />
                <ElementBox element="土" value={gogyoValues.土} color="bg-amber-100" />

                <div></div>
                <ElementBox element="火" value={gogyoValues.火} color="bg-red-100" />
                <div></div>
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
    const kanColors = ['bg-green-50', 'bg-green-50', 'bg-red-50', 'bg-red-50', 'bg-amber-50',
        'bg-amber-50', 'bg-slate-50', 'bg-slate-50', 'bg-blue-50', 'bg-blue-50'];

    return (
        <div className="bg-gradient-to-br from-fuchsia-50 to-purple-50 rounded-2xl p-5 shadow-sm border border-fuchsia-200/50">
            <h3 className="text-base font-bold text-slate-700 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-fuchsia-500"></span>
                    数理法
                </span>
                <span className="text-lg font-bold text-fuchsia-600">
                    合計 {data.総エネルギー}
                </span>
            </h3>
            <div className="grid grid-cols-5 gap-2">
                {kans.map((k, i) => (
                    <div key={k} className={`${kanColors[i]} rounded-lg p-2 text-center shadow-sm`}>
                        <div className="text-xs text-slate-500 mb-1">{k}</div>
                        <div className="text-sm font-bold text-slate-700">{data.十干内訳[k] || 0}</div>
                    </div>
                ))}
            </div>
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
        <div className="space-y-6">
            {/* Top Row: 陰占, 陽占, 位相法 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <DaiunSection data={report.大運} birthYear={birthYear} />
                <NenunSection data={report.年運} />
            </div>

            {/* Bottom Row: 宇宙盤, 八門法, 数理法 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <UchubanSection data={report.宇宙盤} />
                <HachimonSection data={report.八門法} />
                <SurihouSection data={report.数理法} />
            </div>
        </div>
    );
}

export default TraditionalChart;
