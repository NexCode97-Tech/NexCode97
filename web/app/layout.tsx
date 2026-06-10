import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
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
  icons: {
    apple: "/apple-touch-icon.png",
    icon: "/favicon.png",
  },
  manifest: "/manifest.json",
  title: "NexCode97 | Cada negocio merece su propio sistema",
  description:
    "Desarrollo de software a la medida. Apps web, móviles, sistemas de gestión y más. Sin mensualidades.",
  metadataBase: new URL("https://nexcode97.com"),
  openGraph: {
    title: "NexCode97 | Cada negocio merece su propio sistema",
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
      <head>
        <link rel="preload" href="/intro.mp4" as="video" type="video/mp4" />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <SiteHeader />
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
