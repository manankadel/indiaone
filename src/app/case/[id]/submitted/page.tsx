"use client";
import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { Check, Clock, ArrowRight } from "lucide-react";

export default function SubmittedPage() {
  const { c } = useStore();
  if (!c) return <div className="p-10 text-sm">Loading…</div>;
  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-emerald-700">SUBMITTED · MOCK ACKNOWLEDGEMENT</div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight flex items-center gap-2"><Check className="text-emerald-600" /> Mock submission accepted</h1>
      <p className="text-sm text-zinc-600 mt-1">This is a <b>simulated</b> acknowledgement. No real bank or police system was contacted.</p>

      <Card className="mt-4 border-emerald-200">
        <CardContent className="p-4 grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-xs font-semibold tracking-widest text-zinc-500">BANK ALERT (MOCK)</div>
            <div className="font-mono font-medium">{c.referenceIds?.bank}</div>
            <div className="text-zinc-600">Mode: mock · Status: accepted · Next owner: bank</div>
          </div>
          <div>
            <div className="text-xs font-semibold tracking-widest text-zinc-500">CYBERCRIME PORTAL (MOCK)</div>
            <div className="font-mono font-medium">{c.referenceIds?.portal}</div>
            <div className="text-zinc-600">Mode: mock · Status: acknowledged · Next owner: citizen</div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="text-sm font-semibold flex items-center gap-2"><Clock size={16} /> Next actions & ownership</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex gap-2"><span className="h-6 w-6 grid place-items-center rounded-full bg-zinc-900 text-white text-xs">1</span> <span><b>You (citizen):</b> Keep phone reachable. Save complaint ID. Monitor bank SMS for hold/freeze update.</span></li>
            <li className="flex gap-2"><span className="h-6 w-6 grid place-items-center rounded-full bg-zinc-100 border text-xs">2</span> <span><b>Bank (mock):</b> would attempt hold on beneficiary account. Real flow needs authorized channel — not simulated here.</span></li>
            <li className="flex gap-2"><span className="h-6 w-6 grid place-items-center rounded-full bg-zinc-100 border text-xs">3</span> <span><b>Law enforcement (mock):</b> status → under review. Escalation info: call 1930 again if needed, track via portal.</span></li>
          </ul>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-3">
        <Link href="/case/demo/track" className="flex-1 rounded-full bg-zinc-900 text-white py-3 text-center text-sm font-semibold hover:bg-black">Track case timeline →</Link>
        <Link href="/" className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium">Home</Link>
      </div>

      <div className="mt-4 rounded-xl bg-zinc-50 border border-zinc-200 p-3 text-xs text-zinc-600">
        Production blueprint: authorized bank notification via contracted authenticated channel; official cybercrime submission API if offered; encrypted evidence vault; idempotent consumers; circuit breakers; 180-day log retention per CERT-In for qualifying orgs.
      </div>
    </div>
  );
}
