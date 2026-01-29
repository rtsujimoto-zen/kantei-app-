"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ResultGridProps {
    children: React.ReactNode;
    className?: string;
}

export function ResultGrid({ children, className }: ResultGridProps) {
    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-12 gap-6 w-full max-w-7xl mx-auto p-4", className)}>
            {children}
        </div>
    );
}

export function BentoItem({
    children,
    className,
    colSpan = "md:col-span-4",
    delay = 0
}: {
    children: React.ReactNode;
    className?: string;
    colSpan?: string;
    delay?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={cn(colSpan, className)}
        >
            {children}
        </motion.div>
    );
}
