import type { Metadata } from "next";
import { Zen_Old_Mincho, Cinzel } from "next/font/google";
import "./globals.css";

const zenOldMincho = Zen_Old_Mincho({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-zen",
  display: "swap",
});

const cinzel = Cinzel({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TEIOU LOGIC | 帝王学運命解析",
  description: "Ancient wisdom for the modern era. Decode your destiny with Sanmei-gaku.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${zenOldMincho.variable} ${cinzel.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
