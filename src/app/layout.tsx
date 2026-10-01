import type { Metadata } from "next";
import { Cormorant_Garamond, Figtree } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { AppShell } from "@/components/app-shell";
import { api } from "@/lib/api";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const sans = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Blue Top Villa | Hotel & Events in Kasoa, Ghana",
    template: "%s | Blue Top Villa",
  },
  description:
    "Hotel stays and event hosting at Blue Top Villa in Kasoa, Ghana. Book a room or enquire about weddings, parties, and corporate gatherings.",
  openGraph: {
    title: "Blue Top Villa",
    description: "Hotel & events centre in Kasoa, Ghana.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Root layout errors bypass app/error.tsx, so an API outage hides contact details instead of crashing every page.
  const property = await api.property().catch(() => null);

  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-sand font-sans text-ink antialiased">
        <Providers>
          <SiteHeader property={property} />
          <AppShell property={property}>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
