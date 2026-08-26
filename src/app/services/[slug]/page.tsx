"use client";
import { getService } from "@/lib/services";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

export default function ServiceSlugPage() {
  const { slug } = useParams<{ slug: string }>();
  const svc = getService(slug);
  const [done, setDone] = useState(false);
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  if (!svc) return <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-10">Unknown service.</div>;

  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest" style={{color: svc.color}}>{svc.badge} · NO TYPING — TAP ONLY</div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">{svc.title}</h1>
      <p className="text-zinc-600 mt-1 text-sm">Tap a chip. No Jaipur-Delhi typing. Problem → 3 taps → mock result.</p>

      <Card className="mt-4">
        <CardContent className="p-4 space-y-3">
          <div className="text-sm font-semibold">Pick — 1 tap</div>
          <div className="grid gap-2 text-sm">
            {svc.slug==="irctc" && <div className="space-y-2">
              <div className="flex gap-2 flex-wrap">
                {["PNR 482-7719033 WL47", "Tatkal failed ₹1,240 debited", "Train 3h late → TDR?"].map(c => (
                  <button key={c} onClick={()=>setSelectedChip(c)} className={`rounded-full border px-4 py-2 text-sm ${selectedChip===c ? "bg-zinc-900 text-white border-zinc-900" : "bg-white border-zinc-300 hover:bg-zinc-50"}`}>{c}</button>
                ))}
              </div>
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm">
                {selectedChip?.includes("WL47") ? "WL47 → 68% confirm (last 30d this train) · Option: LTT boarding 85% / Bus+Train 95% — no city typing." : selectedChip?.includes("Tatkal") ? "Payment debited but REGRET → Auto refund ₹60 cut in 5 days, no TDR needed." : selectedChip?.includes("late") ? "3h late → Full refund via TDR one tap, before departure." : "Tap a chip above — we predict, not search."}
              </div>
            </div>}
            {svc.slug==="income-tax" && <div className="space-y-2">
              <div className="flex gap-2 flex-wrap">
                {["AIS ₹2.40L vs Bank ₹1.70L", "HRA ₹18k confusion", "Old vs New regime?"].map(c => (
                  <button key={c} onClick={()=>setSelectedChip(c)} className={`rounded-full border px-3 py-2 text-sm ${selectedChip===c ? "bg-zinc-900 text-white" : "bg-white"}`}>{c}</button>
                ))}
              </div>
              <div className="rounded-xl bg-white border border-zinc-200 p-3 text-sm">{selectedChip?.includes("AIS") ? "Duplicate FD flagged — tap [This is duplicate] → gap ₹70k gone." : selectedChip?.includes("HRA") ? "Rent ₹18k × 12 = ₹2.16L exempt — auto calc." : "Old saves ₹8,200 (80C+80D). Tap to keep."}</div>
            </div>}
            {svc.slug==="cpgrams" && <div className="space-y-2">
              <div className="flex gap-2 flex-wrap">
                {["Paani 7 din band", "Bijli bill double", "Road kharab"].map(c => (
                  <button key={c} onClick={()=>setSelectedChip(c)} className={`rounded-full border px-3 py-2 text-sm ${selectedChip===c ? "bg-zinc-900 text-white" : "bg-white"}`}>{c}</button>
                ))}
              </div>
              <div className="rounded-xl bg-white border border-zinc-200 p-3 text-sm">Auto route → Dept: Jal Board Zone 2 · SLA 7d · Appeal in 30d if `Disposed` but paani nahi.</div>
            </div>}
            {svc.slug==="gst" && <div className="space-y-2">
              <div className="flex gap-2 flex-wrap">
                {["INV-882 mismatch ₹2,640", "GSTR-3B can't edit", "Notice DRC-01"].map(c => (
                  <button key={c} onClick={()=>setSelectedChip(c)} className={`rounded-full border px-3 py-2 text-sm ${selectedChip===c ? "bg-zinc-900 text-white" : "bg-white"}`}>{c}</button>
                ))}
              </div>
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm">Fix chip: [Mark blocked] → rupee impact gone. No ledger typing.</div>
            </div>}
            {svc.slug==="epfo" && <div className="space-y-2">
              <div className="flex gap-2 flex-wrap">
                {["2 UAN hai", "Exit date missing", "Under Process 30d"].map(c => (
                  <button key={c} onClick={()=>setSelectedChip(c)} className={`rounded-full border px-3 py-2 text-sm ${selectedChip===c ? "bg-zinc-900 text-white" : "bg-white"}`}>{c}</button>
                ))}
              </div>
              <div className="rounded-xl bg-white border border-zinc-200 p-3 text-sm">Owner badge → {selectedChip?.includes("UAN") ? "Merge UAN one tap" : selectedChip?.includes("Exit") ? "Old HR → Nudge" : "EPFO office → Escalate via CPGRAMS"} · Passbook ₹1.18L + ₹42k split shown.</div>
            </div>}
            {svc.slug==="mca" && <div className="flex gap-2 flex-wrap">{["Director add karna", "Annual filing", "Name change"].map(c => (<button key={c} onClick={()=>setSelectedChip(c)} className={`rounded-full border px-3 py-2 text-sm ${selectedChip===c ? "bg-zinc-900 text-white" : "bg-white"}`}>{c}</button>))}</div>}
            {svc.slug==="umang" && <div className="flex gap-2 flex-wrap">{["Papa retired", "State shift", "Bacha hua"].map(c => (<button key={c} onClick={()=>setSelectedChip(c)} className={`rounded-full border px-3 py-2 text-sm ${selectedChip===c ? "bg-zinc-900 text-white" : "bg-white"}`}>{c}</button>))}</div>}
            {svc.slug==="parivahan" && <div className="space-y-2">
              <div className="flex gap-2 flex-wrap">
                {["Bech di, RC pending", "NOC chahiye", "Challan ₹1,200 pending"].map(c => (<button key={c} onClick={()=>setSelectedChip(c)} className={`rounded-full border px-3 py-2 text-sm ${selectedChip===c ? "bg-zinc-900 text-white" : "bg-white"}`}>{c}</button>))}
              </div>
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm">Tap → Intimation date-stamp → liability freeze (SC 2018) · Next: Buyer Form 30. No address typing.</div>
            </div>}
            {svc.slug==="rti" && <div className="flex gap-2 flex-wrap">{["Pothole contracts", "School funds", "Water supply"].map(c => (<button key={c} onClick={()=>setSelectedChip(c)} className={`rounded-full border px-3 py-2 text-sm ${selectedChip===c ? "bg-zinc-900 text-white" : "bg-white"}`}>{c}</button>))}</div>}
          </div>
        </CardContent>
      </Card>

      <div className="mt-3 text-xs text-zinc-500">No input requires typing. Chips + voice. Demo uses synthetic vehicle/PNR/UPI. Tap below → mock.</div>

      <Card className="mt-4">
        <CardContent className="p-4 flex gap-3">
          <input type="checkbox" checked={done} onChange={e=>setDone(e.target.checked)} id="consent2" className="h-5 w-5 mt-0.5" />
          <label htmlFor="consent2" className="text-sm">Samajh gaya — <b>mock</b> hai. Koi real govt call nahi. 1 tap me result.</label>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-3">
        <Link href="/services" className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium">Back</Link>
        <Button className="flex-1" variant={done ? "accent" : "primary"} disabled={!done || !selectedChip} onClick={()=>{
          const el = document.getElementById("mock-result");
          el?.scrollIntoView({ behavior:"smooth" });
        }}>{selectedChip ? "Mock result dekho →" : "Pehle chip chuno"}</Button>
      </div>

      <Card id="mock-result" className="mt-6 border-emerald-200">
        <CardContent className="p-4">
          <div className="text-sm font-semibold">Mock acknowledgement · 1 tap</div>
          <div className="mt-2 font-mono text-sm">{svc.mockArtifact} · mode: mock · {selectedChip ?? "no chip yet — pick above"}</div>
          <div className="mt-2 text-xs text-zinc-600">No typing. No Jaipur-Delhi. Chips + mock adapter. Production needs authorized API.</div>
          <div className="mt-3 text-xs rounded-full bg-zinc-900 text-white inline-flex px-3 py-1">Works: chips + mock · Planned: authorized</div>
        </CardContent>
      </Card>
    </div>
  );
}
