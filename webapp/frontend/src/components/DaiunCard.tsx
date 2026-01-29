import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DaiunCardProps {
    data: any;
    className?: string;
}

export function DaiunCard({ data, className }: DaiunCardProps) {
    // Helper to safely get the cycle array
    const getDaiunCycle = (daiun: any) => {
        if (!daiun) return [];
        if (Array.isArray(daiun)) return daiun;
        if (daiun.サイクル && Array.isArray(daiun.サイクル)) return daiun.サイクル;
        return [];
    };

    const cycle = getDaiunCycle(data);

    return (
        <Card className={cn("h-full overflow-hidden", className)}>
            <CardHeader>
                <CardTitle>大運 (10-Year Cycle)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-secondary/50 text-muted-foreground text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4 rounded-tl-lg">Age</th>
                                <th className="p-4">Pillar</th>
                                <th className="p-4">Main Star</th>
                                <th className="p-4">Energy</th>
                                <th className="p-4 rounded-tr-lg">Special</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {cycle.map((row: any, i: number) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-bold text-amber-500">{row.年齢}</td>
                                    <td className="p-4 font-serif">{row.干支}</td>
                                    <td className="p-4">{row.十大主星}</td>
                                    <td className="p-4 text-neutral-400">{row.十二大従星}</td>
                                    <td className="p-4 text-xs text-neutral-500">
                                        {row.位相法 && row.位相法.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {row.位相法.map((item: string, j: number) => (
                                                    <span key={j} className="inline-block px-1.5 py-0.5 rounded bg-white/5 text-xs text-neutral-300 border border-white/10">
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="opacity-30">-</span>
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
