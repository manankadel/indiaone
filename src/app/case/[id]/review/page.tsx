"use client";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ShieldAlert } from "lucide-react";
import { useState } from "react";

export default function ReviewPage() {
  const { c, mockSubmit, setStatus } = useStore();
  const [consent, setConsent] = useState(false);
  if (!c) return <div className="p-10 text-sm">Loading…</div>;
  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">STEP 6 OF 7 · REVIEW & CONSENT</div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Review before simulated submission</h1>

      <Card className="mt-4">
        <CardContent className="p-4 space-y-4 text-sm">
          <div><div className="text-xs font-semibold tracking-widest text-zinc-500">TRANSACTION</div><div>{c.transaction?.rail} · ₹{c.transaction?.amount.toLocaleString("en-IN")} · {c.transaction?.reference} · {c.transaction?.institution} → {c.transaction?.recipient}</div></div>
          <div><div className="text-xs font-semibold tracking-widest text-zinc-500">EVIDENCE</div><div>{c.evidenceIds.join(", ")} · {c.evidenceIds.length} fixtures</div></div>
          <div><div className="text-xs font-semibold tracking-widest text-zinc-500">STATEMENT</div><div className="whitespace-pre-wrap bg-zinc-50 border border-zinc-200 rounded-xl p-3">{c.statement.slice(0, 420)}…</div></div>
          <div><div className="text-xs font-semibold tracking-widest text-zinc-500">DESTINATIONS (MOCK)</div><div>Mock bank alert + mock cybercrime portal. No real report will be filed. Reference IDs will be labelled <b>mock/simulated</b>.</div></div>
        </CardContent>
      </Card>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 flex gap-3">
        <input id="consent" type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} className="mt-1" />
        <label htmlFor="consent" className="text-sm">
          <span className="font-medium">I understand this is a simulation.</span> No real bank action or police complaint will occur. Data is synthetic, stored only in my browser, and expires in 24h.
        </label>
      </div>

      <div className="mt-3 flex gap-2 text-xs">
        <span className="rounded-full bg-white border border-zinc-200 px-3 py-1">Works in prototype: UI, validation, mock adapters</span>
        <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1">Mocked: bank + portal submission</span>
        <span className="rounded-full bg-zinc-100 border border-zinc-200 px-3 py-1">Production needs: authorized APIs</span>
      </div>

      <div className="mt-6 flex gap-3">
        <a href="/case/demo/statement" className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium">Edit</a>
        <Button variant="accent" size="lg" className="flex-1" disabled={!consent} onClick={()=>{
          mockSubmit(); location.href="/case/demo/submitted";
        }}>
          Simulate report submission
        </Button>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500"><ShieldAlert size={14} />Idempotent — double-click creates one mock submission. Never fake institutional action.</div>
    </div>
  );
}
