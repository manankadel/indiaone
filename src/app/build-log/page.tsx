import { Card, CardContent } from "@/components/ui/Card";

const LOG = [
  {
    date: "2026-08-26 09:30 IST",
    prompt: "Food-safety only: evidence + location + violation chips + visible status timeline.",
    files: "src/app/food/*, src/lib/foodRepo.ts",
    human: "Made food safety the only journey: evidence, jurisdiction, risk, action plan and a searchable case reference.",
    test: "Home opens the food-safety report flow and the tracker resolves a server case reference.",
  },
  {
    date: "2026-08-26 15:00 IST",
    prompt: "Rebuild the product around food safety only; remove unrelated service journeys and make the evidence trail explicit.",
    files: "src/app/page.tsx, src/components/shell/Shell.tsx (food nav), src/app/disclosures/page.tsx",
    human: "Stripped unrelated government journeys from nav and hero. Food safety is the single problem; the case history keeps evidence and status visible.",
    test: "curl /food 200, /services 404 (removed), lint 0, build pass.",
  },
];

export default function BuildLog() {
  return (
    <div className="mx-auto max-w-[1160px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">CODEX · MUNDHE FOOD — EVIDENCE</div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">How we built Mundhe Food Suraksha — nationwide</h1>
      <p className="mt-2 text-zinc-600 max-w-3xl">The product takes inspiration from reported Maharashtra FDA enforcement and makes accountability visible from first report to verified outcome.</p>

      <div className="mt-6 grid gap-4">
        {LOG.map((e, i) => (
          <Card key={i}><CardContent className="p-5">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-[#DC2626] text-white px-2.5 py-1 font-medium">{i+1} · {e.date}</span>
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

      <Card className="mt-6 border-red-200 bg-red-50"><CardContent className="p-5">
        <div className="font-semibold text-red-900">Mundhe principle in code</div>
        <ul className="mt-2 text-sm text-red-800 list-disc pl-5 space-y-1">
           <li>Photo + location reduces typing; production routing still needs official jurisdiction data and officer review.</li>
           <li>Status events are visible and time-bound as a proposed product target; no government SLA is claimed.</li>
           <li>Enforcement outcomes are recorded as verified events; the prototype never promises seizure, closure or cost recovery.</li>
           <li>Accountability is designed into the audit trail instead of depending on one officer’s visibility.</li>
        </ul>
      </CardContent></Card>

      <div className="mt-6 rounded-[20px] border border-zinc-200 bg-white p-6">
        <div className="font-semibold">Food-only — not 10 services</div>
        <div className="mt-2 text-sm text-zinc-600">Single severe problem: food safety complaints. Not 10 portals redesigned. The service captures evidence, routes by jurisdiction, records accountable actions and exposes a public status projection.</div>
        <div className="mt-3 font-mono text-xs bg-zinc-50 border border-zinc-200 rounded-xl p-3">/food · evidence-to-action case workflow</div>
      </div>
    </div>
  );
}
