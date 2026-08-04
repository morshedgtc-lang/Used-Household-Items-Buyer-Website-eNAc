import type { Metadata } from "next";
import { Outfit, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "We Buy Used Furniture",
  description: "Premium used household items buyer in Saudi Arabia",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <body className={`${outfit.variable} ${arabic.variable} antialiased`}>{children}</body>
    </html>
  );
}
