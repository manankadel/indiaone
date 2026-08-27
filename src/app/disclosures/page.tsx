import { Card, CardContent } from "@/components/ui/Card";

export default function Disclosures() {
  return (
    <div className="mx-auto max-w-[1160px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">HONESTY · REAL / MOCKED / PLANNED — FOOD SAFETY ONLY</div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">What works, what’s mocked for Food Suraksha</h1>
      <p className="mt-2 text-zinc-600 max-w-3xl">Maharashtra FDA pattern (1,131 inspections, ₹49.57cr seized, 56 licences suspended — Indian Express July 2026) now as nationwide mock. No live FSSAI/FDA call, no scraping, no real photo stored.</p>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <Card className="border-emerald-200"><CardContent className="p-5"><div className="font-semibold text-emerald-800">Works in prototype</div><ul className="mt-2 text-sm text-zinc-700 list-disc pl-5 space-y-1"><li>Photo + GPS chip (auto ward), violation chips, FSSAI auto-check (mock extract)</li><li>3 synthetic food cases: milk (Beed), hotel (Nagpur), Zepto dark store (Pune)</li><li>72h public timeline with officer name public (Mundhe walk transparency)</li><li>Hinglish default + 8-lang, tap-only, voice optional</li><li>Public link, no login required, 24h browser-only</li></ul></CardContent></Card>
        <Card className="border-amber-200 bg-amber-50"><CardContent className="p-5"><div className="font-semibold text-amber-900">Mocked</div><ul className="mt-2 text-sm text-amber-900 list-disc pl-5 space-y-1"><li>FDA notice: mock MH-FDA-2026-1131</li><li>Seizure/demolition: mock — cost from owner (CIDCO 1,804 precedent)</li><li>FSSAI verification: mock excerpt from photo</li><li>Status: Day 0/1/3 seeded timeline</li><li>Photo: picsum mock, not your shop</li></ul></CardContent></Card>
        <Card><CardContent className="p-5">        <div className="font-semibold">Production needs</div><ul className="mt-2 text-sm text-zinc-700 list-disc pl-5 space-y-1"><li>FSSAI central + State FDA authorized API (GPS to Ward auto-route)</li><li>Officer assignment with public name + 72h SLA enforcement</li><li>Notice under FSS Act / MRTP with digital signature</li><li>Evidence vault with hash, 180d CERT-In log, DPDP consent</li><li>Central dashboard: 1,131 pattern scaled nationwide</li></ul></CardContent></Card>
      </div>

      <div className="mt-6 rounded-[20px] border border-zinc-200 bg-white p-6">
        <div className="font-semibold">Mundhe principle — system beats person</div>
        <p className="text-sm text-zinc-600 mt-1">25 transfers in 21 yrs shows transfer is punishment for honesty. Digital system makes 72h SLA, owner public, cost from owner — honesty does not depend on posting.</p>
      </div>

      <div className="mt-6 text-xs text-zinc-500">Sources: Indian Express July 2026 (Mundhe FDA), Business Standard, CIDCO (1,804 razed), NMMC (12,687 illegal), The Quint (Navi Mumbai walk). No live FDA system called.</div>
    </div>
  );
}
