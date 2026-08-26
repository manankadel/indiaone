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
  const { locale } = useI18n();
  const router = useRouter();
  const [statement, setStatement] = useState(c?.statement ?? "");
  if (!c) return <div className="p-10 text-sm">Loading…</div>;
  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">STEP 5 OF 7 · INCIDENT TIMELINE</div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Your incident statement — editable</h1>
      <p className="text-sm text-zinc-600 mt-1">Built only from confirmed facts + your words. Every sentence is editable. Separate facts / recollection / unknowns. Voice enhances, text is baseline.</p>

      <div className="mt-4">
        <VoiceIntake lang={locale==="hi" ? "hi-IN" : "en-IN"} onTranscript={t => setStatement(s => s + (s ? " " : "") + t)} placeholder={locale==="hi" ? "बोलें — आपका विवरण यहाँ जुड़ेगा, संपादन योग्य" : "Speak — transcript appends here, remains editable"} />
      </div>

      <Card className="mt-4">
        <CardContent className="p-4">
          <textarea value={statement} onChange={e=>setStatement(e.target.value)} rows={8} className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm leading-6" />
          <div className="mt-2 text-xs text-zinc-500">Reading level: plain & concise. Non-English original kept side-by-side when translated. Candidate translation is labelled and reviewed.</div>
        </CardContent>
      </Card>

      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="text-sm font-semibold text-amber-900">Missing-evidence check</div>
        <ul className="mt-2 space-y-1.5 text-sm text-amber-900">
          <li>• If no UPI ref → add payment receipt; allow “not available”.</li>
          <li>• If card fraud → last 4 digits only, never full number.</li>
          <li>• URL scam without URL → request screenshot or link.</li>
          <li>• Delayed report → factual reason (optional in prototype).</li>
        </ul>
        <div className="mt-2 text-xs text-amber-800">AI suggests gaps; rule engine decides blockers. Never forced to invent.</div>
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/case/demo/verify" className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium">Back</Link>
        <Button variant="accent" size="lg" className="flex-1" onClick={()=>{
          setCase({...c, statement, status:"review"}); setStatus("review"); router.push("/case/demo/review");
        }}>Save statement → review</Button>
      </div>
    </div>
  );
}
