import { Card, CardContent } from "@/components/ui/Card";

const LOG = [
  {
    date: "2026-08-26 09:30 IST",
    prompt: "Generate ServiceDefinition JSON + WorkflowEngine scaffold (Next.js, TypeScript, versioned steps, server validates transitions).",
    files: "src/lib/services.ts, src/lib/types.ts, src/lib/store.tsx",
    human: "Added UUID case IDs, browser-local persistence only (not server DB), disclosure field per step, no gov API imports. Rejected: auto-routing without citizen confirm.",
    test: "Verified 3 seeded cases load via SEEDED_CASES; workflow next-rule validation passes; no gov domain fetch.",
  },
  {
    date: "2026-08-26 10:15 IST",
    prompt: "Build AI gateway: strip identifiers, schema-constrain output, link to evidence, 8s timeout → fixture fallback, treat evidence as untrusted, ignore injection.",
    files: "src/app/api/extract/route.ts, src/lib/fixtures.ts, src/lib/api.ts",
    human: "Added ALLOWED_EVIDENCE_IDS allowlist, requestId header, rateLimit 30/min, explicit field allowlist, confidence enum, fallback note. Rejected: generic chatbot — kept extraction-only.",
    test: "curl /api/extract with 0/6 IDs → 400; with 2 IDs → fixture in 2ms; with key missing → fixture; injection string treated as data.",
  },
  {
    date: "2026-08-26 11:00 IST",
    prompt: "Create i18n + voice intake: EN/HI toggle persisted, Web Speech with interim, editable transcript, text fallback if unsupported.",
    files: "src/lib/i18n/dictionary.ts, src/lib/i18n/context.tsx, src/components/voice/VoiceIntake.tsx",
    human: "Persisted locale in localStorage, <html lang> update, voice lang = locale; transcript appends but remains editable. Rejected: voice-only flow — text stays baseline per PRD.",
    test: "Chrome Android hi-IN transcript appends; Safari shows 'not supported' → text path still completes; 360px reach preserved.",
  },
  {
    date: "2026-08-26 12:20 IST",
    prompt: "Harden lint: replace any with type guards, useRouter vs location.href, Link vs <a>, remove setState-in-effect.",
    files: "src/app/case/*, src/components/shell/Shell.tsx, src/app/api/extract/route.ts",
    human: "Added RawFact type guard, extracted allowedFields set, used useRouter.push, lazy init for locale/case, typed SpeechRecognition. No eslint-disable for `any` left except where truly needed.",
    test: "npm run lint 0 errors, 0 warnings; npm run build passes.",
  },
];

export default function BuildLog() {
  return (
    <div className="mx-auto max-w-[1160px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">CODEX · EVIDENCE-BASED LOG</div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">How we built it — with Codex, reviewed by humans</h1>
      <p className="mt-2 text-zinc-600 max-w-3xl">Codex scaffolded; humans decided grounding, safety, and honesty. Every entry below is verifiable: date, prompt purpose, files touched, human decision, and test. No private chain-of-thought, no secrets.</p>

      <div className="mt-6 grid gap-4">
        {LOG.map((e, i) => (
          <Card key={i}><CardContent className="p-5">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-zinc-900 text-white px-2.5 py-1 font-medium">{i+1} · {e.date}</span>
              <span className="rounded-full bg-zinc-100 border border-zinc-200 px-2.5 py-1 text-zinc-700">{e.files.split(",")[0]}</span>
            </div>
            <div className="mt-3">
              <div className="text-xs font-semibold tracking-widest text-zinc-500">PROMPT PURPOSE</div>
              <div className="font-mono text-xs bg-zinc-900 text-zinc-100 rounded-xl p-3 mt-1 whitespace-pre-wrap">{e.prompt}</div>
            </div>
            <div className="mt-3 grid sm:grid-cols-3 gap-3 text-sm">
              <div><div className="text-xs font-semibold tracking-widest text-zinc-500">FILES</div><div className="font-mono text-xs mt-1">{e.files}</div></div>
              <div><div className="text-xs font-semibold tracking-widest text-zinc-500">HUMAN REVIEW</div><div className="text-zinc-700 mt-1">{e.human}</div></div>
              <div><div className="text-xs font-semibold tracking-widest text-zinc-500">TEST</div><div className="text-zinc-700 mt-1">{e.test}</div></div>
            </div>
          </CardContent></Card>
        ))}
      </div>

      <Card className="mt-6 border-emerald-200 bg-emerald-50"><CardContent className="p-5">
        <div className="font-semibold text-emerald-900">Why Codex use is meaningful (not decorative)</div>
        <ul className="mt-2 text-sm text-emerald-800 list-disc pl-5 space-y-1">
          <li>AI is grounded extraction + classification, not a generic chatbot — every fact needs sourceEvidenceId + confidence + citizen confirm.</li>
          <li>Gateway validates schema, allowlists fields, enforces 8s timeout, and falls back to deterministic fixtures so demo never breaks.</li>
          <li>Evidence treated as untrusted data; prompt injection is ignored and logged as safety signal.</li>
          <li>All speculative claims removed — disclosures say “browser-local demo persistence, not server DB; Postgres is production architecture only.”</li>
        </ul>
      </CardContent></Card>

      <div className="mt-6 rounded-[20px] border border-zinc-200 bg-white p-6">
        <div className="font-semibold">Stack & deployment</div>
        <div className="mt-2 text-sm text-zinc-600">Next.js 16 · TypeScript · Tailwind v4 · Vercel (public, no auth, <span className="font-mono">indiaone.vercel.app</span>) · Synthetic fixtures only (3 seeded stories) · Analytics: none in Round 1 except allowlisted buckets, redacted logs with requestId.</div>
        <div className="mt-3 font-mono text-xs bg-zinc-50 border border-zinc-200 rounded-xl p-3">git: github.com/manankadel/indiaone · branch main · demo creds: citizen@indiaone.demo / demo1234 · health: /api/health · extract: /api/extract</div>
      </div>
    </div>
  );
}
