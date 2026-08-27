"use client";
import Link from "next/link";
import { ArrowRight, Check, Phone, ShieldAlert, Sparkles, Clock, FileText, Eye } from "lucide-react";
import { Button, Pill } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { SERVICES } from "@/lib/services";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import VoiceIntake from "@/components/voice/VoiceIntake";
import { useState } from "react";

export default function Home() {
  const { c, setStatus, loadSeededCase } = useStore();
  const { t, locale } = useI18n();
  const router = useRouter();
  const [voiceText, setVoiceText] = useState("");
  const [seedKey, setSeedKey] = useState<string>("upi_collect");
  if (!c) return <div className="p-10 text-sm text-zinc-600">Loading…</div>;
  return (
    <div>
      <section className="mx-auto max-w-[1160px] px-4 sm:px-6 pt-6 pb-6">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 items-start">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Pill tone="accent">FLAGSHIP · Mundhe Food Suraksha · Nationwide</Pill>
              <Pill>1 photo → 72h action</Pill>
              <Pill>Tukaram Mundhe model</Pill>
            </div>
            <div className="text-xs font-semibold tracking-[0.16em] text-zinc-500">Tukaram Mundhe — FDA 1,131 raids, ₹49.57cr seized · Nationwide now</div>
            <h1 className="mt-1 text-[34px] sm:text-[48px] font-[650] tracking-[-0.03em] leading-[0.92]">Milawat dikha?<br />Photo bhejo.<br /><span className="text-[#DC2626]">72h me action.</span></h1>
            <p className="mt-3 text-[16px] leading-6 text-zinc-700 max-w-[560px]">Mundhe style — no tolerance, time-bound, owner public. Maharashtra me 56 licences suspended, ab poore India me. 1 photo, GPS auto, FSSAI auto-check, public timeline.</p>

            <div className="mt-4 rounded-[16px] border border-zinc-200 bg-white p-3">
              <div className="text-xs font-semibold tracking-widest text-zinc-500">VOICE — Bolo, type nahi</div>
              <VoiceIntake lang={locale==="hi" ? "hi-IN" : locale==="en" ? "en-IN" : "hi-IN"} onTranscript={setVoiceText} placeholder={t("voice.placeholder")} />
              {voiceText && <div className="mt-2 rounded-xl bg-zinc-900 text-white px-3 py-2 text-sm">Suna: {voiceText} <span className="opacity-60">· edit kar sakte ho</span></div>}
              <div className="mt-1 text-[11px] text-zinc-500">Default Hinglish — short, urban, judges bhi samjhenge. Hindi/English full. 5 aur beta.</div>
            </div>

            <div className="mt-4 rounded-[16px] border border-zinc-200 bg-white p-3">
              <div className="text-xs font-semibold tracking-widest text-zinc-500">DEMO STORY — 1 tap me load</div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[
                  { key: "upi_collect", label: "UPI ₹48.5k" },
                  { key: "card_intl", label: "Card $149" },
                  { key: "wallet", label: "Wallet ₹7.5k" },
                ].map(opt => (
                  <button key={opt.key} onClick={()=>{ setSeedKey(opt.key); loadSeededCase(opt.key as "upi_collect" | "card_intl" | "wallet"); }} className={`rounded-xl border px-3 py-2 text-sm font-medium ${seedKey===opt.key ? "bg-zinc-900 text-white border-zinc-900" : "bg-white border-zinc-200 hover:bg-zinc-50"}`}>{opt.label}</button>
                ))}
              </div>
              <div className="mt-2 text-xs text-zinc-500">Sirf browser me. Koi server pe save nahi. Production me Postgres + audit.</div>
            </div>

            <div id="start" className="mt-4 rounded-[20px] border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="text-xs font-semibold tracking-widest text-zinc-500">MUNDHE FOOD — YAHAN SE START</div>
              <div className="mt-3 grid gap-3">
                <button onClick={() => router.push("/food")} className="group flex items-center justify-between rounded-2xl bg-[#DC2626] text-white px-5 py-4 hover:bg-[#B91C1C] text-left">
                  <span>
                    <span className="block text-[19px] font-semibold">Milawat dikha? Photo bhejo 📸</span>
                    <span className="block text-sm text-white/80">Doodh / Hotel / Dark store — GPS auto, FSSAI auto-check</span>
                  </span>
                  <span className="h-10 w-10 grid place-items-center rounded-full bg-white text-[#DC2626] group-hover:translate-x-0.5 transition"><ArrowRight size={18} /></span>
                </button>
                <button onClick={() => { setStatus("contain"); router.push("/case/demo/contain"); }} className="group flex items-center justify-between rounded-2xl bg-zinc-900 text-white px-5 py-3 hover:bg-black text-left">
                  <span><span className="block text-[15px] font-semibold">Paise kat gaye? — Fraud First Aid</span><span className="block text-xs text-white/60">Second slice — same engine</span></span>
                  <ArrowRight size={16} />
                </button>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-red-50 border border-red-200 px-3 py-1.5 text-red-700 flex items-center gap-1.5"><Check size={14} /> 3 food cases ready — no typing</span>
                  <Link href="/login" className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 hover:bg-zinc-50">Reviewer: citizen@indiaone.demo</Link>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl border border-zinc-200 bg-white p-3"><div className="text-xl font-semibold">3 tap</div><div className="text-xs text-zinc-500">proof ready</div></div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-3"><div className="text-xl font-semibold">0 typing</div><div className="text-xs text-zinc-500">agar demo use karo</div></div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-3"><div className="text-xl font-semibold">1 record</div><div className="text-xs text-zinc-500">sab jagah</div></div>
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="bg-[#DC2626] text-white px-4 py-3 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2"><ShieldAlert size={14} /> Mundhe Food — 1,131 raids nationwide pattern</span><span className="opacity-70">mock</span>
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 flex gap-3">
                <Phone size={18} className="mt-0.5 text-red-700" />
                <div className="text-sm leading-5">
                  <div className="font-semibold text-red-900">Hotel ganda? Doodh me paani? — Photo bhejo</div>
                  <div className="text-red-800">GPS se ward auto, FSSAI auto-check, 72h me public action. Cost owner se.</div>
                  <button onClick={()=>router.push("/food")} className="mt-2 inline-flex rounded-full bg-[#DC2626] text-white px-3 py-1.5 text-xs font-semibold">FDA Photo bhejo</button>
                </div>
              </div>
              <div className="rounded-xl border border-zinc-200 p-3">
                <div className="text-xs font-semibold tracking-widest text-zinc-500">MUNDHE STYLE — 3 cheeze public</div>
                <ul className="mt-2 space-y-2 text-sm">
                  {["Officer ka naam public (suspend hua toh dikhega)","72h SLA — time-bound, result-oriented","Cost owner se — taxpayer nahi bharega"].map(t => (
                    <li key={t} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#DC2626]" />{t}</li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3"><Clock size={14} /><div className="font-medium mt-1">1,131 raids</div><div className="text-zinc-600">₹49.57cr seized, 56 suspend</div></div>
                <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3"><FileText size={14} /><div className="font-medium mt-1">904 locations</div><div className="text-zinc-600">Blinkit/Zepto bhi</div></div>
              </div>
              <Button variant="accent" size="lg" className="w-full bg-[#DC2626] hover:bg-[#B91C1C]" onClick={() => router.push("/food")}>Food photo se start <ArrowRight size={16} /></Button>
              <div className="text-[11px] text-zinc-500 flex items-center gap-1.5"><Eye size={12} />Maharashtra FDA → Nationwide. Photo + GPS only. No address typing.</div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-[1160px] px-4 sm:px-6">
        <div className="rounded-[20px] bg-zinc-900 text-white p-5 sm:p-6 flex flex-wrap items-center gap-4">
          <Sparkles size={18} className="text-white/80" />
          <div className="text-sm"><span className="font-semibold">Ek system, 10 services.</span> Flagship 60 sec me judge, baki 9 engine ka proof — koi alag architecture nahi.</div>
          <Link href="/services" className="ml-auto rounded-full bg-white text-zinc-900 px-4 py-2 text-sm font-semibold hover:bg-zinc-100">Sab 10 dekho →</Link>
        </div>
      </section>

      <section className="mx-auto max-w-[1160px] px-4 sm:px-6 pt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold tracking-tight">10 modules — ek hi shell</h2>
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
              <div className="mt-4 text-sm font-medium flex items-center gap-1.5">Kholo <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" /></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1160px] px-4 sm:px-6 pt-8">
        <Card><CardContent className="p-5 sm:p-6 grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-xs font-semibold tracking-widest text-zinc-500">JUDGE KAISE SCORE KAREGA</div>
              <ul className="mt-3 space-y-2 text-sm"><li><b>Working:</b> 90 sec me bina help ke.</li><li><b>Usability:</b> Ek screen — ek decision. Bade button, 360px.</li><li><b>End-to-end:</b> Mock adapters + timeline ownership.</li></ul>
            </div>
            <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-4">
              <div className="text-sm font-semibold">Reviewer rasta</div>
              <div className="mt-2 text-sm text-zinc-600">Paise kat gaye → Contain → Transaction chips → 1-tap evidence → 1-tap verify → Sahi hai → Mock bhejo → Track. /api/extract.</div>
              <div className="mt-3 text-xs font-mono bg-white border border-zinc-200 rounded-lg px-3 py-2">citizen@indiaone.demo / demo1234 · /api/health</div>
            </div>
            <div className="rounded-xl bg-[#FFF1EB] border border-[#FFD9C2] p-4">
              <div className="text-sm font-semibold text-[#7C2D12]">Kya mocked hai</div>
              <div className="mt-2 text-sm text-[#7C2D12]/80">Bank alert, portal, 1930 call — sab <b>mock</b>. Koi real call nahi.</div>
              <Link href="/build-log" className="mt-3 inline-flex rounded-full bg-zinc-900 text-white px-3 py-1.5 text-xs font-semibold">Build log →</Link>
            </div>
        </CardContent></Card>
      </section>
    </div>
  );
}
