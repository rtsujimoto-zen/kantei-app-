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
    // Helper to extract Kanji and Number
    const getKanshi = (str: string | undefined) => {
        if (!str) return { num: '', kan: '' };
        const parts = str.split(' ');
        if (parts.length >= 2) return { num: parts[0], kan: parts[1] };
        return { num: '', kan: str };
    };

    const pillars = [
        { label: "Year", value: getKanshi(data.年), active: false },
        { label: "Month", value: getKanshi(data.月), active: false },
        { label: "Day (Self)", value: getKanshi(data.日), active: true },
    ];

    return (
        <Card className={cn("h-full border-l-4 border-l-amber-500/50", className)}>
            <CardHeader>
                <CardTitle>陰占 (In-sen)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                    {pillars.map((pillar, i) => (
                        <div
                            key={i}
                            className={cn(
                                "p-4 rounded-lg transition-all duration-300",
                                pillar.active
                                    ? "bg-amber-900/20 border border-amber-500/30 gold-glow transform scale-105"
                                    : "bg-secondary/30 border border-transparent hover:bg-secondary/50"
                            )}
                        >
                            <div className={cn("text-xs font-serif tracking-widest mb-2", pillar.active ? "text-amber-400" : "text-muted-foreground")}>
                                {pillar.label}
                            </div>
                            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                                {pillar.value.kan}
                            </div>
                            <div className="text-xs font-mono text-muted-foreground mt-2 opacity-70">
                                {pillar.value.num}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
