import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "F My Gauge — Pattern Math for Knitters",
  description:
    "Free calculators for gauge translation, shaping schedules, stitch multiples, and more. The math co-pilot for knitters.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "F My Gauge",
  },
};

export const viewport: Viewport = {
  themeColor: "#C4613E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased min-h-screen bg-cream`}>
        <Nav />
        <main className="mx-auto max-w-2xl px-4 py-8">{children}</main>
        <div className="mx-auto max-w-2xl px-4">
          <Footer />
        </div>
      </body>
    </html>
  );
}
