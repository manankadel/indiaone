"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { StoreProvider } from "@/lib/store";

function Topbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const nav = [
    { href: "/services", label: "Services (10)" },
    { href: "/disclosures", label: "What’s real / mocked" },
    { href: "/build-log", label: "How we built it" },
  ];
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-[#FFFBF5]/80 border-b border-zinc-200">
      <div className="mx-auto max-w-[1160px] px-4 sm:px-6 h-[64px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="h-9 w-9 rounded-xl bg-zinc-900 text-white grid place-items-center"><Shield size={18} /></span>
          <span className="leading-none">
            <span className="block text-[16px] font-semibold tracking-tight">IndiaOne</span>
            <span className="block text-[11px] tracking-[0.14em] font-medium text-zinc-500">INDEPENDENT PROTOTYPE</span>
          </span>
          <span className="hidden sm:inline-flex ml-2 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">Not a government site · Demo data only</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {nav.map(n => (
            <Link key={n.href} href={n.href} className={`rounded-full px-3.5 py-2 text-sm font-medium ${pathname===n.href ? "bg-zinc-900 text-white" : "hover:bg-zinc-100 text-zinc-700"}`}>{n.label}</Link>
          ))}
          <Link href="/#start" className="ml-2 rounded-full bg-[#FF5A1F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#E8541B]">Start Fraud First Aid</Link>
        </nav>
        <button aria-label="Menu" onClick={()=>setOpen(v=>!v)} className="md:hidden h-9 w-9 grid place-items-center rounded-full border border-zinc-200 bg-white">{open ? <X size={16} /> : <Menu size={16} />}</button>
      </div>
      {open && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 py-4 space-y-2">
          {nav.map(n=> <Link key={n.href} href={n.href} onClick={()=>setOpen(false)} className="block rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium">{n.label}</Link>)}
          <Link href="/#start" onClick={()=>setOpen(false)} className="block rounded-full bg-[#FF5A1F] text-white text-center py-3 font-semibold">Start Fraud First Aid</Link>
          <p className="text-xs text-zinc-500 pt-2">Mock credentials if needed: <span className="font-mono">citizen@indiaone.demo / demo1234</span></p>
        </div>
      )}
    </header>
  );
}

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <Topbar />
      <div className="mx-auto w-full max-w-[1160px] px-4 sm:px-6">
        <div className="py-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-zinc-200 px-3 py-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />Prototype live · All integrations mocked</span>
          <span className="hidden sm:inline text-zinc-500">Codex-built · Mock bank + mock portal · No real data leaves this browser</span>
          <Link href="/disclosures" className="ml-auto text-xs font-medium underline decoration-dotted underline-offset-4">How we built it →</Link>
        </div>
      </div>
      <main className="flex-1">{children}</main>
      <footer className="mt-16 border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-[1160px] px-4 sm:px-6 py-10 grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="font-semibold">IndiaOne</div>
            <p className="text-zinc-600 mt-2 leading-6">One intent-first system for ten public services. Independent hackathon prototype for Build What Moves India. No affiliation with any government.</p>
          </div>
          <div>
            <div className="font-medium">Emergency (real)</div>
            <p className="mt-2 text-zinc-600">Financial fraud: call <a href="tel:1930" className="font-semibold text-zinc-900">1930</a>. Emergency: <a href="tel:112" className="font-semibold">112</a>. Prototype cannot contact bank/police.</p>
          </div>
          <div className="text-zinc-600">
            <div>Sources: <a className="underline" href="https://buildwhatmovesindia.com/brief">buildwhatmovesindia.com/brief</a> · <a className="underline" href="https://www.cybercrime.gov.in">cybercrime.gov.in</a> · GIGW 3.0 · WCAG 2.2</div>
            <div className="mt-2">Mock creds: citizen@indiaone.demo / demo1234 · All data synthetic.</div>
          </div>
        </div>
      </footer>
    </StoreProvider>
  );
}
