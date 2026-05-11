import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

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
  title: "Neon Saloon 🤠 – Bachelorette Party Game",
  description:
    "The wildest bachelorette party card game in the West. Kahoot-style trivia, charades & dares — powered by neon lights and pure chaos.",
  keywords: ["bachelorette party", "party game", "card game", "bridal shower", "kahoot"],
  openGraph: {
    title: "Neon Saloon 🤠",
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
        {children}
      </body>
    </html>
  );
}
