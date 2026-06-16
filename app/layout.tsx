import type { Metadata } from "next";
import { Cormorant_Garamond, JetBrains_Mono, Inter, IM_Fell_English_SC } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const cormorant = Cormorant_Garamond({
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

const fell = IM_Fell_English_SC({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mappa AI Mundi · A Cartography of Artificial Intelligence",
  description:
    "An illuminated map of artificial intelligence, 1956 to 2026. The canonical trade route shimmers in gold leaf, expeditions sail into the unknown, and abandoned approaches are marked with the warning: hic sunt dracones.",
  metadataBase: new URL("https://ai-timeline-tva.vercel.app"),
  openGraph: {
    title: "Mappa AI Mundi · A Cartography of Artificial Intelligence",
    description:
      "The canonical lineage of modern AI, drawn in the style of an illuminated medieval map.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jb.variable} ${inter.variable} ${fell.variable}`}
    >
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
