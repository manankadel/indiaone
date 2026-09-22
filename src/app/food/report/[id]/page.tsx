/* eslint-disable @next/next/no-img-element */
"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Stepper } from "@/components/ui/Stepper";
import { Camera, MapPin, Shield, Check, AlertTriangle, Upload, X, HeartPulse } from "lucide-react";
import { triagePriority, routeAuthority } from "@/lib/foodRepo";
import type { FoodCase } from "@/lib/foodTypes";

const CONCERNS: { label: string; desc: string }[] = [
  { label: "No FSSAI / expired", desc: "Licence not displayed" },
  { label: "Seal broken", desc: "Tampered pack" },
  { label: "Expired", desc: "Date over" },
  { label: "Adulteration suspect", desc: "Colour/smell off" },
  { label: "Pests", desc: "Cockroach/rat" },
  { label: "Dirty kitchen", desc: "Unhygienic" },
  { label: "Cold chain fail", desc: "No chill 4°C" },
  { label: "Gutkha sale", desc: "Prohibited" },
];

export default function FoodReportPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [c, setC] = useState<FoodCase | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
  const [uploaded, setUploaded] = useState<{ id: string; name: string; sha256: string; preview: string; dataUrl: string }[]>([]);
  const [fssai, setFssai] = useState("");
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState<{ field: string; value: string; confidence: string }[] | null>(null);
  const [cannotPhoto, setCannotPhoto] = useState(false);
  const [illnessCount, setIllnessCount] = useState("1");
  const [onset, setOnset] = useState("6h");

  useEffect(() => {
    fetch(`/api/food/cases/${encodeURIComponent(id)}`).then(r => r.ok ? r.json() : null).then(result => {
      const loaded = result?.data;
      if (loaded) { setC(loaded); setSelectedEvidence(loaded.evidenceIds); setFssai(loaded.subject.fssaiNumber ?? ""); }
    });
  }, [id]);

  if (!c) return <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-10">Loading draft… <Link href="/food" className="underline">Back</Link></div>;

  const toggleConcern = (ch: string) => {
    setSelectedConcerns(s => s.includes(ch) ? s.filter(x=>x!==ch) : s.length >= 3 ? s : [...s, ch]);
  };

  const onFilePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const buf = await file.arrayBuffer();
    const hashArray = await crypto.subtle.digest("SHA-256", buf);
    const hashHex = Array.from(new Uint8Array(hashArray)).map(b=>b.toString(16).padStart(2,"0")).join("").slice(0,16);
    const preview = URL.createObjectURL(file);
    const dataUrl = await new Promise<string>((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.onerror = reject; r.readAsDataURL(file); });
    const form = new FormData();
    form.set("caseId", c.id);
    form.set("file", file);
    const res = await fetch("/api/food/evidence", { method: "POST", body: form });
    const json = await res.json().catch(()=> ({}));
    if (!res.ok || !json.data?.id) { URL.revokeObjectURL(preview); alert(json.message ?? "File could not be saved."); return; }
    const uploadId = String(json.data.id);
    setUploaded(u => [...u, { id: uploadId, name: file.name, sha256: String(json.data.sha256 ?? hashHex), preview, dataUrl }]);
    setSelectedEvidence(s => [...s, uploadId]);
  };

  const runExtraction = async () => {
    if (selectedEvidence.length===0) return;
    setExtracting(true);
    try {
      const res = await fetch("/api/food/extract", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ evidenceIds: selectedEvidence, evidence: uploaded.filter(item => selectedEvidence.includes(item.id)).map(({ id, name, dataUrl }) => ({ id, name, dataUrl })) }) });
      const json = await res.json();
      if (json.fields) setExtracted(json.fields);
    } finally { setExtracting(false); }
  };

  const submit = async () => {
    if (!extracted && selectedEvidence.length>0) await runExtraction();
    const triage = triagePriority({ ...c, evidenceIds: selectedEvidence, subject: { ...c.subject, fssaiNumber: fssai, addressCoarse: "Pune, MH — Ward A", geoHash: "te7p01" } });
    const routing = routeAuthority({ ...c, evidenceIds: selectedEvidence, subject: { ...c.subject, fssaiNumber: fssai, addressCoarse: "Pune Ward A", geoHash: "te7p01" }, jurisdictionId: c.jurisdictionId } as any);
    const updated: FoodCase = {
      ...c,
      evidenceIds: selectedEvidence,
      subject: { ...c.subject, fssaiNumber: fssai, addressCoarse: "Pune, MH — Ward A", geoHash: "te7p01" },
      facts: (extracted ?? []).map(f => ({ id: `ext_${f.field}_${Date.now()}`, field: f.field as any, label: f.field, value: f.value, sourceEvidenceId: selectedEvidence[0] ?? "upload", sourceExcerpt: f.value.slice(0,40), confidence: f.confidence as any, status: "pending" as const })),
      priority: triage.priority as any,
      risk: { severity: triage.scores.severity, exposure: triage.scores.exposure, urgency: triage.scores.urgency, evidenceQuality: triage.scores.evidenceQuality, priority: triage.priority, reasons: triage.reasons },
      routing: { authority: routing.authority, reason: routing.reason, capability: routing.capability as any, nextAction: routing.nextAction },
      status: "routed",
      updatedAt: new Date().toISOString(),
    };
    updated.statement = `Concern: ${selectedConcerns.join(", ")} · Evidence: ${selectedEvidence.join(", ")}${c.category==="illness" ? ` · Affected: ${illnessCount} · Onset: ${onset}` : ""}`;
    const res = await fetch(`/api/food/cases/${encodeURIComponent(c.id)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ case: updated, actorId: "citizen", actorRole: "citizen" }) });
    if (!res.ok) return;
    router.push(`/food/track/${updated.publicReference}`);
  };

  const canSubmit = (cannotPhoto || selectedEvidence.length>0) && consent && selectedConcerns.length>0;

  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <Stepper steps={["Evidence","Place","Concern"]} current={0} />
      <div className="mt-4 rounded-2xl bg-zinc-900 text-white p-4 flex items-center justify-between">
        <div>
          <div className="text-xs tracking-widest text-white/60">STEP 1 OF 3 — {c.category.toUpperCase()}</div>
          <div className="text-lg font-semibold">Show us what happened</div>
        </div>
        <Shield size={20} className="text-white/80" />
      </div>
      <p className="text-sm text-zinc-600 mt-3">One photo helps, but you can skip if unsafe. We never claim lab result from photo.</p>

      <Card className="mt-4 overflow-hidden">
        <div className="bg-zinc-50 border-b border-zinc-200 px-4 py-3 flex items-center gap-2">
          <Camera size={16} className="text-zinc-700" />
          <span className="text-sm font-semibold">Your photo — optional but powerful</span>
          <span className="ml-auto text-xs rounded-full bg-white border border-zinc-200 px-2 py-1">{selectedEvidence.length} selected</span>
        </div>
        <CardContent className="p-4">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={cannotPhoto} onChange={e=>setCannotPhoto(e.target.checked)} className="h-4 w-4" /> I cannot safely photograph this <span className="text-zinc-500">— we will continue with description</span></label>

          {!cannotPhoto && (
            <>
              <div className="mt-4 grid gap-3">
                <label className="rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 hover:bg-white p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition">
                  <Upload size={20} className="text-zinc-600" />
                  <span className="text-sm font-medium">Tap to add photo</span>
                  <span className="text-xs text-zinc-500">JPG/PNG/WebP/PDF · 8 MB · EXIF stripped, faces redacted</span>
                  <input type="file" accept="image/*,application/pdf" onChange={onFilePick} className="hidden" />
                </label>
                {uploaded.map(u => (
                  <div key={u.id} className="flex gap-3 rounded-xl border border-zinc-200 bg-white p-3">
                    <img src={u.preview} alt="uploaded" className="h-12 w-12 rounded-lg object-cover border" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{u.name}</div>
                      <div className="text-xs font-mono text-zinc-500">sha256:{u.sha256} · vault pending</div>
                    </div>
                    <button onClick={()=>{ setUploaded(v=>v.filter(x=>x.id!==u.id)); setSelectedEvidence(s=>s.filter(id=>id!==u.id)); URL.revokeObjectURL(u.preview); }} className="h-8 w-8 grid place-items-center rounded-full border hover:bg-zinc-50"><X size={14} /></button>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={runExtraction} disabled={extracting || selectedEvidence.length===0}>
                  {extracting ? "Reading…" : "Read details from photo"}
                </Button>
                {extracted && <span className="text-xs text-emerald-700 py-2">Found {extracted.length} fields</span>}
              </div>
              {extracted && (
                <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  <div className="text-xs font-semibold tracking-widest text-zinc-500">REVIEW — tap to confirm</div>
                  <div className="mt-2 space-y-1">
                    {extracted.map(f => (
                      <div key={f.field} className="flex gap-2 text-xs items-center"><span className="font-mono bg-white border rounded px-2 py-1">{f.field}</span><span className="flex-1 truncate">{f.value}</span><span className={`rounded-full border px-2 py-0.5 text-xs ${f.confidence==="high"?"bg-emerald-50 border-emerald-200":"bg-amber-50 border-amber-200"}`}>{f.confidence}</span></div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {c.category==="illness" && (
            <div className="mt-4 grid sm:grid-cols-2 gap-3 p-3 rounded-xl bg-red-50 border border-red-200">
              <label className="space-y-1"><span className="text-xs font-medium flex items-center gap-1"><HeartPulse size={12} /> People affected</span>
                <select value={illnessCount} onChange={e=>setIllnessCount(e.target.value)} className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm"><option>1</option><option>2</option><option>4</option><option>10+</option></select>
              </label>
              <label className="space-y-1"><span className="text-xs font-medium">Onset after meal</span>
                <select value={onset} onChange={e=>setOnset(e.target.value)} className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm"><option>2h</option><option>6h</option><option>12h</option><option>24h</option></select>
              </label>
            </div>
          )}

          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 flex gap-2"><AlertTriangle size={14} className="shrink-0" /> Never confront a business. If photo is unsafe, skip — description is enough to route.</div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="text-xs font-semibold tracking-widest text-zinc-500">WHERE — 1 tap</div>
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            <label className="space-y-1"><span className="text-xs font-medium">FSSAI number (if visible)</span><input value={fssai} onChange={e=>setFssai(e.target.value)} placeholder="11524035001234 or Not displayed" className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm" /></label>
            <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3 flex gap-2"><MapPin size={14} className="mt-0.5" /><div className="text-xs"><div className="font-medium">GPS coarse: Pune Ward A</div><div className="text-zinc-600">We show <i>possible match</i> — you confirm. Exact home never stored.</div></div></div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="text-xs font-semibold tracking-widest text-zinc-500">WHAT — tap 1 primary + up to 2</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {CONCERNS.map(ch => {
              const on = selectedConcerns.includes(ch.label);
              return <button key={ch.label} onClick={()=> setSelectedConcerns(s=> s.includes(ch.label) ? s.filter(x=>x!==ch.label) : s.length>=3 ? s : [...s, ch.label])} className={`rounded-full border px-3 py-2 text-xs font-medium flex flex-col items-start leading-tight ${on ? "bg-zinc-900 text-white border-zinc-900" : "bg-white border-zinc-200 hover:border-zinc-300"}`}><span>{ch.label}</span><span className={`text-[10px] ${on ? "text-white/60" : "text-zinc-500"}`}>{ch.desc}</span></button>;
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4 bg-zinc-900 text-white">
        <CardContent className="p-4">
          <div className="text-xs tracking-widest text-white/60">NEXT — deterministic triage</div>
          {(() => {
            const t = triagePriority({ ...c, evidenceIds: selectedEvidence, subject: { ...c.subject, fssaiNumber: fssai, addressCoarse: "Pune Ward A", geoHash: "te7p01" } });
            return <div className="mt-2"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${t.priority==="critical"?"bg-red-600":t.priority==="high"?"bg-amber-500":"bg-white text-zinc-900"}`}>{t.priority.toUpperCase()} · {t.scores.severity}×{t.scores.exposure}×{t.scores.urgency}×{t.scores.evidenceQuality}</span><ul className="mt-2 text-xs text-white/70 list-disc pl-5 space-y-1">{t.reasons.map(r=> <li key={r}>{r}</li>)}</ul></div>;
          })()}
        </CardContent>
      </Card>

      <label className="mt-4 flex gap-3 rounded-2xl border border-zinc-200 bg-white p-4 cursor-pointer hover:border-zinc-300">
        <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} className="mt-1 h-5 w-5" />
        <span className="text-sm">I consent to share with the receiving food-safety authority. I can be anonymous but follow-up may be limited. Demo is synthetic.</span>
      </label>

      <div className="mt-6 flex gap-3">
        <Link href="/food" className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium">Back</Link>
        <Button variant="accent" size="lg" className="flex-1" disabled={!canSubmit} onClick={async () => {
          if (!extracted && selectedEvidence.length>0) { /* already handled */ }
          const triage = triagePriority({ ...c, evidenceIds: selectedEvidence, subject: { ...c.subject, fssaiNumber: fssai, addressCoarse: "Pune Ward A", geoHash: "te7p01" } });
          const routing = routeAuthority({ ...c, evidenceIds: selectedEvidence, subject: { ...c.subject, fssaiNumber: fssai, addressCoarse: "Pune Ward A", geoHash: "te7p01" }, jurisdictionId: c.jurisdictionId } as any);
          const updated: FoodCase = { ...c, evidenceIds: selectedEvidence, subject: { ...c.subject, fssaiNumber: fssai, addressCoarse: "Pune, MH — Ward A", geoHash: "te7p01" }, facts: (extracted ?? []).map(f => ({ id: `ext_${f.field}_${Date.now()}`, field: f.field as any, label: f.field, value: f.value, sourceEvidenceId: selectedEvidence[0] ?? "upload", sourceExcerpt: f.value.slice(0,40), confidence: f.confidence as any, status: "pending" as const })), priority: triage.priority as any, risk: { severity: triage.scores.severity, exposure: triage.scores.exposure, urgency: triage.scores.urgency, evidenceQuality: triage.scores.evidenceQuality, priority: triage.priority, reasons: triage.reasons }, routing: { authority: routing.authority, reason: routing.reason, capability: routing.capability as any, nextAction: routing.nextAction }, status: "routed", updatedAt: new Date().toISOString() };
          updated.statement = `Concern: ${selectedConcerns.join(", ")} · Evidence: ${selectedEvidence.join(", ")}${c.category==="illness" ? ` · Affected: ${illnessCount} · Onset: ${onset}` : ""}`;
          const res = await fetch(`/api/food/cases/${encodeURIComponent(c.id)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ case: updated, actorId: "citizen", actorRole: "citizen" }) });
          if (!res.ok) return;
          router.push(`/food/track/${updated.publicReference}`);
        }}>
          {canSubmit ? "Send report → track" : selectedConcerns.length===0 ? "Pick a concern" : cannotPhoto ? "Send without photo" : "Add photo or check cannot photo"}
        </Button>
      </div>
    </div>
  );
}
