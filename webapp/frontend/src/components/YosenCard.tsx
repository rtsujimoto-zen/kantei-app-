import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface YosenCardProps {
    data: {
        十大主星: { [key: string]: string };
        十二大従星: { [key: string]: string };
        十二大従星詳細?: { [key: string]: { name: string; alias: string; full: string } };
    };
    className?: string;
}

export function YosenCard({ data, className }: YosenCardProps) {
    // Grid mapping for 3x3 layout
    // 0 1 2
    // 3 4 5
    // 6 7 8

    // Helper to render a cell
    const Cell = ({
        label,
        value,
        type,
        highlight = false
    }: {
        label: string;
        value: string | undefined;
        type: "star" | "power";
        highlight?: boolean;
    }) => (
        <div className={cn(
            "aspect-square flex flex-col items-center justify-center p-2 rounded border transition-all duration-300",
            highlight
                ? "bg-amber-900/20 border-amber-500/50 gold-glow"
                : "bg-secondary/30 border-white/5 hover:bg-secondary/50",
            value ? "opacity-100" : "opacity-0"
        )}>
            <div className={cn("text-[10px] uppercase tracking-wider mb-1", highlight ? "text-amber-400" : "text-muted-foreground")}>
                {label}
            </div>
            <div className={cn(
                "font-bold whitespace-nowrap",
                type === "star" ? "text-sm md:text-base text-foreground" : "text-xs md:text-sm text-neutral-300",
                highlight && "text-amber-100"
            )}>
                {value || "-"}
            </div>
        </div>
    );

    return (
        <Card className={cn("h-full", className)}>
            <CardHeader>
                <CardTitle>陽占 (Yo-sen)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-3">
                    {/* Top Row */}
                    <div className="aspect-square"></div> {/* Empty */}
                    <Cell label="Head (N)" value={data.十大主星.頭} type="star" />
                    <Cell label="Early Age" value={data.十二大従星詳細?.初年?.full || data.十二大従星.初年} type="power" />

                    {/* Middle Row */}
                    <Cell label="Right (W)" value={data.十大主星.右手} type="star" />
                    <Cell label="Chest (C)" value={data.十大主星.胸} type="star" highlight />
                    <Cell label="Left (E)" value={data.十大主星.左手} type="star" />

                    {/* Bottom Row */}
                    <Cell label="Late Age" value={data.十二大従星詳細?.晩年?.full || data.十二大従星.晩年} type="power" />
                    <Cell label="Belly (S)" value={data.十大主星.腹} type="star" />
                    <Cell label="Middle Age" value={data.十二大従星詳細?.中年?.full || data.十二大従星.中年} type="power" />
                </div>
            </CardContent>
        </Card>
    );
}
