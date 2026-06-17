import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const displayFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const jb = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Lineage · The Evolution of Machine Intelligence",
  description:
    "An interactive chronology of major advancements in artificial intelligence from 1956 to 2026. A minimal, clean branching timeline tracking the canonical lineage, active trajectories, and abandoned paths.",
  metadataBase: new URL("https://ai-lineage.example.com"),
  openGraph: {
    title: "AI Lineage · The Evolution of Machine Intelligence",
    description:
      "A minimal, clean branching timeline tracking the canonical lineage, active trajectories, and abandoned paths of AI.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${jb.variable} ${inter.variable}`}
    >
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

