"use client";
import { useStore } from "@/lib/store";
import { EVIDENCE_FIXTURES } from "@/lib/fixtures";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useState } from "react";
import { Image as ImgIcon, Check } from "lucide-react";

export default function EvidencePage() {
  const { c, setCase, setStatus } = useStore();
  const [sel, setSel] = useState<string[]>(c?.evidenceIds ?? ["fx_sms_hdfc", "fx_phonepe"]);
  if (!c) return <div className="p-10 text-sm">Loading…</div>;
  const toggle = (id: string) => setSel(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id]);
  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">STEP 3 OF 7 · EVIDENCE</div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Add evidence — synthetic fixtures</h1>
      <p className="text-sm text-zinc-600 mt-1">Public demo uses <b>bundled synthetic evidence only</b>. Do not upload real personal data. For hackathon judging, selecting fixtures is the intended path.</p>

      <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Demo-only gate: local upload is ephemeral and disabled for review to prevent real data exposure. Use fixtures below.</div>

      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        {EVIDENCE_FIXTURES.map(fx => {
          const on = sel.includes(fx.id);
          return (
            <button key={fx.id} onClick={()=>toggle(fx.id)} className={`text-left rounded-2xl border p-4 flex gap-3 ${on ? "bg-zinc-900 text-white border-zinc-900" : "bg-white border-zinc-200"}`}>
              <span className={`h-10 w-10 grid place-items-center rounded-xl ${on ? "bg-white text-zinc-900" : "bg-zinc-100"}`}>{fx.type === "sms" ? "💬" : fx.type === "receipt" ? "🧾" : fx.type==="chat" ? "💬" : "✉️"}</span>
              <span className="flex-1">
                <span className="block text-sm font-medium">{fx.title} <span className="opacity-60">· {fx.type}</span></span>
                <span className={`block text-xs mt-1 ${on ? "text-white/70" : "text-zinc-600"}`}>{fx.excerpt}</span>
              </span>
              {on && <Check size={16} />}
            </button>
          );
        })}
      </div>

      <Card className="mt-4">
        <CardContent className="p-4 flex items-center gap-3 text-sm">
          <ImgIcon size={16} /> Selected {sel.length} fixtures  — preview, remove, type-labelled. No EXIF retained. Files never in analytics.
          <span className="ml-auto text-xs text-zinc-500">{sel.length===0 ? "Pick at least one for seeded extraction" : "Ready for AI extraction"}</span>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-3">
        <a href="/case/demo/transaction" className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium">Back</a>
        <Button variant="accent" size="lg" className="flex-1" disabled={sel.length===0} onClick={()=>{
          setCase({...c, evidenceIds: sel, status:"verify"});
          setStatus("verify"); location.href="/case/demo/verify";
        }}>Extract with AI →</Button>
      </div>
      <p className="mt-3 text-xs text-center text-zinc-500">AI extraction is schema-constrained, source-linked, and fully citizen-confirmed on next screen. Model failure → deterministic fixture fallback in &lt;8s.</p>
    </div>
  );
}
