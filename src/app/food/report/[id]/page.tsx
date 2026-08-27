"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Camera, MapPin, Shield, Check, AlertTriangle } from "lucide-react";
import { loadCase, saveCase, triagePriority, routeAuthority } from "@/lib/foodRepo";
import type { FoodCase } from "@/lib/foodTypes";
import { EVIDENCE_FIXTURES } from "@/lib/fixtures";

export default function FoodReportPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [c, setC] = useState<FoodCase | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
  const [fssai, setFssai] = useState("");
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const loaded = loadCase(id);
    if (loaded) {
      setC(loaded);
      setSelectedEvidence(loaded.evidenceIds);
      setFssai(loaded.subject.fssaiNumber ?? "");
    }
  }, [id]);

  if (!c) return <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-10">Loading draft… <Link href="/food" className="underline">Back to categories</Link></div>;

  const toggleEvidence = (eid: string) => {
    setSelectedEvidence(s => s.includes(eid) ? s.filter(x=>x!==eid) : [...s, eid]);
  };

  const submit = () => {
    const triage = triagePriority({ ...c, evidenceIds: selectedEvidence, subject: { ...c.subject, fssaiNumber: fssai } });
    const routing = routeAuthority({ ...c, evidenceIds: selectedEvidence } as any);
    const updated: FoodCase = {
      ...c,
      evidenceIds: selectedEvidence,
      subject: { ...c.subject, fssaiNumber: fssai, addressCoarse: "Pune, MH — Ward A (GPS coarse)" },
      facts: [],
      priority: triage.priority as any,
      risk: { severity: triage.scores.severity, exposure: triage.scores.exposure, urgency: triage.scores.urgency, evidenceQuality: triage.scores.evidenceQuality, priority: triage.priority, reasons: triage.reasons },
      routing: { authority: routing.authority, reason: routing.reason, capability: routing.capability, nextAction: routing.nextAction },
      status: "routed",
      updatedAt: new Date().toISOString(),
    };
    saveCase(updated);
    router.push(`/food/track/${updated.publicReference}`);
  };

  const canSubmit = selectedEvidence.length > 0 && consent;

  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">FOOD REPORT — {c.category.toUpperCase()} · PRD 8.3-8.8</div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Build your evidence bundle</h1>
      <p className="text-sm text-zinc-600 mt-1">Tap chips, keep one photo. No lab claim from photo. We will show risk, owner and next event — not guilt.</p>

      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="text-xs font-semibold tracking-widest text-zinc-500">MINIMUM EVIDENCE — {c.category} (PRD 8.3)</div>
          <div className="text-xs text-zinc-500 mt-1">
            {c.category==="packaged" && "Min: one label/seal/expiry image · Helpful: batch, invoice, location"}
            {c.category==="premises" && "Min: one wide context image · Helpful: close-up, bill, licence display"}
            {c.category==="delivery" && "Min: order ID or bill + image · Helpful: temperature/time"}
            {c.category==="illness" && "Min: meal/order + onset time · Helpful: number affected, retained sample"}
          </div>
          <div className="mt-3 grid sm:grid-cols-2 gap-2">
            {EVIDENCE_FIXTURES.slice(0,6).map(fx => {
              const on = selectedEvidence.includes(fx.id);
              return (
                <button key={fx.id} onClick={()=>toggleEvidence(fx.id)} className={`text-left rounded-xl border p-3 flex gap-3 ${on ? "bg-zinc-900 text-white border-zinc-900" : "bg-white border-zinc-200"}`}>
                  <span className={`h-8 w-8 grid place-items-center rounded-lg text-xs font-semibold ${on ? "bg-white text-zinc-900" : "bg-zinc-100"}`}>{fx.preview}</span>
                  <span className="flex-1 min-w-0"><span className="block text-sm font-medium truncate">{fx.title}</span><span className={`block text-xs truncate ${on?"text-white/70":"text-zinc-500"}`}>{fx.excerpt.slice(0,56)}</span></span>
                  {on && <Check size={14} className="shrink-0" />}
                </button>
              );
            })}
          </div>
          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 flex gap-2"><AlertTriangle size={14} /> EXIF stripped, faces/PII auto-redacted before storage. “I cannot safely photograph” → continue with description (PRD 8.3).</div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="text-xs font-semibold tracking-widest text-zinc-500">IDENTIFY SUBJECT — progressive (PRD 8.4)</div>
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            <label className="space-y-1"><span className="text-xs font-medium">FSSAI licence (photo/number)</span><input value={fssai} onChange={e=>setFssai(e.target.value)} placeholder="11524035001234 or Not displayed" className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm" /></label>
            <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3 text-xs"><div className="font-medium">Map / search business</div><div className="text-zinc-600">GPS coarse: Pune Ward A · Select from map/search — we show “possible match” and require confirm.</div></div>
          </div>
          <div className="mt-2 text-xs text-zinc-500">Never infer business from blurry logo as fact.</div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="text-xs font-semibold tracking-widest text-zinc-500">CLASSIFY CONCERN — reported, not violation (PRD 8.5)</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Expired", "No FSSAI", "Seal broken", "Adulteration suspect", "Pests", "Dirty surface", "Cold chain fail", "Gutkha sale"].map(ch => (
              <span key={ch} className="rounded-full bg-white border border-zinc-300 px-3 py-1 text-xs">{ch}</span>
            ))}
          </div>
          <div className="mt-3 text-xs text-zinc-600">Tap one primary + up to two secondary. UI shows “reported concern”.</div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="text-xs font-semibold tracking-widest text-zinc-500">RISK TRIAGE — deterministic (PRD 8.6)</div>
          {(() => {
            const t = triagePriority({ ...c, evidenceIds: selectedEvidence, subject: { ...c.subject, fssaiNumber: fssai } });
            return (
              <div className="mt-2">
                <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${t.priority==="critical" ? "bg-red-600 text-white border-red-600" : t.priority==="high" ? "bg-amber-500 text-white border-amber-500" : "bg-white border-zinc-300"}`}>Priority: {t.priority.toUpperCase()} · score {t.scores.severity}×{t.scores.exposure}×{t.scores.urgency}×{t.scores.evidenceQuality}</div>
                <ul className="mt-2 text-xs text-zinc-600 list-disc pl-5 space-y-1">{t.reasons.map(r => <li key={r}>{r}</li>)}</ul>
                <div className="mt-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 p-2">High because exposure + identifiable business. Officer must verify — not guilt.</div>
              </div>
            );
          })()}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-4 flex gap-3">
          <input id="consent" type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} className="mt-1 h-5 w-5" />
          <label htmlFor="consent" className="text-sm">
            I consent to share this report with the receiving authority and to store it for triage. I understand I can submit anonymously where the channel permits but follow-up may be limited. Demo uses synthetic data.
          </label>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-3">
        <Link href="/food" className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium">Back</Link>
        <Button variant="accent" size="lg" className="flex-1" disabled={!canSubmit} onClick={submit}>
          {canSubmit ? "Submit — mock route → track" : selectedEvidence.length===0 ? "Pick at least 1 evidence" : "Give consent to continue"}
        </Button>
      </div>
    </div>
  );
}
