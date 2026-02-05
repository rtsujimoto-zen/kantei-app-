"use client";

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
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-600 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                陰占
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
                {/* Day */}
                <div>
                    <div className="text-xs text-gray-400 mb-1">日({day.number})</div>
                    <div className="text-3xl font-light text-gray-700">{day.kan}</div>
                    <div className="text-xl text-gray-500">{day.shi}</div>
                    <div className="text-xs text-gray-400 mt-2">{zokanDay[0] || ''}</div>
                    <div className="text-xs text-gray-300">→ {senyi[0]}</div>
                </div>
                {/* Month */}
                <div>
                    <div className="text-xs text-gray-400 mb-1">月({month.number})</div>
                    <div className="text-3xl font-light text-gray-700">{month.kan}</div>
                    <div className="text-xl text-gray-500">{month.shi}</div>
                    <div className="text-xs text-gray-400 mt-2">{zokanMonth[0] || ''}</div>
                    <div className="text-xs text-gray-300">→ {senyi[1]}</div>
                </div>
                {/* Year */}
                <div>
                    <div className="text-xs text-gray-400 mb-1">年({year.number})</div>
                    <div className="text-3xl font-light text-gray-700">{year.kan}</div>
                    <div className="text-xl text-gray-500">{year.shi}</div>
                    <div className="text-xs text-gray-400 mt-2">{zokanYear[0] || ''}</div>
                    <div className="text-xs text-gray-300">→ {senyi[2]}</div>
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
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-600 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                陽占
            </h3>
            <div className="grid grid-cols-3 gap-1.5">
                <div className="bg-gray-50 rounded-lg p-2 text-center text-sm text-gray-500">
                    {data.十大主星.頭}
                </div>
                <div className="bg-amber-100 rounded-lg p-2 text-center text-sm font-medium text-amber-700 border border-amber-200">
                    {data.十二大従星.初年}
                </div>
                <div></div>

                <div className="bg-gray-50 rounded-lg p-2 text-center text-sm text-gray-500">
                    {data.十大主星.右手}
                </div>
                <div className="bg-orange-400 rounded-lg p-2 text-center text-sm font-bold text-white">
                    {data.十大主星.胸}
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center text-sm text-gray-500">
                    {data.十大主星.左手}
                </div>

                <div className="bg-gray-50 rounded-lg p-2 text-center text-sm text-gray-500">
                    {data.十大主星.腹}
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center text-sm text-gray-500">
                    {data.十二大従星.晩年}
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center text-sm text-gray-500">
                    {data.十二大従星.中年}
                </div>
            </div>
        </div>
    );
}

