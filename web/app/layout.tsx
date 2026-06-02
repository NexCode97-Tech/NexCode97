import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NexCode97 — Cada negocio merece su propio sistema",
  description:
    "Desarrollo de software a la medida. Apps web, móviles, sistemas de gestión y más. Sin mensualidades.",
  metadataBase: new URL("https://nexcode97.com"),
  openGraph: {
    title: "NexCode97 — Cada negocio merece su propio sistema",
    description: "Desarrollo de software a la medida.",
    url: "https://nexcode97.com",
    siteName: "NexCode97",
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
