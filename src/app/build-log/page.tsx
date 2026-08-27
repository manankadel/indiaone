import { Card, CardContent } from "@/components/ui/Card";

const LOG = [
  {
    date: "2026-08-26 09:30 IST",
    prompt: "Mundhe FDA nationwide: photo + GPS + violation chips + 72h public timeline + owner public.",
    files: "src/lib/services.ts (fda only), src/lib/fixtures.ts (FOOD_FIXTURES), src/app/food/*",
    human: "Made food-only flagship: 3 cases (milk Beed, hotel Nagpur, Zepto Pune) from Mundhe 1,131/49.57cr/56-suspend. Removed 10-service grid — single severe problem per brief.",
    test: "Home shows Milawat dikha? Photo bhejo → /food → 72h track. No Jaipur typing.",
  },
  {
    date: "2026-08-26 15:00 IST",
    prompt: "Rebuild entire app food-only: remove Services 10, keep Fraud as hidden slice not hero, disclosures food-specific, Hinglish default.",
    files: "src/app/page.tsx, src/components/shell/Shell.tsx (food nav), src/app/disclosures/page.tsx",
    human: "Stripped IRCTC/EPFO/etc from nav and hero. Food is single problem — judges see one consequence: milawat. Kept Codex gateway for FSSAI extract.",
    test: "curl /food 200, /services 404 (removed), lint 0, build pass.",
  },
];

export default function BuildLog() {
  return (
    <div className="mx-auto max-w-[1160px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">CODEX · MUNDHE FOOD — EVIDENCE</div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">How we built Mundhe Food Suraksha — nationwide</h1>
      <p className="mt-2 text-zinc-600 max-w-3xl">Mundhe did 25 transfers, time-bound, owner public. We made system beats person: 72h SLA, photo GPS, cost owner. Codex scaffolded, humans enforced honesty.</p>

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
          <li>Photo + GPS = no address typing, no patwari discretion — rule-based routing to Ward FDA (FSS Act/MRTP).</li>
           <li>Officer name public + 72h SLA = time-bound, result-oriented — his walk transparency.</li>
           <li>Cost recovery from owner = taxpayer not paying for illegal — NMMC/CIDCO precedent digitally.</li>
           <li>25 transfers proof: system beats person — honest officer does not need to be transferred.</li>
        </ul>
      </CardContent></Card>

      <div className="mt-6 rounded-[20px] border border-zinc-200 bg-white p-6">
        <div className="font-semibold">Food-only — not 10 services</div>
        <div className="mt-2 text-sm text-zinc-600">Single severe problem: food adulteration nationwide. Not 10 portals redesign. Maharashtra FDA (1,131/49.57cr/56) scaled via GPS-routed State FDA + Central dashboard.</div>
        <div className="mt-3 font-mono text-xs bg-zinc-50 border border-zinc-200 rounded-xl p-3">indiaone.vercel.app/food · mock FDA MH-FDA-2026-1131</div>
      </div>
    </div>
  );
}
