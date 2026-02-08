"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ============================================================
// TEIŌ Theme System — Light / Dark Monochrome
// ============================================================

export interface ThemeColors {
    bg: string;
    bgWarm: string;
    card: string;
    cardHover: string;
    border: string;
    borderLight: string;
    borderDark: string;
    text1: string;
    text2: string;
    text3: string;
    text4: string;
    accent: string;
    warmAccent: string;
    vermillion: string;
    vermillionBg: string;
    barFill: string;
    barTrack: string;
    inputBg: string;
    inputBorder: string;
    activeChip: string;
    activeChipText: string;
    shadowCard: string;
    promptBg: string;
    toggleBg: string;
    toggleKnob: string;
    toggleIcon: string;
}

export const lightTheme: ThemeColors = {
    bg: "#FAFAF8",
    bgWarm: "#F5F3EF",
    card: "#FFFFFF",
    cardHover: "#F8F7F5",
    border: "#E8E6E2",
    borderLight: "#F0EEEA",
    borderDark: "#D4D1CC",
    text1: "#1A1A1A",
    text2: "#5C5C5C",
    text3: "#999894",
    text4: "#C4C2BD",
    accent: "#1A1A1A",
    warmAccent: "#8B7355",
    vermillion: "#C4513D",
    vermillionBg: "#C4513D0A",
    barFill: "#1A1A1A",
    barTrack: "#F0EEEA",
    inputBg: "rgba(0,0,0,0.02)",
    inputBorder: "#E8E6E2",
    activeChip: "#1A1A1A",
    activeChipText: "#FFFFFF",
    shadowCard: "0 1px 3px rgba(0,0,0,0.04)",
    promptBg: "#F5F3EF",
    toggleBg: "#E8E6E2",
    toggleKnob: "#FFFFFF",
    toggleIcon: "#1A1A1A",
};

export const darkTheme: ThemeColors = {
    bg: "#050505",
    bgWarm: "#0C0C0C",
    card: "#0C0C0C",
    cardHover: "#111111",
    border: "#1A1A1A",
    borderLight: "#252525",
    borderDark: "#333333",
    text1: "#FFFFFF",
    text2: "#999999",
    text3: "#555555",
    text4: "#333333",
    accent: "#FFFFFF",
    warmAccent: "#666666",
    vermillion: "#FF3B30",
    vermillionBg: "#FF3B3008",
    barFill: "#FFFFFF",
    barTrack: "#1A1A1A",
    inputBg: "rgba(255,255,255,0.04)",
    inputBorder: "#1A1A1A",
    activeChip: "#FFFFFF",
    activeChipText: "#000000",
    shadowCard: "none",
    promptBg: "#0C0C0C",
    toggleBg: "#1A1A1A",
    toggleKnob: "#FFFFFF",
    toggleIcon: "#000000",
};

interface ThemeContextType {
    isDark: boolean;
    toggle: () => void;
    t: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType>({
    isDark: false,
    toggle: () => { },
    t: lightTheme,
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("teio-theme");
        if (saved === "dark") setIsDark(true);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem("teio-theme", isDark ? "dark" : "light");
        }
    }, [isDark, mounted]);

    const toggle = () => setIsDark((prev) => !prev);
    const t = isDark ? darkTheme : lightTheme;

    // Prevent flash of wrong theme
    if (!mounted) return null;

    return (
        <ThemeContext.Provider value={{ isDark, toggle, t }}>
            {children}
        </ThemeContext.Provider>
    );
}

// ===== Theme Toggle Component =====
export function ThemeToggle() {
    const { isDark, toggle, t } = useTheme();
    return (
        <button
            onClick={toggle}
            aria-label="テーマ切替"
            style={{
                width: 48,
                height: 26,
                borderRadius: 13,
                border: `1px solid ${t.border}`,
                background: t.toggleBg,
                position: "relative",
                cursor: "pointer",
                transition: "all 0.3s ease",
                flexShrink: 0,
                padding: 0,
            }}
        >
            <div
                style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: t.toggleKnob,
                    position: "absolute",
                    top: 2,
                    left: isDark ? 25 : 3,
                    transition: "left 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                }}
            >
                <span style={{ fontSize: 10, color: t.toggleIcon, lineHeight: 1 }}>
                    {isDark ? "●" : "○"}
                </span>
            </div>
        </button>
    );
}
