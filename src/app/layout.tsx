import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Shell from "@/components/shell/Shell";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mundhe Food Suraksha — Report food safety risks",
  description:
    "Report a food-safety concern with evidence and follow the steps taken by the responsible authority.",
  metadataBase: new URL("https://indiaone.vercel.app"),
  openGraph: {
    title: "Mundhe Food Suraksha — Photo se action",
    description: "Report a food-safety concern with a photo, location and a clear description of what happened.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-dvh flex flex-col bg-[#FFFBF5] text-zinc-900 selection:bg-[#FF5A1F] selection:text-white">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