// =====================================
// 【位相法】Isohou Section - Triangle Diagram
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
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-600 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                位相法
            </h3>
            {/* Triangle Diagram */}
            <div className="relative w-full h-32 mb-4">
                <svg viewBox="0 0 120 100" className="w-full h-full">
                    {/* Triangle lines */}
                    <line x1="60" y1="15" x2="20" y2="85" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="60" y1="15" x2="100" y2="85" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="20" y1="85" x2="100" y2="85" stroke="#e5e7eb" strokeWidth="1" />

                    {/* Labels with background */}
                    <g>
                        <rect x="50" y="3" width="20" height="16" rx="4" fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
                        <text x="60" y="15" textAnchor="middle" className="text-xs fill-orange-600 font-medium">{shiDay}</text>
                    </g>
                    <g>
                        <rect x="5" y="77" width="30" height="16" rx="4" fill="#fef3c7" stroke="#fcd34d" strokeWidth="1" />
                        <text x="20" y="89" textAnchor="middle" className="text-xs fill-amber-600 font-medium">半会(火)</text>
                    </g>
                    <g>
                        <rect x="85" y="77" width="30" height="16" rx="4" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1" />
                        <text x="100" y="89" textAnchor="middle" className="text-xs fill-emerald-600 font-medium">害(未)</text>
                    </g>

                    {/* Branch boxes */}
                    <g>
                        <rect x="5" y="40" width="22" height="22" rx="4" fill="white" stroke="#d1d5db" strokeWidth="1" />
                        <text x="16" y="55" textAnchor="middle" className="text-sm fill-gray-700">{shiMonth}</text>
                    </g>
                    <g>
                        <rect x="93" y="40" width="22" height="22" rx="4" fill="white" stroke="#d1d5db" strokeWidth="1" />
                        <text x="104" y="55" textAnchor="middle" className="text-sm fill-gray-700">{shiYear}</text>
                    </g>
                </svg>
            </div>
            {/* Relationship tags */}
            <div className="flex flex-wrap gap-1.5">
                {data.map((item, i) => (
                    <span
                        key={i}
                        className={`text-xs px-2 py-1 rounded-full ${isSpecial(item)
                                ? 'bg-orange-100 text-orange-600'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}

// =====================================
// 【天中殺】Tenchu Section
// =====================================
interface TenchuData {
    グループ: string;
    宿命天中殺: string[];
}

export function TenchuSection({ data, ijokanshi }: { data: TenchuData; ijokanshi: string[] }) {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-orange-200 h-fit">
            <div className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-md inline-block mb-3">
                天中殺
            </div>
            <div className="text-xl font-bold text-gray-800 mb-4">
                {data.グループ}天中殺
            </div>

            <div className="space-y-3">
                <div>
                    <div className="text-xs text-orange-500 font-medium mb-1">宿命天中殺</div>
                    <div className="flex flex-wrap gap-1">
                        {data.宿命天中殺 && data.宿命天中殺.length > 0 ? (
                            data.宿命天中殺.map((item, i) => (
                                <span key={i} className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded">
                                    {item}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-400 text-sm">なし</span>
                        )}
                    </div>
                </div>

                <div>
                    <div className="text-xs text-gray-400 mb-1">異常干支</div>
                    <div className="flex flex-wrap gap-1">
                        {ijokanshi && ijokanshi.length > 0 ? (
                            ijokanshi.map((item, i) => (
                                <span key={i} className="bg-amber-50 text-amber-600 text-xs px-2 py-0.5 rounded border border-amber-200">
                                    {item}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-400 text-sm">なし</span>
                        )}
                    </div>
                </div>
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
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                    大運
                </h3>
                <span className="text-xs text-blue-500 cursor-pointer hover:underline">開始7歳順</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="text-gray-400 border-b border-gray-100">
                            <th className="py-1.5 px-1 text-left font-normal">西暦</th>
                            <th className="py-1.5 px-1 text-left font-normal">歳</th>
                            <th className="py-1.5 px-1 text-left font-normal">干支</th>
                            <th className="py-1.5 px-1 text-left font-normal">主星</th>
                            <th className="py-1.5 px-1 text-left font-normal">従星</th>
                            <th className="py-1.5 px-1 text-left font-normal">位相法</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.サイクル.slice(0, 10).map((row, i) => (
                            <tr
                                key={i}
                                className={`border-b border-gray-50 ${i === currentIdx ? 'bg-amber-50' : ''
                                    }`}
                            >
                                <td className="py-1.5 px-1 text-gray-600">
                                    {i === currentIdx && <span className="text-orange-500 mr-1">▶</span>}
                                    {row.西暦}
                                </td>
                                <td className="py-1.5 px-1 text-gray-500">{row.年齢}</td>
                                <td className="py-1.5 px-1 text-gray-700 font-medium">{row.干支}</td>
                                <td className="py-1.5 px-1 text-gray-600">{row.十大主星}</td>
                                <td className="py-1.5 px-1 text-gray-500">{row.十二大従星}</td>
                                <td className="py-1.5 px-1">
                                    <div className="flex flex-wrap gap-0.5">
                                        {row.位相法.slice(0, 3).map((p, j) => (
                                            <span
                                                key={j}
                                                className={`text-[10px] px-1 rounded ${isSpecial(p)
                                                        ? 'bg-orange-100 text-orange-600'
                                                        : 'bg-gray-100 text-gray-500'
                                                    }`}
                                            >
                                                {p}
                                            </span>
                                        ))}
                                        {row.天中殺 && (
                                            <span className="text-[10px] px-1 rounded bg-red-100 text-red-500">
                                                {row.天中殺}
                                            </span>
                                        )}
                                    </div>
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

export function NenunSection({ data, limit = 10 }: { data: NenunData[]; limit?: number }) {
    const currentYear = new Date().getFullYear();
    const currentIdx = data.findIndex(d => d.西暦 === currentYear);
    const startIdx = Math.max(0, currentIdx - 2);
    const displayData = data.slice(startIdx, startIdx + limit);

    const isSpecial = (item: string) => {
        const specials = ['半会', '会局', '支合', '冲', '害', '刑', '破', '天剋地冲', '納音'];
        return specials.some(s => item.includes(s));
    };

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                    年運
                </h3>
                <span className="text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                    直近{limit}年
                </span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="text-gray-400 border-b border-gray-100">
                            <th className="py-1.5 px-1 text-left font-normal">西暦</th>
                            <th className="py-1.5 px-1 text-left font-normal">歳</th>
                            <th className="py-1.5 px-1 text-left font-normal">干支</th>
                            <th className="py-1.5 px-1 text-left font-normal">主星</th>
                            <th className="py-1.5 px-1 text-left font-normal">従星</th>
                            <th className="py-1.5 px-1 text-left font-normal">位相法</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayData.map((row, i) => (
                            <tr
                                key={i}
                                className={`border-b border-gray-50 ${row.西暦 === currentYear ? 'bg-amber-50' : ''
                                    }`}
                            >
                                <td className="py-1.5 px-1 text-gray-600">
                                    {row.西暦 === currentYear && <span className="text-orange-500 mr-1">▶</span>}
                                    {row.西暦}
                                </td>
                                <td className="py-1.5 px-1 text-gray-500">{row.年齢}</td>
                                <td className="py-1.5 px-1 text-gray-700 font-medium">{row.干支}</td>
                                <td className="py-1.5 px-1 text-gray-600">{row.十大主星}</td>
                                <td className="py-1.5 px-1 text-gray-500">{row.十二大従星}</td>
                                <td className="py-1.5 px-1">
                                    <div className="flex flex-wrap gap-0.5">
                                        {row.位相法.slice(0, 3).map((p, j) => (
                                            <span
                                                key={j}
                                                className={`text-[10px] px-1 rounded ${isSpecial(p)
                                                        ? 'bg-orange-100 text-orange-600'
                                                        : 'bg-gray-100 text-gray-500'
                                                    }`}
                                            >
                                                {p}
                                            </span>
                                        ))}
                                        {row.天中殺 && (
                                            <span className="text-[10px] px-1 rounded bg-red-100 text-red-500">
                                                {row.天中殺}
                                            </span>
                                        )}
                                    </div>
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

    const getPosition = (num: number, radius: number = 35) => {
        const angle = ((num - 1) / 60) * 2 * Math.PI - Math.PI / 2;
        return {
            x: 50 + radius * Math.cos(angle),
            y: 50 + radius * Math.sin(angle)
        };
    };

    const positions = nums.map(n => getPosition(n));

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-600 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                宇宙盤
            </h3>
            <div className="flex justify-center">
                <svg viewBox="0 0 100 100" className="w-28 h-28">
                    {/* Outer circle */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                    {/* Triangle */}
                    {positions.length >= 3 && (
                        <polygon
                            points={`${positions[0].x},${positions[0].y} ${positions[1].x},${positions[1].y} ${positions[2].x},${positions[2].y}`}
                            fill="rgba(59, 130, 246, 0.1)"
                            stroke="#3b82f6"
                            strokeWidth="1.5"
                        />
                    )}
                    {/* Points */}
                    {positions.map((pos, i) => (
                        <circle key={i} cx={pos.x} cy={pos.y} r="3" fill="#3b82f6" />
                    ))}
                </svg>
            </div>
        </div>
    );
}

// =====================================
// 【八門法】Hachimon Section - Cross Layout
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

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-600 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                八門法
            </h3>
            <div className="grid grid-cols-3 gap-1 text-center">
                <div></div>
                <div className="bg-blue-50 rounded-lg p-2">
                    <div className="text-xs text-blue-400">水</div>
                    <div className="text-lg font-bold text-blue-600">{gogyoValues.水}</div>
                </div>
                <div></div>

                <div className="bg-gray-50 rounded-lg p-2">
                    <div className="text-xs text-gray-400">金</div>
                    <div className="text-lg font-bold text-gray-600">{gogyoValues.金}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-2">
                    <div className="text-xs text-green-400">木</div>
                    <div className="text-lg font-bold text-green-600">{gogyoValues.木}</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-2">
                    <div className="text-xs text-amber-400">土</div>
                    <div className="text-lg font-bold text-amber-600">{gogyoValues.土}</div>
                </div>

                <div></div>
                <div className="bg-red-50 rounded-lg p-2">
                    <div className="text-xs text-red-400">火</div>
                    <div className="text-lg font-bold text-red-600">{gogyoValues.火}</div>
                </div>
                <div></div>
            </div>
        </div>
    );
}

// =====================================
// 【数理法】Surihou Section - 2 Row Table
// =====================================
interface SurihouData {
    総エネルギー: number;
    十干内訳: { [key: string]: number };
}

export function SurihouSection({ data }: { data: SurihouData }) {
    const row1 = ['甲', '乙', '丙', '丁', '戊'];
    const row2 = ['己', '庚', '辛', '壬', '癸'];

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                    数理法
                </h3>
                <span className="text-sm font-bold text-orange-500">
                    合計 {data.総エネルギー}
                </span>
            </div>
            <div className="space-y-1">
                {/* Row 1 */}
                <div className="grid grid-cols-5 gap-1">
                    {row1.map(k => (
                        <div key={k} className="text-center">
                            <div className="text-xs text-gray-400">{k}</div>
                            <div className="text-lg font-bold text-gray-700 bg-gray-50 rounded py-1">
                                {data.十干内訳[k] || 0}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Row 2 */}
                <div className="grid grid-cols-5 gap-1">
                    {row2.map(k => (
                        <div key={k} className="text-center">
                            <div className="text-xs text-gray-400">{k}</div>
                            <div className="text-lg font-bold text-gray-700 bg-gray-50 rounded py-1">
                                {data.十干内訳[k] || 0}
                            </div>
                        </div>
                    ))}
                </div>
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
        天中殺?: TenchuData;
        異常干支?: string[];
    };
    birthYear: number;
}

export function TraditionalChart({ report, birthYear }: TraditionalChartProps) {
    return (
        <div className="space-y-4">
            {/* Row 1: 陰占, 陽占, 位相法 */}
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

            {/* Row 2: 天中殺, 大運, 年運 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {report.天中殺 && (
                    <div className="md:col-span-2">
                        <TenchuSection
                            data={report.天中殺}
                            ijokanshi={report.異常干支 || []}
                        />
                    </div>
                )}
                <div className={report.天中殺 ? "md:col-span-5" : "md:col-span-6"}>
                    <DaiunSection data={report.大運} birthYear={birthYear} />
                </div>
                <div className={report.天中殺 ? "md:col-span-5" : "md:col-span-6"}>
                    <NenunSection data={report.年運} />
                </div>
            </div>

            {/* Row 3: 宇宙盤, 八門法, 数理法 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <UchubanSection data={report.宇宙盤} />
                <HachimonSection data={report.八門法} />
                <SurihouSection data={report.数理法} />
            </div>
        </div>
    );
}

export default TraditionalChart;
