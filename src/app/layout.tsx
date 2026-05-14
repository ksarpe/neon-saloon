import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/PageTransition";
import { BackButtonProvider } from "@/lib/back-button-context";
import { Providers } from "@/components/Providers";
import { BackgroundMusic } from "@/components/BackgroundMusic";
import { Zap } from "lucide-react";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "last rodeo andżeliki – Bachelorette Party Game",
  description:
    "The wildest bachelorette party card game in the West. Kahoot-style trivia, charades & dares — powered by neon lights and pure chaos.",
  keywords: [
    "bachelorette party",
    "party game",
    "card game",
    "bridal shower",
    "kahoot",
  ],
  openGraph: {
    title: "last rodeo andżeliki",
    description: "The wildest bachelorette party card game in the West.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0d0a0b",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`h-full ${bebasNeue.variable} ${inter.variable} ${playfair.variable}`}
    >
      <body className="h-full bg-saloon-dark text-text-primary antialiased noise-overlay">
        {/* Global background image */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            backgroundImage: "url(/bg/mainbg.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        {/* Global dark overlay */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[1]"
          style={{ background: "rgba(10,4,20,0.70)" }}
        />
        <Providers>
          <BackButtonProvider>
            <PageTransition>{children}</PageTransition>
          </BackButtonProvider>
          <BackgroundMusic />
        </Providers>

        {/* Global footer */}
        <footer
          className="pointer-events-none fixed bottom-0 left-0 right-0 z-[20] flex items-center justify-center gap-2 pb-3 pt-6"
          style={{
            background:
              "linear-gradient(to top, rgba(10,4,20,0.75) 0%, transparent 100%)",
          }}
        >
          <Zap size={10} style={{ color: "var(--neon-pink)" }} />
          <span
            className="text-[11px] tracking-wide pointer-events-auto"
            style={{ color: "rgba(255,220,180,0.4)" }}
          >
            Last Rodeo{" "}
            <span style={{ color: "rgba(255,220,180,0.22)" }}>v1.0 custom</span>
            {" · "}
            <a
              href="https://aknsoftware.com"
              className="hover:underline"
              style={{ color: "rgba(255,220,180,0.4)" }}
            >
              AKN Software
            </a>
          </span>
        </footer>
      </body>
    </html>
  );
}
