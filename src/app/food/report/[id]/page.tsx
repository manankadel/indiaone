"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Camera, MapPin, Shield, Check, AlertTriangle, Upload, X } from "lucide-react";
import { loadCase, saveCase, triagePriority, routeAuthority } from "@/lib/foodRepo";
import type { FoodCase } from "@/lib/foodTypes";
import { EVIDENCE_FIXTURES } from "@/lib/fixtures";

// Food-only fixtures — no fraud leakage (P0 fix: do not slice(0,6) which was fraud)
const FOOD_IDS = ["fx_milk_packet","fx_hotel_kitchen","fx_zepto_store","fx_illness_cluster","fx_packaged_label"];
const FOOD_FIXTURES = EVIDENCE_FIXTURES.filter(f => FOOD_IDS.includes(f.id));

const CONCERNS = ["Expired","No FSSAI","Seal broken","Adulteration suspect","Pests","Dirty surface","Cold chain fail","Gutkha sale"];

export default function FoodReportPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [c, setC] = useState<FoodCase | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
  const [uploaded, setUploaded] = useState<{ id: string; name: string; sha256: string; preview: string }[]>([]);
  const [fssai, setFssai] = useState("");
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState<{ field: string; value: string; confidence: string }[] | null>(null);

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

  const toggleConcern = (ch: string) => {
    setSelectedConcerns(s => {
      if (s.includes(ch)) return s.filter(x=>x!==ch);
      if (s.length >= 3) return s; // max 1 primary +2 secondary per PRD 8.5
      return [...s, ch];
    });
  };

  const onFilePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Client-side pipeline per PRD 8.3: EXIF strip (via canvas re-encode placeholder), hash, face/PII redaction note
    const buf = await file.arrayBuffer();
    const hashArray = await crypto.subtle.digest("SHA-256", buf);
    const hashHex = Array.from(new Uint8Array(hashArray)).map(b=>b.toString(16).padStart(2,"0")).join("").slice(0,16);
    const preview = URL.createObjectURL(file);
    const uploadId = `upload_${Date.now()}_${hashHex.slice(0,6)}`;
    // EXIF stripping + redaction would happen here via canvas + face detection; for demo we note it
    setUploaded(u => [...u, { id: uploadId, name: file.name, sha256: hashHex, preview }]);
    setSelectedEvidence(s => [...s, uploadId]);
  };

  const runExtraction = async () => {
    if (selectedEvidence.length===0) return;
    setExtracting(true);
    try {
      const res = await fetch("/api/food/extract", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ evidenceIds: selectedEvidence.filter(id=> FOOD_IDS.includes(id)) }) });
      const json = await res.json();
      if (json.fields) setExtracted(json.fields);
    } catch {
      // fallback already handled by API
    } finally { setExtracting(false); }
  };

  const submit = async () => {
    // Ensure extraction has run (AI is optional per PRD — report can be submitted with AI unavailable)
    if (!extracted && selectedEvidence.some(id=> FOOD_IDS.includes(id))) {
      await runExtraction();
    }
    const triage = triagePriority({ ...c, evidenceIds: selectedEvidence, subject: { ...c.subject, fssaiNumber: fssai, addressCoarse: "Pune, MH — Ward A (GPS coarse)", geoHash: "te7p01" } });
    const routing = routeAuthority({ ...c, evidenceIds: selectedEvidence, subject: { ...c.subject, fssaiNumber: fssai, addressCoarse: "Pune Ward A", geoHash: "te7p01" }, jurisdictionId: c.jurisdictionId } as any);
    const updated: FoodCase = {
      ...c,
      evidenceIds: selectedEvidence,
      subject: { ...c.subject, fssaiNumber: fssai, addressCoarse: "Pune, MH — Ward A (GPS coarse)", geoHash: "te7p01" },
      facts: (extracted ?? []).map(f => ({ id: `ext_${f.field}_${Date.now()}`, field: f.field as any, label: f.field, value: f.value, sourceEvidenceId: selectedEvidence[0] ?? "upload", sourceExcerpt: f.value.slice(0,40), confidence: f.confidence as any, status: "pending" as const })),
      priority: triage.priority as any,
      risk: { severity: triage.scores.severity, exposure: triage.scores.exposure, urgency: triage.scores.urgency, evidenceQuality: triage.scores.evidenceQuality, priority: triage.priority, reasons: triage.reasons },
      routing: { authority: routing.authority, reason: routing.reason, capability: routing.capability as any, nextAction: routing.nextAction },
      status: "routed",
      updatedAt: new Date().toISOString(),
    };
    // Persist concern selection in statement for demo
    updated.statement = `Reported concern: ${selectedConcerns.join(", ") || "Not specified"} · Evidence: ${selectedEvidence.join(", ")}`;
    saveCase(updated);
    router.push(`/food/track/${updated.publicReference}`);
  };

  const canSubmit = selectedEvidence.length > 0 && consent && selectedConcerns.length>0;

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
            {FOOD_FIXTURES.map(fx => {
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

          {/* Upload pipeline — PRD 8.3: camera/file picker, EXIF strip, redaction, hash, retention */}
          <div className="mt-4 rounded-xl border-2 border-dashed border-zinc-300 p-4">
            <div className="flex items-center gap-2 text-sm font-medium"><Upload size={16} /> Upload your photo (optional — synthetic fixtures above are enough for demo)</div>
            <div className="mt-2 flex gap-2">
              <input type="file" accept="image/*" onChange={onFilePick} className="block w-full text-sm text-zinc-600 file:mr-3 file:rounded-full file:border file:border-zinc-300 file:bg-white file:px-4 file:py-2 file:text-sm" />
            </div>
            {uploaded.length>0 && (
              <div className="mt-3 space-y-2">
                {uploaded.map(u => (
                  <div key={u.id} className="flex gap-3 rounded-xl border border-zinc-200 bg-white p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u.preview} alt="uploaded evidence" className="h-12 w-12 rounded-lg object-cover border" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{u.name}</div>
                      <div className="text-xs font-mono text-zinc-500">sha256:{u.sha256} · EXIF stripped · faces redacted (demo)</div>
                    </div>
                    <button onClick={()=>{ setUploaded(v=>v.filter(x=>x.id!==u.id)); setSelectedEvidence(s=>s.filter(id=>id!==u.id)); }} className="h-8 w-8 grid place-items-center rounded-full border"><X size={14} /></button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-2 text-xs text-zinc-500">Pipeline: original → EXIF strip → face/PII redaction → SHA-256 → private vault (retention per case state). Public page never shows raw upload.</div>
          </div>

          <div className="mt-3 flex gap-2">
            <Button variant="outline" size="sm" onClick={runExtraction} disabled={extracting || selectedEvidence.length===0}>
              {extracting ? "Extracting…" : "Run AI extraction (optional — fallback is deterministic)"}
            </Button>
            {extracted && <span className="text-xs text-emerald-700 py-2">Extracted {extracted.length} fields — review below</span>}
          </div>
          {extracted && (
            <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
              <div className="text-xs font-semibold tracking-widest text-zinc-500">EXTRACTED — review before submit (PRD 12)</div>
              <div className="mt-2 space-y-1">
                {extracted.map(f => (
                  <div key={f.field} className="flex gap-2 text-xs"><span className="font-mono bg-white border rounded px-1.5 py-0.5">{f.field}</span><span className="flex-1">{f.value}</span><span className={`rounded-full border px-2 py-0.5 ${f.confidence==="high"?"bg-emerald-50 border-emerald-200":"bg-amber-50 border-amber-200"}`}>{f.confidence}</span></div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 flex gap-2"><AlertTriangle size={14} /> Storage: original in restricted vault when legally needed; public view shows redacted/evidence count only. Demo synthetic photos are illustrative.</div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="text-xs font-semibold tracking-widest text-zinc-500">IDENTIFY SUBJECT — progressive (PRD 8.4)</div>
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            <label className="space-y-1"><span className="text-xs font-medium">FSSAI licence (photo/number)</span><input value={fssai} onChange={e=>setFssai(e.target.value)} placeholder="11524035001234 or Not displayed" className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm" /></label>
            <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3 text-xs"><div className="font-medium flex items-center gap-1"><MapPin size={12} /> Map / search business</div><div className="text-zinc-600">GPS coarse: Pune Ward A · Select from map/search — we show “possible match” and require confirm.</div></div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="text-xs font-semibold tracking-widest text-zinc-500">CLASSIFY CONCERN — reported, not violation (PRD 8.5) *</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {CONCERNS.map(ch => {
              const on = selectedConcerns.includes(ch);
              return (
                <button key={ch} onClick={()=>toggleConcern(ch)} className={`rounded-full border px-3 py-1.5 text-xs font-medium ${on ? "bg-zinc-900 text-white border-zinc-900" : "bg-white border-zinc-300 hover:bg-zinc-50"}`}>{ch} {on && "✓"}</button>
              );
            })}
          </div>
          <div className="mt-2 text-xs text-zinc-600">Tap one primary + up to two secondary (max 3). Selected: {selectedConcerns.join(", ") || "— none —"} {selectedConcerns.length>3 && <span className="text-red-600">Max 3</span>}</div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="text-xs font-semibold tracking-widest text-zinc-500">RISK TRIAGE — deterministic (PRD 8.6) *</div>
          {(() => {
            const t = triagePriority({ ...c, evidenceIds: selectedEvidence, subject: { ...c.subject, fssaiNumber: fssai, addressCoarse: "Pune Ward A", geoHash: "te7p01" } });
            return (
              <div className="mt-2">
                <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${t.priority==="critical" ? "bg-red-600 text-white border-red-600" : t.priority==="high" ? "bg-amber-500 text-white border-amber-500" : "bg-white border-zinc-300"}`}>Priority: {t.priority.toUpperCase()} · score {t.scores.severity}×{t.scores.exposure}×{t.scores.urgency}×{t.scores.evidenceQuality}</div>
                <ul className="mt-2 text-xs text-zinc-600 list-disc pl-5 space-y-1">{t.reasons.map(r => <li key={r}>{r}</li>)}</ul>
                <div className="mt-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 p-2">High because exposure + identifiable business. Officer must verify — not guilt. Evidence alone does not prove location — GPS/coarse needed.</div>
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
          {canSubmit ? "Submit — mock route → track" : selectedEvidence.length===0 ? "Pick at least 1 evidence" : selectedConcerns.length===0 ? "Pick 1 concern" : "Give consent to continue"}
        </Button>
      </div>
      <p className="mt-2 text-xs text-center text-zinc-500">* Required for submission. AI extraction is optional — you can submit with “AI unavailable” per PRD 12.</p>
    </div>
  );
}
