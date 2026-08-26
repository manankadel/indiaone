import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Shell from "@/components/shell/Shell";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IndiaOne — Tell us what happened. We find the right service.",
  description:
    "Independent prototype for Build What Moves India. One intent-first system for 10 public services. Fraud First Aid flagship: contain loss, structure evidence, simulate reporting. All data synthetic. No government affiliation.",
  metadataBase: new URL("https://indiaone.vercel.app"),
  openGraph: {
    title: "IndiaOne — Fraud First Aid",
    description: "Independent prototype. One system, ten services. Tell us what happened.",
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
