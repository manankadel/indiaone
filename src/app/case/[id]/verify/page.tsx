"use client";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyPage() {
  const { c, updateFact, setStatus } = useStore();
  const router = useRouter();
  const [edits, setEdits] = useState<Record<string,string>>({});
  if (!c) return <div className="p-10 text-sm">Loading…</div>;
  const allConfirmed = c.facts.every(f=> f.status==="confirmed" || f.status==="edited");
  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">STEP 4 OF 7 · AI EXTRACTION · VERIFY EVERY FACT</div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Confirm what we found</h1>
      <p className="text-sm text-zinc-600 mt-1">AI extracts, <b>you confirm</b>. Every value links to its source evidence. Nothing becomes canonical until you confirm. Low-confidence values are never pre-confirmed.</p>

      <div className="mt-4 space-y-3">
        {c.facts.map(f => (
          <Card key={f.id} className={f.confidence==="low" ? "border-amber-200" : ""}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold tracking-widest text-zinc-500">{f.label} · confidence: <span className={f.confidence==="high" ? "text-emerald-700" : f.confidence==="medium" ? "text-amber-700" : "text-red-600"}>{f.confidence}</span> {f.status!=="pending" && `· ${f.status}`}</div>
                  <input value={edits[f.id] ?? f.value} onChange={e=>setEdits(s=>({...s, [f.id]: e.target.value}))} className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium" />
                  {f.sourceExcerpt && <div className="mt-2 text-xs text-zinc-600">Source: <span className="font-mono bg-zinc-50 border border-zinc-200 rounded px-1.5 py-0.5">{f.sourceExcerpt}</span> from <b>{f.sourceEvidenceId}</b> · <a className="underline">show source</a></div>}
                  {f.confidence==="low" && <div className="mt-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">Low confidence — please verify by hand.</div>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={()=>updateFact(f.id, { status:"rejected" })} className={`rounded-full border px-3 py-1.5 text-xs font-medium ${f.status==="rejected" ? "bg-red-600 text-white border-red-600" : "bg-white"}`}>Reject</button>
                  <button onClick={()=>{
                    const v = edits[f.id] ?? f.value;
                    updateFact(f.id, { value: v, status: edits[f.id] ? "edited" : "confirmed" });
                  }} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${f.status==="confirmed"||f.status==="edited" ? "bg-zinc-900 text-white" : "bg-[#FF5A1F] text-white"}`}>{f.status==="confirmed"||f.status==="edited" ? "Confirmed ✓" : "Confirm"}</button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 text-sm">
        <div className="font-medium">Safety & grounding</div>
        <ul className="list-disc pl-5 text-zinc-600 mt-1 space-y-1 text-sm">
          <li>Treats evidence as untrusted data — prompt injection like “ignore previous instructions” is ignored.</li>
          <li>Never invents absent facts. Unknown stays unknown.</li>
          <li>All model output is schema-validated server-side; fallback is deterministic fixture if timeout.</li>
        </ul>
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/case/demo/evidence" className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium">Back</Link>
        <Button variant="accent" size="lg" className="flex-1" disabled={!allConfirmed} onClick={()=>{ setStatus("statement"); router.push("/case/demo/statement"); }}>
          {allConfirmed ? "All confirmed — build timeline →" : `Confirm all (${c.facts.filter(f=>f.status==="pending").length} left)`}
        </Button>
      </div>
    </div>
  );
}
