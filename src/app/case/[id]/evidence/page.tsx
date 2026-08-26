"use client";
import { useStore } from "@/lib/store";
import { EVIDENCE_FIXTURES } from "@/lib/fixtures";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useState } from "react";
import { Image as ImgIcon, Check, Loader2 } from "lucide-react";

export default function EvidencePage() {
  const { c, setCase, setStatus } = useStore();
  const [sel, setSel] = useState<string[]>(c?.evidenceIds ?? ["fx_sms_hdfc", "fx_phonepe"]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<string | null>(null);
  if (!c) return <div className="p-10 text-sm">Loading…</div>;
  const toggle = (id: string) => setSel(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id]);

  const extract = async () => {
    setLoading(true);
    setMode(null);
    try {
      const res = await fetch("/api/extract", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ evidenceIds: sel }) });
      const json = await res.json();
      setMode(json.mode ?? "fixture");
      // attach fresh facts from gateway, keep seeded structure but merge
      if (json.facts?.length) {
        const mapped = json.facts.map((f: any) => ({
          id: f.id ?? `f_${f.field}`,
          field: f.field,
          label: f.label ?? f.field,
          value: f.value,
          sourceEvidenceId: f.sourceEvidenceId,
          sourceExcerpt: f.sourceExcerpt,
          confidence: f.confidence ?? "medium",
          status: "pending" as const,
        }));
        setCase({ ...c, evidenceIds: sel, facts: mapped, status: "verify" } as any);
      } else {
        setCase({ ...c, evidenceIds: sel, status: "verify" } as any);
      }
      setStatus("verify");
      location.href = "/case/demo/verify";
    } catch {
      setCase({ ...c, evidenceIds: sel, status: "verify" } as any);
      setStatus("verify");
      location.href = "/case/demo/verify";
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">STEP 3 OF 7 · EVIDENCE</div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Add evidence — synthetic fixtures</h1>
      <p className="text-sm text-zinc-600 mt-1">Public demo uses <b>bundled synthetic evidence only</b>. Do not upload real personal data. For hackathon judging, selecting fixtures is the intended path.</p>

      <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Demo-only gate: local upload disabled for review to prevent real data exposure. Use fixtures below. AI gateway will use OpenAI if <span className="font-mono">OPENAI_API_KEY</span> is set, otherwise deterministic fallback &lt;8s.</div>

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
          <span className="ml-auto text-xs text-zinc-500">{sel.length===0 ? "Pick at least one for seeded extraction" : mode ? `Gateway: ${mode}` : "Ready for AI extraction"}</span>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-3">
        <a href="/case/demo/transaction" className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium">Back</a>
        <Button variant="accent" size="lg" className="flex-1" disabled={sel.length===0 || loading} onClick={extract}>
          {loading ? <><Loader2 className="animate-spin" size={16} /> Extracting…</> : "Extract with AI →"}
        </Button>
      </div>
      <p className="mt-3 text-xs text-center text-zinc-500">AI extraction is schema-constrained, source-linked, and fully citizen-confirmed on next screen. Model failure → deterministic fixture fallback in &lt;8s. Evidence treated as untrusted data.</p>
    </div>
  );
}
