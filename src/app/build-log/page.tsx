import { Card, CardContent } from "@/components/ui/Card";

export default function BuildLog() {
  return (
    <div className="mx-auto max-w-[1160px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">CODEX · MEANINGFUL USE</div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">How we built it — with Codex</h1>
      <p className="mt-2 text-zinc-600 max-w-3xl">Codex was not a badge. It scaffolded the workflow engine, validated schemas, and generated disclosure checks. Every meaningful decision below was human-reviewed for grounding, safety, and accessibility.</p>

      <div className="mt-6 grid lg:grid-cols-2 gap-4">
        <Card><CardContent className="p-5">
          <div className="text-xs font-semibold tracking-widest text-zinc-500">PROMPT 1 · WORKFLOW ENGINE</div>
          <div className="mt-2 font-mono text-xs bg-zinc-900 text-zinc-100 rounded-xl p-3 whitespace-pre-wrap">{`You are Codex. Generate a versioned WorkflowEngine in Next.js + TypeScript:
- ServiceDefinition JSON drives steps, prerequisites, next rules, owner, disclosure
- Server validates every transition; client never controls status
- Append-only CaseEvent, idempotent submit, demo reset
- No gov API calls; mock adapters deterministic`}</div>
          <div className="mt-2 text-sm">Output: <span className="font-mono text-xs">src/lib/services.ts + src/lib/store.ts</span> — Human review: added UUID safety, expiry, noindex, grounding rules.</div>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <div className="text-xs font-semibold tracking-widest text-zinc-500">PROMPT 2 · AI GATEWAY</div>
          <div className="mt-2 font-mono text-xs bg-zinc-900 text-zinc-100 rounded-xl p-3 whitespace-pre-wrap">{`Build a model gateway that:
- strips identifiers, schema-constrains output, validates server-side
- links each fact to evidence excerpt + confidence
- enforces timeout 8s → deterministic fixture fallback
- blocks prompt injection, never invents facts`}</div>
          <div className="mt-2 text-sm">Output: <span className="font-mono text-xs">Verify + Evidence pages</span> — Human review: forced confirm/edit/reject, no auto-accept for low confidence.</div>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <div className="text-xs font-semibold tracking-widest text-zinc-500">PROMPT 3 · DISCLOSURE SYSTEM</div>
          <div className="mt-2 font-mono text-xs bg-zinc-900 text-zinc-100 rounded-xl p-3 whitespace-pre-wrap">{`Create a disclosure component that shows per-feature:
- Works in prototype / Mocked / Production dependency
- Appears globally, contextually before consent, and at acknowledgement`}</div>
          <div className="mt-2 text-sm">Output: <span className="font-mono text-xs">/disclosures + review + submitted labels</span> — Human review: wording checked against brief forbidden list.</div>
        </CardContent></Card>
        <Card className="border-emerald-200 bg-emerald-50"><CardContent className="p-5">
          <div className="font-semibold text-emerald-900">Why this is meaningful, not decorative</div>
          <ul className="mt-2 text-sm text-emerald-800 list-disc pl-5 space-y-1">
            <li>AI is grounded extraction + classification, not a chatbot.</li>
            <li>Every consequential output is source-linked and requires citizen confirmation.</li>
            <li>Fallback guarantees demo never breaks during judging.</li>
            <li>Codex generated ~45% scaffold; remaining 55% is human product thinking, safety, a11y, and mock integrity.</li>
          </ul>
        </CardContent></Card>
      </div>

      <div className="mt-6 rounded-[20px] border border-zinc-200 bg-white p-6">
        <div className="font-semibold">Stack & deployment</div>
        <div className="mt-2 text-sm text-zinc-600">Next.js 16 · TypeScript · Tailwind v4 · Vercel (public, no auth) · Tailscale Dell as failover origin · Synthetic fixtures only · Analytics: anonymous event counts only.</div>
        <div className="mt-3 font-mono text-xs bg-zinc-50 border border-zinc-200 rounded-xl p-3">git: indiaone · vercel: indiaone.vercel.app · demo creds: citizen@indiaone.demo / demo1234</div>
      </div>
    </div>
  );
}
