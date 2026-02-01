import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InsenCardProps {
    data: {
        年: string;
        月: string;
        日: string;
        蔵干: any;
    };
    className?: string;
}

export function InsenCard({ data, className }: InsenCardProps) {
    const getKanshi = (str: string | undefined) => {
        if (!str) return { num: '', kan: '' };
        const parts = str.split(' ');
        if (parts.length >= 2) return { num: parts[0], kan: parts[1] };
        return { num: '', kan: str };
    };

    const pillars = [
        { label: "年", value: getKanshi(data.年), active: false, color: "bg-blue-50 text-blue-500" },
        { label: "月", value: getKanshi(data.月), active: false, color: "bg-green-50 text-green-500" },
        { label: "日 (あなた)", value: getKanshi(data.日), active: true, color: "bg-orange-50 text-orange-500 border-2 border-orange-100" },
    ];

    return (
        <Card className={cn("h-full border-none shadow-soft rounded-3xl overflow-hidden bg-white", className)}>
            <CardHeader className="pb-2">
                <CardTitle className="text-xl text-foreground/80 font-bold">陰占図</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-3 text-center">
                    {pillars.map((pillar, i) => (
                        <div
                            key={i}
                            className={cn(
                                "p-4 rounded-2xl transition-all duration-300",
                                pillar.color
                            )}
                        >
                            <div className="text-xs font-bold opacity-70 mb-1">
                                {pillar.label}
                            </div>
                            <div className="text-3xl font-bold tracking-tight text-foreground/90">
                                {pillar.value.kan}
                            </div>
                            <div className="text-xs font-mono opacity-50 mt-1">
                                {pillar.value.num}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
