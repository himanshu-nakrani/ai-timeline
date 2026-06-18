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
  title: "AI Lineage · What just shipped, and how we got here",
  description:
    "Two views of AI: Pulse — a buzz-sorted feed of recent model, agent, and policy launches; Lineage — the seventy-year historical timeline that explains how we got here. Built for the chronically online.",
  metadataBase: new URL("https://ai-lineage.example.com"),
  openGraph: {
    title: "AI Lineage · What just shipped, and how we got here",
    description:
      "Pulse: this week's launches, filtered by family and lab. Lineage: 1956→present as a branching timeline.",
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

