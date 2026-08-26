"use client";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export default function VerifyPage() {
  const { c, updateFact, setStatus } = useStore();
  const { t } = useI18n();
  const router = useRouter();
  const [edits, setEdits] = useState<Record<string,string>>({});
  if (!c) return <div className="p-10 text-sm">Loading…</div>;
  const allConfirmed = c.facts.every(f=> f.status==="confirmed" || f.status==="edited");
  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">STEP 4/7 · {t("verify.title")}</div>
      <h1 className="mt-2 text-[28px] font-semibold tracking-tight leading-none">Ye sahi hai?</h1>
      <p className="text-sm text-zinc-600 mt-1">{t("verify.sub")} — 1 tap me confirm. Edit zarurat ho toh hi.</p>

      <div className="mt-4 space-y-3">
        {c.facts.slice(0,5).map(f => (
          <Card key={f.id} className={`${f.confidence==="low" ? "border-amber-200" : ""} ${f.status==="confirmed"||f.status==="edited" ? "border-emerald-200 bg-emerald-50/30" : ""}`}>
            <CardContent className="p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold tracking-widest text-zinc-500 flex items-center gap-2">{f.label} <span className={`rounded-full border px-1.5 py-0.5 text-[10px] ${f.confidence==="high"?"bg-emerald-50 border-emerald-200 text-emerald-800": f.confidence==="medium"?"bg-amber-50 border-amber-200 text-amber-800":"bg-red-50 border-red-200 text-red-700"}`}>{f.confidence}</span> {f.status!=="pending" && <span className="text-emerald-600">✓ {f.status}</span>}</div>
                <div className="mt-1 flex gap-2 items-center">
                  <input value={edits[f.id] ?? f.value} onChange={e=>setEdits(s=>({...s, [f.id]: e.target.value}))} className="flex-1 min-w-0 rounded-full border border-zinc-300 bg-white px-3 py-2 text-sm font-medium" />
                </div>
                <div className="mt-1 text-xs text-zinc-500 truncate">Source: {f.sourceEvidenceId} · {f.sourceExcerpt?.slice(0,40)}</div>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <button onClick={()=>{
                  const v = edits[f.id] ?? f.value;
                  updateFact(f.id, { value: v, status: edits[f.id] ? "edited" : "confirmed" });
                }} className={`rounded-full px-4 py-2 text-xs font-semibold ${f.status==="confirmed"||f.status==="edited" ? "bg-zinc-900 text-white" : "bg-[#FF5A1F] text-white"}`}>{f.status==="confirmed"||f.status==="edited" ? "✓" : t("common.confirm")}</button>
                <button onClick={()=>updateFact(f.id, { status:"rejected" })} className="rounded-full border bg-white px-3 py-1 text-xs">×</button>
              </div>
            </CardContent>
          </Card>
        ))}
        {c.facts.length>5 && <div className="text-xs text-center text-zinc-500">+{c.facts.length-5} more — tap Confirm All below to finish fast.</div>}
        <button onClick={()=> c.facts.forEach(f=>{ if(f.status==="pending") updateFact(f.id, { status: f.confidence==="low" ? "pending" : "confirmed" }); })} className="w-full rounded-full border border-zinc-300 bg-white py-2.5 text-sm font-medium">Baki sab auto-confirm (low 제외)</button>
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/case/demo/evidence" className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium">Back</Link>
        <Button variant="accent" size="lg" className="flex-1" disabled={!allConfirmed} onClick={()=>{ setStatus("statement"); router.push("/case/demo/statement"); }}>
          {allConfirmed ? t("statement.cta")+" →" : `${c.facts.filter(f=>f.status==="pending").length} baki — sab confirm karo`}
        </Button>
      </div>
    </div>
  );
}
