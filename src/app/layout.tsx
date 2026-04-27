import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://peelcarsales.ca"),
  title: {
    default: "Peel Car Sales — Used Cars in Mississauga & Oakville",
    template: "%s · Peel Car Sales",
  },
  description:
    "Mississauga and Oakville's OMVIC + UCDA licensed used-car dealership. AutoTrader Best Priced Dealer 2024 & 2025. Bad credit, no credit, work permit, student permit financing.",
  applicationName: "Peel Car Sales",
  authors: [{ name: "Peel Car Sales" }],
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  keywords: [
    "used cars Mississauga",
    "used cars Oakville",
    "bad credit car loans Ontario",
    "Peel Car Sales",
    "OMVIC dealer",
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1b2b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable} font-sans`}>{children}</body>
    </html>
  );
}
