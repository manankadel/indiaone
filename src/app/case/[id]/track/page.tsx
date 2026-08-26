"use client";
import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";

const TIMELINE = [
  { at: "26 Aug 2026, 11:43", owner: "citizen", text: "Case created · synthetic · v1" },
  { at: "26 Aug 2026, 11:44", owner: "citizen", text: "Transaction confirmed: ₹48,500 · UPI · HDFC" },
  { at: "26 Aug 2026, 11:45", owner: "system", text: "AI extraction confirmed · 7 facts · all source-linked" },
  { at: "26 Aug 2026, 11:46", owner: "citizen", text: "Statement finalized · 3 unknowns marked" },
  { at: "26 Aug 2026, 11:46", owner: "mock_bank", text: "Mock bank alert accepted · BANK-ALERT-MOCK-77319 · next: bank review" },
  { at: "26 Aug 2026, 11:46", owner: "mock_portal", text: "Mock portal acknowledged · IND-CYBER-2026-88471 · next: citizen keep phone reachable" },
  { at: "27 Aug 2026, 09:00 (mock)", owner: "system", text: "Under review · if unresolved, appeal/escalation available" },
];

export default function TrackPage() {
  const { c } = useStore();
  if (!c) return <div className="p-10 text-sm">Loading…</div>;
  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">TRACKER · STATUS TIMELINE</div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Case timeline — who owes next</h1>
      <p className="text-sm text-zinc-600 mt-1">Every status shows owner. Mock IDs are labelled <b>mock</b>. Refresh keeps progress.</p>

      <div className="mt-4 space-y-3">
        {TIMELINE.map((t, i) => (
          <Card key={i} className={i===5 ? "border-emerald-200" : ""}>
            <CardContent className="p-4 flex gap-3">
              <span className="h-7 w-7 rounded-full bg-zinc-900 text-white grid place-items-center text-xs">{i+1}</span>
              <div className="flex-1">
                <div className="text-sm font-medium">{t.text}</div>
                <div className="text-xs text-zinc-500">{t.at} · owner: <b>{t.owner}</b></div>
              </div>
              <span className="text-xs rounded-full border border-zinc-200 bg-white px-2 py-1 h-fit">{t.owner}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-4 border-amber-200 bg-amber-50">
        <CardContent className="p-4 text-sm text-amber-900">Escalation (real info, not mock status): If resolution is unsatisfactory, use portal’s appeal / contact State/UT nodal. Emergency: 112. Prototype never promises fund recovery.</CardContent>
      </Card>

      <div className="mt-6 flex gap-3">
        <Link href="/case/demo/submitted" className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium">Back to acknowledgement</Link>
        <Link href="/" className="flex-1 rounded-full bg-[#FF5A1F] text-white py-3 text-center text-sm font-semibold">Back to home</Link>
      </div>
    </div>
  );
}
