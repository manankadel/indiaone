"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { StoreProvider } from "@/lib/store";
import { I18nProvider, useI18n, SUPPORTED } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/dictionary";

function TopbarInner() {
  const [open, setOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const pathname = usePathname();
  const { locale, setLocale, t } = useI18n();
  const nav = [
    { href: "/services", label: t("nav.services") },
    { href: "/disclosures", label: t("nav.disclosures") },
    { href: "/build-log", label: t("nav.buildlog") },
  ];
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-[#FFFBF5]/80 border-b border-zinc-200">
      <div className="mx-auto max-w-[1160px] px-4 sm:px-6 h-[64px] flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-3">
          <span className="h-9 w-9 rounded-xl bg-zinc-900 text-white grid place-items-center"><Shield size={18} /></span>
          <span className="leading-none">
            <span className="block text-[16px] font-semibold tracking-tight">IndiaOne</span>
            <span className="block text-[11px] tracking-[0.14em] font-medium text-zinc-500">{t("brand.sub")}</span>
          </span>
          <span className="hidden lg:inline-flex ml-2 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">{t("brand.badge")}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {nav.map(n => (
            <Link key={n.href} href={n.href} className={`rounded-full px-3 py-2 text-sm font-medium ${pathname===n.href ? "bg-zinc-900 text-white" : "hover:bg-zinc-100 text-zinc-700"}`}>{n.label}</Link>
          ))}
          <div className="ml-2 flex items-center gap-1 rounded-full border border-zinc-200 bg-white p-1">
            <button onClick={()=>setLocale("hg")} className={`rounded-full px-3 py-1 text-xs font-semibold ${locale==="hg" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100"}`}>Hinglish</button>
            <button onClick={()=>setLocale("hi")} className={`rounded-full px-3 py-1 text-xs font-semibold ${locale==="hi" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100"}`}>हिन्दी</button>
            <button onClick={()=>setLocale("en")} className={`rounded-full px-3 py-1 text-xs font-semibold ${locale==="en" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100"}`}>English</button>
            <button onClick={()=>setShowMore(v=>!v)} className="rounded-full px-2 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-100">+5 more</button>
          </div>
          <Link href="/#start" className="ml-1 rounded-full bg-[#FF5A1F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#E8541B]">Start</Link>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <div className="flex items-center rounded-full border border-zinc-200 bg-white p-1">
            <button onClick={()=>setLocale("hg")} className={`rounded-full px-2 py-1 text-xs font-semibold ${locale==="hg" ? "bg-zinc-900 text-white" : ""}`}>HG</button>
            <button onClick={()=>setLocale("hi")} className={`rounded-full px-2 py-1 text-xs font-semibold ${locale==="hi" ? "bg-zinc-900 text-white" : ""}`}>हि</button>
            <button onClick={()=>setLocale("en")} className={`rounded-full px-2 py-1 text-xs font-semibold ${locale==="en" ? "bg-zinc-900 text-white" : ""}`}>EN</button>
          </div>
          <button aria-label="Menu" onClick={()=>setOpen(v=>!v)} className="h-9 w-9 grid place-items-center rounded-full border border-zinc-200 bg-white">{open ? <X size={16} /> : <Menu size={16} />}</button>
        </div>
      </div>
      {showMore && (
        <div className="hidden md:block border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-[1160px] px-4 sm:px-6 py-3 flex flex-wrap gap-2 items-center text-xs">
            <span className="font-semibold">Beta — AI translated · Hinglish is source:</span>
            {SUPPORTED.beta.map(l => (
              <button key={l} onClick={()=>setLocale(l)} className={`rounded-full border px-3 py-1 ${locale===l ? "bg-zinc-900 text-white border-zinc-900" : "bg-zinc-50 border-zinc-200"}`}>{l.toUpperCase()} · {l==="mr"?"मराठी":l==="bn"?"বাংলা":l==="ta"?"தமிழ்":l==="te"?"తెలుగు":"ગુજરાતી"}</button>
            ))}
            <span className="text-zinc-500">Tap any — we keep Hinglish as source for verification.</span>
            <button onClick={()=>setShowMore(false)} className="ml-auto underline">Close</button>
          </div>
        </div>
      )}
      {open && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 py-4 space-y-2">
          {nav.map(n=> <Link key={n.href} href={n.href} onClick={()=>setOpen(false)} className="block rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium">{n.label}</Link>)}
          <div className="flex flex-wrap gap-2 pt-2">
            {(["hg","hi","en","mr","bn","ta","te","gu"] as Locale[]).map(l=> (
              <button key={l} onClick={()=>{setLocale(l); setOpen(false);}} className={`rounded-full border px-3 py-1 text-xs ${locale===l?"bg-zinc-900 text-white":"bg-white"}`}>{l.toUpperCase()}</button>
            ))}
          </div>
          <Link href="/#start" onClick={()=>setOpen(false)} className="block rounded-full bg-[#FF5A1F] text-white text-center py-3 font-semibold">Start — Paise kat gaye</Link>
          <p className="text-xs text-zinc-500 pt-2">Default: Hinglish (roman) — judges + urban India same page. Hindi/English full, others AI-beta.</p>
        </div>
      )}
    </header>
  );
}

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <StoreProvider>
        <TopbarInner />
        <div className="mx-auto w-full max-w-[1160px] px-4 sm:px-6">
          <div className="py-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-zinc-200 px-3 py-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />Prototype live · All mocked</span>
            <span className="hidden sm:inline text-zinc-500">Hinglish default · 8 languages · No real data</span>
            <Link href="/disclosures" className="ml-auto text-xs font-medium underline decoration-dotted underline-offset-4">How we built it →</Link>
          </div>
        </div>
        <main className="flex-1">{children}</main>
        <footer className="mt-16 border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-[1160px] px-4 sm:px-6 py-10 grid md:grid-cols-3 gap-8 text-sm">
            <div>
              <div className="font-semibold">IndiaOne</div>
              <p className="text-zinc-600 mt-2 leading-6">One place, 10 services. Hinglish default — because India texts in Hinglish. Hindi + English full, 5 more AI-beta. No govt affiliation.</p>
            </div>
            <div>
              <div className="font-medium">Emergency (real)</div>
              <p className="mt-2 text-zinc-600">Fraud: <a href="tel:1930" className="font-semibold text-zinc-900">1930</a> · Emergency: <a href="tel:112" className="font-semibold">112</a>. We never call for you.</p>
            </div>
            <div className="text-zinc-600">
              <div>Language: Hinglish is source of truth. Others keep Hinglish side-by-side for verification.</div>
              <div className="mt-2">Mock: citizen@indiaone.demo / demo1234 · Voice is tap, text is baseline.</div>
            </div>
          </div>
        </footer>
      </StoreProvider>
    </I18nProvider>
  );
}
