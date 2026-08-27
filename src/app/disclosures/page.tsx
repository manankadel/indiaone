import { Card, CardContent } from "@/components/ui/Card";

export default function Disclosures() {
  return (
    <div className="mx-auto max-w-[1160px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">HONESTY · REAL / MOCKED / PLANNED — FOOD SAFETY ONLY</div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">What works, what’s mocked for Food Suraksha</h1>
      <p className="mt-2 text-zinc-600 max-w-3xl">This is a food-safety reporting prototype inspired by Maharashtra FDA’s 2026 enforcement drive. No live FSSAI/FDA call, no scraping, and no real photo is stored.</p>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <Card className="border-emerald-200"><CardContent className="p-5"><div className="font-semibold text-emerald-800">Works in prototype</div><ul className="mt-2 text-sm text-zinc-700 list-disc pl-5 space-y-1"><li>Photo + location chip, violation chips and a confirmation step</li><li>3 synthetic food cases: milk (Beed), hotel (Nagpur), dark store (Pune)</li><li>Illustrative status timeline with acknowledgement, triage and outcome events</li><li>Hinglish default, tap-first flow, voice optional</li><li>Public demo link, no login required</li></ul></CardContent></Card>
        <Card className="border-amber-200 bg-amber-50"><CardContent className="p-5"><div className="font-semibold text-amber-900">Mocked</div><ul className="mt-2 text-sm text-amber-900 list-disc pl-5 space-y-1"><li>Food authority acknowledgement and reference number</li><li>Jurisdiction, officer assignment and enforcement outcome</li><li>FSSAI number extraction from the synthetic evidence card</li><li>Status: Day 0/1/3 seeded timeline</li><li>All photos, locations and businesses are synthetic</li></ul></CardContent></Card>
        <Card><CardContent className="p-5">        <div className="font-semibold">Production needs</div><ul className="mt-2 text-sm text-zinc-700 list-disc pl-5 space-y-1"><li>Authorised Food Safety Connect and State FDA integration</li><li>Official jurisdiction mapping and risk-based triage</li><li>Due-process notices, officer permissions and appeal handling</li><li>Evidence vault with hashes, retention controls and DPDP consent</li><li>Public event log with redaction, verification and correction workflow</li></ul></CardContent></Card>
      </div>

      <div className="mt-6 rounded-[20px] border border-zinc-200 bg-white p-6">
        <div className="font-semibold">Mundhe principle — system beats person</div>
        <p className="text-sm text-zinc-600 mt-1">The product borrows a visible, time-bound enforcement pattern reported during Tukaram Mundhe’s Maharashtra FDA tenure. It does not imply that a prototype can order inspections, suspend licences or recover costs.</p>
      </div>

      <div className="mt-6 text-xs text-zinc-500">Sources: Indian Express July 2026 (Mundhe FDA), Business Standard, CIDCO (1,804 razed), NMMC (12,687 illegal), The Quint (Navi Mumbai walk). No live FDA system called.</div>
    </div>
  );
}
