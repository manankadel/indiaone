import { Card, CardContent } from "@/components/ui/Card";

export default function Disclosures() {
  return (
    <div className="mx-auto max-w-[1160px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">FOOD SURAKSHA · SERVICE INFORMATION</div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">How a food-safety report is handled</h1>
      <p className="mt-2 text-zinc-600 max-w-3xl">Your report is organised into evidence, location, risk and a clear next action. The case reference lets you follow verified updates without chasing an office.</p>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <Card className="border-emerald-200"><CardContent className="p-5"><div className="font-semibold text-emerald-800">For citizens</div><ul className="mt-2 text-sm text-zinc-700 list-disc pl-5 space-y-1"><li>Upload evidence and describe the risk in a few taps</li><li>Receive a case reference you can search later</li><li>See the responsible office, current owner and next checkpoint</li><li>Read verified inspection, testing and corrective-action updates</li></ul></CardContent></Card>
        <Card className="border-blue-200 bg-blue-50"><CardContent className="p-5"><div className="font-semibold text-blue-900">For food-safety teams</div><ul className="mt-2 text-sm text-blue-950 list-disc pl-5 space-y-1"><li>Cases are prioritised by risk, exposure and evidence quality</li><li>Related reports can be grouped around one business or incident</li><li>Every assignment and outcome has an accountable actor and reason</li><li>Public updates exclude personal details and raw evidence</li></ul></CardContent></Card>
        <Card><CardContent className="p-5"><div className="font-semibold">Service boundaries</div><ul className="mt-2 text-sm text-zinc-700 list-disc pl-5 space-y-1"><li>A report starts an official review; it is not a finding of guilt</li><li>Inspection, sampling, notice and closure remain due-process decisions</li><li>Urgent illness symptoms still require medical care and emergency help</li><li>Evidence is retained only for the case purpose and access is controlled</li></ul></CardContent></Card>
      </div>

      <div className="mt-6 rounded-[20px] border border-zinc-200 bg-white p-6">
        <div className="font-semibold">Mundhe principle — system beats person</div>
        <p className="text-sm text-zinc-600 mt-1">The product borrows a visible, time-bound enforcement pattern reported during Tukaram Mundhe’s Maharashtra FDA tenure. It does not imply that a prototype can order inspections, suspend licences or recover costs.</p>
      </div>

      <div className="mt-6 text-xs text-zinc-500">Sources: Indian Express July 2026 (Mundhe FDA), Business Standard, CIDCO (1,804 razed), NMMC (12,687 illegal), The Quint (Navi Mumbai walk). No live FDA system called.</div>
    </div>
  );
}
