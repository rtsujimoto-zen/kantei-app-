import type { Metadata } from "next";
import { Noto_Serif_JP, DM_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const notoSerifJP = Noto_Serif_JP({
  weight: ["200", "300", "400", "500", "600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-noto-serif-jp",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Teō テオ | 帝王学鑑定",
  description: "Imperial wisdom for the modern era. 帝王学による宿命鑑定。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSerifJP.variable} ${dmMono.variable} ${cormorant.variable} antialiased font-sans flex flex-col min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
