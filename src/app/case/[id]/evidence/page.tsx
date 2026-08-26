"use client";
import { useStore } from "@/lib/store";
import { EVIDENCE_FIXTURES } from "@/lib/fixtures";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useState } from "react";
import { Image as ImgIcon, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ExtractedFact } from "@/lib/types";
import { BUCKETS, logEvent } from "@/lib/analytics";

type GatewayFact = Partial<ExtractedFact> & { field?: string; value?: string };

export default function EvidencePage() {
  const { c, setCase, setStatus } = useStore();
  const router = useRouter();
  const [sel, setSel] = useState<string[]>(c?.evidenceIds ?? ["fx_sms_hdfc", "fx_phonepe"]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<string | null>(null);
  if (!c) return <div className="p-10 text-sm">Loading…</div>;
  const toggle = (id: string) => setSel(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id]);

  const extract = async () => {
    setLoading(true);
    setMode(null);
    const t0 = Date.now();
    try {
      const res = await fetch("/api/extract", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ evidenceIds: sel }) });
      const json: { mode?: string; facts?: GatewayFact[]; latencyMs?: number } = await res.json() as { mode?: string; facts?: GatewayFact[]; latencyMs?: number };
      setMode(json.mode ?? "fixture");
      logEvent({ name:"ai_extraction_completed", props:{ mode: json.mode ?? "fixture", latency_bucket: BUCKETS.latency(Date.now()-t0), fallback: json.mode!=="openai", field_count: json.facts?.length ?? 0 } });
      logEvent({ name:"evidence_fixture_selected", props:{ count_bucket: BUCKETS.count(sel.length), types: sel.map(s=>s.slice(0,3)).join(",") } });
      if (json.facts?.length) {
        const mapped: ExtractedFact[] = json.facts.map((f) => ({
          id: f.id ?? `f_${String(f.field)}`,
          field: (f.field as ExtractedFact["field"]) ?? "amount",
          label: f.label ?? String(f.field ?? "field"),
          value: String(f.value ?? ""),
          sourceEvidenceId: f.sourceEvidenceId ?? sel[0] ?? "fx_sms_hdfc",
          sourceExcerpt: f.sourceExcerpt,
          confidence: (f.confidence as ExtractedFact["confidence"]) ?? "medium",
          status: "pending" as const,
        }));
        setCase({ ...c, evidenceIds: sel, facts: mapped, status: "verify" });
      } else {
        setCase({ ...c, evidenceIds: sel, status: "verify" });
      }
      setStatus("verify");
      router.push("/case/demo/verify");
    } catch {
      setCase({ ...c, evidenceIds: sel, status: "verify" });
      setStatus("verify");
      router.push("/case/demo/verify");
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
        <Link href="/case/demo/transaction" className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium">Back</Link>
        <Button variant="accent" size="lg" className="flex-1" disabled={sel.length===0 || loading} onClick={extract}>
          {loading ? <><Loader2 className="animate-spin" size={16} /> Extracting…</> : "Extract with AI →"}
        </Button>
      </div>
      <p className="mt-3 text-xs text-center text-zinc-500">AI extraction is schema-constrained, source-linked, and fully citizen-confirmed on next screen. Model failure → deterministic fixture fallback in &lt;8s. Evidence treated as untrusted data.</p>
    </div>
  );
}
