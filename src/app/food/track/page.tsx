"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Check, Clock } from "lucide-react";
import { SEEDED_FOOD_CASES } from "@/lib/fixtures";

function TrackInner() {
  const sp = useSearchParams();
  const k = (sp.get("k") as keyof typeof SEEDED_FOOD_CASES) ?? "milk";
  const c = SEEDED_FOOD_CASES[k] ?? SEEDED_FOOD_CASES.milk;
  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-emerald-700">TRACK · SYNTHETIC ACKNOWLEDGEMENT</div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight flex items-center gap-2"><Check className="text-emerald-600" /> Report recorded for review — {c.shop}</h1>
      <p className="text-sm text-zinc-600 mt-1">No real submission. Synthetic ref: <span className="font-mono">FOOD-DEMO-{k.toUpperCase()}-1131</span> · Mode: demo · Status events are illustrative.</p>
      <Card className="mt-4 border-emerald-200">
        <CardContent className="p-4 space-y-3 text-sm">
          <div className="flex items-center gap-2"><span className="h-6 w-6 grid place-items-center rounded-full bg-zinc-900 text-white text-xs">1</span> Day 0: Evidence received → synthetic jurisdiction triage</div>
          <div className="flex items-center gap-2"><Clock size={14} className="text-zinc-500" /> Day 1: Acknowledgement or clarification request</div>
          <div className="flex items-center gap-2"><Check size={14} className="text-emerald-600" /> Day 3: Inspection outcome or next-step update</div>
          <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3 text-xs">A production system must integrate Food Safety Connect and State FDA workflows, preserve an audit trail and show only verified public updates.</div>
        </CardContent>
      </Card>
      <div className="mt-6 flex gap-3">
        <Link href="/food" className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium">Back to food</Link>
        <Link href="/" className="flex-1 rounded-full bg-zinc-900 text-white py-3 text-center text-sm font-semibold">Home</Link>
      </div>
    </div>
  );
}

export default function FoodTrackPage() {
  return <Suspense fallback={<div className="p-10 text-sm">Loading…</div>}><TrackInner /></Suspense>;
}
