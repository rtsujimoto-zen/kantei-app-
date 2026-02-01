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
            "flex flex-col items-center justify-center p-1.5 rounded-xl transition-all duration-300 min-h-[80px]",
            highlight
                ? "bg-gradient-to-br from-orange-100 to-rose-100 ring-2 ring-white shadow-sm"
                : "bg-secondary/40 hover:bg-secondary/70",
            value ? "opacity-100" : "opacity-0"
        )}>
            <div className={cn("text-[10px] sm:text-xs font-bold mb-1 opacity-60", highlight ? "text-orange-900" : "text-foreground/70")}>
                {label}
            </div>
            <div className={cn(
                "font-bold text-center leading-tight break-words w-full px-1",
                type === "star" ? "text-sm sm:text-base text-foreground/90" : "text-[10px] sm:text-xs text-foreground/70",
                highlight && "text-orange-900"
            )}>
                {value || "-"}
            </div>
        </div>
    );

    return (
        <Card className={cn("h-full border-none shadow-soft rounded-3xl bg-white", className)}>
            <CardHeader className="pb-2">
                <CardTitle className="text-xl text-foreground/80 font-bold">陽占図</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-2">
                    {/* Top Row */}
                    <div className="aspect-square"></div> {/* Empty */}
                    <Cell label="頭 (北)" value={data.十大主星.頭} type="star" />
                    <Cell label="初年期" value={data.十二大従星詳細?.初年?.full || data.十二大従星.初年} type="power" />

                    {/* Middle Row */}
                    <Cell label="右手 (西)" value={data.十大主星.右手} type="star" />
                    <Cell label="胸 (中心)" value={data.十大主星.胸} type="star" highlight />
                    <Cell label="左手 (東)" value={data.十大主星.左手} type="star" />

                    {/* Bottom Row */}
                    <Cell label="晩年期" value={data.十二大従星詳細?.晩年?.full || data.十二大従星.晩年} type="power" />
                    <Cell label="腹 (南)" value={data.十大主星.腹} type="star" />
                    <Cell label="中年期" value={data.十二大従星詳細?.中年?.full || data.十二大従星.中年} type="power" />
                </div>
            </CardContent>
        </Card>
    );
}
