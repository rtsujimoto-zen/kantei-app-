import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DaiunCardProps {
    data: any;
    className?: string;
}

export function DaiunCard({ data, className }: DaiunCardProps) {
    const getDaiunCycle = (daiun: any) => {
        if (!daiun) return [];
        if (Array.isArray(daiun)) return daiun;
        if (daiun.サイクル && Array.isArray(daiun.サイクル)) return daiun.サイクル;
        return [];
    };

    const cycle = getDaiunCycle(data);

    return (
        <Card className={cn("h-full border-none shadow-soft rounded-3xl bg-white overflow-hidden", className)}>
            <CardHeader>
                <CardTitle className="text-xl text-foreground/80 font-bold">大運 (10年ごとの運気)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-secondary/50 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="p-4 pl-6">年齢</th>
                                <th className="p-4">干支</th>
                                <th className="p-4">主星</th>
                                <th className="p-4">従星</th>
                                <th className="p-4 pr-6">特殊</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {cycle.map((row: any, i: number) => (
                                <tr key={i} className="hover:bg-orange-50/50 transition-colors">
                                    <td className="p-4 pl-6 font-bold text-orange-500">{row.年齢}歳</td>
                                    <td className="p-4 font-mono text-foreground/80">{row.干支}</td>
                                    <td className="p-4 text-foreground/90">{row.十大主星}</td>
                                    <td className="p-4 text-muted-foreground">{row.十二大従星}</td>
                                    <td className="p-4 pr-6 text-xs text-muted-foreground">
                                        {row.位相法 && row.位相法.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {row.位相法.map((item: string, j: number) => (
                                                    <span key={j} className="inline-block px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-600 font-medium">
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="opacity-20">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
