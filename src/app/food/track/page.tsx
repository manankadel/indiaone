"use client";
import { Suspense } from "react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function TrackInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const [reference, setReference] = useState(sp.get("ref") ?? "");
  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-emerald-700">TRACK YOUR REPORT</div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Where does your report stand?</h1>
      <p className="text-sm text-zinc-600 mt-1">Enter the reference number you received after submitting a report.</p>
      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <label className="block text-sm font-medium" htmlFor="reference">Reference number</label>
        <input id="reference" value={reference} onChange={e=>setReference(e.target.value)} placeholder="e.g. MH-FDA-2026-4821" className="mt-2 w-full rounded-xl border border-zinc-300 px-3 py-3 text-sm" />
        <button onClick={()=>reference.trim() && router.push(`/food/track/${encodeURIComponent(reference.trim())}`)} className="mt-3 w-full rounded-full bg-zinc-900 px-4 py-3 text-sm font-semibold text-white">View report status</button>
      </div>
      <Link href="/food" className="mt-6 inline-flex rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium">Report a food-safety concern</Link>
    </div>
  );
}

export default function FoodTrackPage() {
  return <Suspense fallback={<div className="p-10 text-sm">Loading…</div>}><TrackInner /></Suspense>;
}
