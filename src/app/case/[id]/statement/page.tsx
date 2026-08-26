"use client";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useState } from "react";
import VoiceIntake from "@/components/voice/VoiceIntake";
import { useI18n } from "@/lib/i18n/context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function StatementPage() {
  const { c, setCase, setStatus } = useStore();
  const { locale, t } = useI18n();
  const router = useRouter();
  const [note, setNote] = useState("");
  if (!c) return <div className="p-10 text-sm">Loading…</div>;
  const bullets = [
    `${c.transaction?.rail} · ₹${c.transaction?.amount.toLocaleString("en-IN")} · ${c.transaction?.reference} · ${c.transaction?.institution}`,
    c.facts.find(f=>f.field==="recipient") ? `To: ${c.facts.find(f=>f.field==="recipient")?.value}` : `To: ${c.transaction?.recipient}`,
    c.facts.find(f=>f.field==="url") ? `Link: ${c.facts.find(f=>f.field==="url")?.value}` : `Evidence: ${c.evidenceIds.length} fixtures`,
  ];
  const finalStatement = `${c.statement}${note ? `\nNote: ${note}` : ""}`;
  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">STEP 5/7 · {t("statement.title")}</div>
      <h1 className="mt-2 text-[28px] font-semibold tracking-tight leading-none">Kahani ready hai</h1>
      <p className="text-sm text-zinc-600 mt-1">{t("statement.sub")} — type nahi, bas 1 tap.</p>

      <Card className="mt-4 border-emerald-200">
        <CardContent className="p-4">
          <div className="text-xs font-semibold tracking-widest text-emerald-700">AUTO TIMELINE — 3 points, tap to confirm</div>
          <ul className="mt-3 space-y-2">
            {bullets.map((b,i)=> <li key={i} className="flex gap-3 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm"><span className="h-6 w-6 grid place-items-center rounded-full bg-emerald-600 text-white text-xs">{i+1}</span>{b}</li>)}
          </ul>
          <div className="mt-3 rounded-xl bg-zinc-50 border border-zinc-200 p-3 text-sm whitespace-pre-wrap">{c.statement.slice(0, 280)}…</div>
          <div className="mt-2 text-xs text-zinc-500">Long likhna skip karo — ye 3 bullets hi kaafi. Edit chahiye toh note jodo.</div>
        </CardContent>
      </Card>

      <div className="mt-4">
        <VoiceIntake lang={locale==="hi" ? "hi-IN" : locale==="en" ? "en-IN" : "hi-IN"} onTranscript={txt => setNote(s => s + (s ? " " : "") + txt)} placeholder={t("voice.placeholder") + " — optional 1 line"} />
      </div>

      <Card className="mt-3">
        <CardContent className="p-3">
          <label className="text-xs font-medium">Optional — 1 line note (nahi toh blank chhodo)</label>
          <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Ex: Link khola tha, OTP nahi diya" className="mt-1 w-full rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-sm" maxLength={120} />
          <div className="mt-1 text-xs text-zinc-500">{note.length}/120 · Hinglish me chalega.</div>
        </CardContent>
      </Card>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-3 flex gap-2 text-xs">
        <span className="rounded-full bg-zinc-900 text-white px-2.5 py-1 text-xs">Missing?</span>
        <span>UPI ref nahi → “Not available” tap. Card → last 4 only. Link nahi → skip.</span>
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/case/demo/verify" className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium">Back</Link>
        <Button variant="accent" size="lg" className="flex-1" onClick={()=>{
          setCase({...c, statement: finalStatement, status:"review"}); setStatus("review"); router.push("/case/demo/review");
        }}>{t("statement.cta")} →</Button>
      </div>
    </div>
  );
}
