"use client";
import Link from "next/link";
import { ArrowRight, Check, Phone, ShieldAlert, Sparkles, Clock, FileText, Eye, Globe } from "lucide-react";
import { Button, Pill } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { SERVICES } from "@/lib/services";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import VoiceIntake from "@/components/voice/VoiceIntake";
import { useState } from "react";

export default function Home() {
  const { c, setStatus } = useStore();
  const { t, locale } = useI18n();
  const router = useRouter();
  const [voiceText, setVoiceText] = useState("");
  if (!c) return <div className="p-10 text-sm text-zinc-600">Loading demo case…</div>;
  return (
    <div>
      {/* HERO */}
      <section className="mx-auto max-w-[1160px] px-4 sm:px-6 pt-8 pb-6">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 items-start">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Pill tone="accent">Flagship · Fraud First Aid</Pill>
              <Pill>Under 90 sec judged journey</Pill>
              <Pill>Mobile · Slow-network · Hindi-ready</Pill>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs"><Globe size={12} /> {locale==="hi" ? "हिन्दी उपलब्ध — ऊपर से बदलें" : "Hindi available — toggle top"}</span>
            </div>
            <h1 className="text-[34px] sm:text-[48px] font-[650] tracking-[-0.03em] leading-[0.95]">{t("hero.title1")}<br />{t("hero.title2")}<br /><span className="text-[#FF5A1F]">{t("hero.accent")}</span></h1>
            <p className="mt-4 text-[17px] leading-7 text-zinc-600 max-w-[560px]">{t("hero.desc")}</p>

            <div className="mt-4 rounded-[16px] border border-zinc-200 bg-white p-3">
              <div className="text-xs font-semibold tracking-widest text-zinc-500">VOICE INTAKE · ENHANCEMENT</div>
              <VoiceIntake lang={locale==="hi" ? "hi-IN" : "en-IN"} onTranscript={setVoiceText} placeholder={locale==="hi" ? "बोलें — जैसे 'मेरे खाते से 48,500 कट गए'" : "Try: '48500 debited via UPI at 11:42'"} />
              {voiceText && <div className="mt-2 rounded-xl bg-zinc-900 text-white px-3 py-2 text-sm">Transcript: {voiceText} <span className="opacity-60">· text remains baseline, editable</span></div>}
              <div className="mt-1 text-[11px] text-zinc-500">Text is baseline — voice never required. Works in Chrome/Edge desktop & Android; fallback is typing.</div>
            </div>

            <div id="start" className="mt-4 rounded-[20px] border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="text-xs font-semibold tracking-widest text-zinc-500">{t("hero.what")}</div>
              <div className="mt-3 grid gap-3">
                <button
                  onClick={() => { setStatus("contain"); router.push("/case/demo/contain"); }}
                  className="group flex items-center justify-between rounded-2xl bg-zinc-900 text-white px-5 py-4 hover:bg-black text-left"
                >
                  <span>
                    <span className="block text-[17px] font-semibold">{t("hero.cta.primary")}</span>
                    <span className="block text-sm text-white/70">{t("hero.cta.sub")}</span>
                  </span>
                  <span className="h-10 w-10 grid place-items-center rounded-full bg-white text-zinc-900 group-hover:translate-x-0.5 transition"><ArrowRight size={18} /></span>
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={()=>router.push("/services/irctc")} className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-left hover:bg-white">
                    <div className="text-sm font-medium">Train is waitlisted</div><div className="text-xs text-zinc-500">IRCTC slice →</div>
                  </button>
                  <button onClick={()=>router.push("/services/epfo")} className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-left hover:bg-white">
                    <div className="text-sm font-medium">Changed jobs</div><div className="text-xs text-zinc-500">EPFO slice →</div>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-emerald-800 flex items-center gap-1.5"><Check size={14} /> {t("hero.demo")}</span>
                  <Link href="/login" className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 hover:bg-zinc-50">Reviewer login → citizen@indiaone.demo</Link>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl border border-zinc-200 bg-white p-3"><div className="text-xl font-semibold">90s</div><div className="text-xs text-zinc-500">to containment</div></div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-3"><div className="text-xl font-semibold">8 taps</div><div className="text-xs text-zinc-500">vs 47 before</div></div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-3"><div className="text-xl font-semibold">1 record</div><div className="text-xs text-zinc-500">across calls</div></div>
            </div>
          </div>

          {/* phone preview */}
          <Card className="overflow-hidden">
            <div className="bg-zinc-900 text-white px-4 py-3 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2"><ShieldAlert size={14} /> Fraud First Aid — 1930 first</span><span className="opacity-70">mock</span>
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex gap-3">
                <Phone size={18} className="mt-0.5 text-amber-700" />
                <div className="text-sm leading-5">
                  <div className="font-semibold text-amber-900">{locale==="hi" ? "अभी 1930 पर कॉल करें" : "If money just left — call 1930 now"}</div>
                  <div className="text-amber-800">{locale==="hi" ? "हम आपके ट्रांज़ैक्शन विवरण तैयार करेंगे। हम बैंक को कॉल नहीं करते।" : "We’ll prepare your transaction facts while you call. We never contact the bank for you."}</div>
                  <a href="tel:1930" className="mt-2 inline-flex rounded-full bg-amber-600 text-white px-3 py-1.5 text-xs font-semibold">Call 1930</a>
                </div>
              </div>
              <div className="rounded-xl border border-zinc-200 p-3">
                <div className="text-xs font-semibold tracking-widest text-zinc-500">IMMEDIATE CHECKLIST</div>
                <ul className="mt-2 space-y-2 text-sm">
                  {(locale==="hi" ? ["1930 पर कॉल (वित्तीय धोखाधड़ी)", "कार्ड पर दिए नंबर से बैंक को कॉल", "UPI/कार्ड ब्लॉक करें", "SMS/स्क्रीनशॉट न हटाएँ"] : ["Call 1930 (financial fraud helpline)", "Contact bank via verified number on card", "Block UPI / freeze card if needed", "Preserve SMS / screenshots — don’t delete"]).map(t => (
                    <li key={t} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-900" />{t}</li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3"><Clock size={14} /><div className="font-medium mt-1">Time matters</div><div className="text-zinc-600">First 30 mins = containment</div></div>
                <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3"><FileText size={14} /><div className="font-medium mt-1">One record</div><div className="text-zinc-600">Reuse across portals</div></div>
              </div>
              <Button variant="accent" size="lg" className="w-full" onClick={() => { setStatus("contain"); router.push("/case/demo/contain"); }}>Use demo incident — continue <ArrowRight size={16} /></Button>
              <div className="text-[11px] text-zinc-500 flex items-center gap-1.5"><Eye size={12} />All data synthetic. No government call made. Source-linked AI, citizen confirms. API: /api/extract (OpenAI if key, fixture fallback).</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* PROOF STRIP */}
      <section className="mx-auto max-w-[1160px] px-4 sm:px-6">
        <div className="rounded-[20px] bg-zinc-900 text-white p-5 sm:p-6 flex flex-wrap items-center gap-4">
          <Sparkles size={18} className="text-white/80" />
          <div className="text-sm">
            <span className="font-semibold">One system, ten services.</span> Flagship judged in 60 seconds; other 9 prove the workflow engine generalizes without custom architecture.
            <span className="hidden sm:inline text-white/70"> · Mock adapters only · Versioned workflows · Disclosure at every simulated action.</span>
          </div>
          <Link href="/services" className="ml-auto rounded-full bg-white text-zinc-900 px-4 py-2 text-sm font-semibold hover:bg-zinc-100">Explore all 10 →</Link>
        </div>
      </section>

      {/* 10 SERVICES GRID */}
      <section className="mx-auto max-w-[1160px] px-4 sm:px-6 pt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Ten public-service modules — one shell</h2>
          <Link href="/disclosures" className="text-sm font-medium underline">Real vs mocked →</Link>
        </div>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map(s => (
            <Link key={s.slug} href={s.slug === "fraud" ? "/#start" : `/services/${s.slug}`} className="group rounded-[20px] border border-zinc-200 bg-white p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex rounded-full border px-2.5 py-1 text-xs font-medium" style={{ borderColor: s.color, color: s.color, background: "#fff" }}>{s.badge}</span>
                <span className="text-xs text-zinc-500">{s.mockArtifact.split("·")[0]}</span>
              </div>
              <div className="mt-3 font-semibold leading-tight">{s.title}</div>
              <div className="text-sm text-zinc-600 line-clamp-2">{s.problem}</div>
              <div className="mt-3 flex gap-1.5 flex-wrap">{s.intents.slice(0, 2).map(i => <span key={i} className="text-xs rounded-full bg-zinc-100 border border-zinc-200 px-2 py-1">{i}</span>)}</div>
              <div className="mt-4 text-sm font-medium flex items-center gap-1.5">Open <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" /></div>
            </Link>
          ))}
        </div>
      </section>

      {/* JUDGING */}
      <section className="mx-auto max-w-[1160px] px-4 sm:px-6 pt-8">
        <Card>
          <CardContent className="p-5 sm:p-6 grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-xs font-semibold tracking-widest text-zinc-500">HOW JUDGES SCORE THIS</div>
              <ul className="mt-3 space-y-2 text-sm">
                <li><b>Working build:</b> 90s happy path works without help. Refresh keeps progress.</li>
                <li><b>Usability:</b> 360px, one decision per screen, plain language, keyboard + SR.</li>
                <li><b>Product + End-to-end:</b> Workflow engine, mock adapters, status ownership.</li>
              </ul>
            </div>
            <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-4">
              <div className="text-sm font-semibold">Reviewer path (seeded)</div>
              <div className="mt-2 text-sm text-zinc-600">Tap “Money left my account” → Contain → Transaction → Evidence (2 fixtures) → Verify (confirm 7 facts) → Statement → Review → Simulate submit → Tracker. AI gateway at /api/extract.</div>
              <div className="mt-3 text-xs font-mono bg-white border border-zinc-200 rounded-lg px-3 py-2">citizen@indiaone.demo / demo1234 — no OTP · /api/health</div>
            </div>
            <div className="rounded-xl bg-[#FFF1EB] border border-[#FFD9C2] p-4">
              <div className="text-sm font-semibold text-[#7C2D12]">What’s mocked</div>
              <div className="mt-2 text-sm text-[#7C2D12]/80">Bank alert, portal submission, 1930 call, police routing, payment. All marked <b>mock</b> before and after. No gov call. No real data.</div>
              <Link href="/build-log" className="mt-3 inline-flex rounded-full bg-zinc-900 text-white px-3 py-1.5 text-xs font-semibold">See Codex build log →</Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
