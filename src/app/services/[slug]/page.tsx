"use client";
import { SERVICES, getService } from "@/lib/services";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

export default function ServiceSlugPage() {
  const { slug } = useParams<{ slug: string }>();
  const svc = getService(slug);
  const [done, setDone] = useState(false);
  if (!svc) return <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-10">Unknown service.</div>;

  // Simple config-driven slice: shows intent -> form -> review -> mock result
  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest" style={{color: svc.color}}>{svc.badge}</div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">{svc.title}</h1>
      <p className="text-zinc-600 mt-1">{svc.problem} · Persona: {svc.persona}</p>

      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="text-xs font-semibold tracking-widest text-zinc-500">WORKFLOW (CONFIG-DRIVEN)</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {svc.workflow.map(w => <span key={w.id} className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium">{w.title} · {w.kind}</span>)}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-4 space-y-3">
          <div className="text-sm font-semibold">Start — {svc.intents[0]}</div>
          <div className="grid gap-3 text-sm">
            {svc.slug==="irctc" && <>
              <label className="space-y-1"><span className="text-xs font-medium">From → To</span><input defaultValue="Pune → Delhi" className="w-full rounded-xl border border-zinc-300 px-3 py-2" /></label>
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">Alternative: 12149 Pune-Delhi Express via alternate boarding at LTT — WL 12 (70% confirm) · Also: Pune→Bhopal bus + Bhopal→Delhi train (95% reach).</div>
            </>}
            {svc.slug==="income-tax" && <>
              <label className="space-y-1"><span className="text-xs font-medium">AIS mismatch</span><div className="rounded-xl bg-white border border-zinc-200 p-3">Interest ₹42,300 vs AIS ₹44,100 — we explain provenance and keep both visible for confirmation.</div></label>
              <div className="rounded-xl bg-zinc-900 text-white p-3">Regime compare: Old saves ₹8,200 due to 80C/80D. Assumption: rent ₹18k/mo. You confirm.</div>
            </>}
            {svc.slug==="cpgrams" && <><textarea defaultValue="Water supply broken for 7 days, ward 4B. Ticket to dept was rejected, routed to wrong zone." className="w-full rounded-xl border border-zinc-300 p-3" rows={3} /><div className="text-xs text-zinc-600">AI routes to Dept of Water Supply, Zone 2 with reason + SLA 7 days, escalation if missed.</div></>}
            {svc.slug==="gst" && <><div className="rounded-xl border border-zinc-200 p-3">Invoice INV-882: GSTIN mismatch ₹14,880 vs e-invoice ₹12,240 — rupee impact shown before form code.</div><div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm">Fix mismatch before filing — ordered by consequence.</div></>}
            {svc.slug==="epfo" && <><div className="text-sm">Timeline: Employer A (2023) — exit missing · Employer B (2024) — active. Detect suggests transfer vs correction.</div><div className="rounded-xl bg-white border border-zinc-200 p-3">Passbook split: ₹1.18L + ₹42k. Employer approval required — ownership explicit.</div></>}
            {svc.slug==="mca" && <><div className="text-sm">Event: Add director — dependency graph: DIN → Consent → Board resolution → Form DIR-12 → DSC → Fee.</div><div className="rounded-xl border border-zinc-200 p-3">Who signs: existing director + new director (DSC). Deadline: 30 days.</div></>}
            {svc.slug==="umang" && <><div className="text-sm">Life event: Father retired. Plan: 6 tasks across EPFO, pension, health. Complete one, save rest.</div><div className="rounded-xl bg-white border border-zinc-200 p-3">Unified status: 1/6 done · Profile reused with consent.</div></>}
            {svc.slug==="parivahan" && <><div className="text-sm">Vehicle: MH12 AB 1234 · Sale: 24 Aug 2026 · Buyer/Seller split tasks.</div><div className="rounded-xl bg-amber-50 border border-amber-200 p-3">Risk until transfer: challan/liability stays with seller. Next: buyer confirms docs.</div></>}
            {svc.slug==="rti" && <><div className="text-sm">Info need: pothole repair contracts, ward 4B, last 6 months.</div><div className="rounded-xl bg-white border border-zinc-200 p-3">RTI check: this IS RTI (not grievance). Authority: Municipal Commissioner with 70% confidence — you choose. Draft: 3 scoped record questions.</div></>}
            {!["irctc","income-tax","cpgrams","gst","epfo","mca","umang","parivahan","rti"].includes(svc.slug) && <div className="text-zinc-600 text-sm">Synthetic intake for {svc.title} — config-driven, mock adapters.</div>}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-4 flex gap-3">
          <input type="checkbox" checked={done} onChange={e=>setDone(e.target.checked)} id="consent2" />
          <label htmlFor="consent2" className="text-sm">I understand this is a <b>mock</b> flow. No real government system will be called. All data synthetic.</label>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-3">
        <Link href="/services" className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium">Back to services</Link>
        <Button className="flex-1" variant={done ? "accent" : "primary"} disabled={!done} onClick={()=>{
          const el = document.getElementById("mock-result");
          el?.scrollIntoView({ behavior:"smooth" });
        }}>Simulate submission →</Button>
      </div>

      <Card id="mock-result" className="mt-6 border-emerald-200">
        <CardContent className="p-4">
          <div className="text-sm font-semibold">Mock acknowledgement</div>
          <div className="mt-2 font-mono text-sm">{svc.mockArtifact} · mode: mock · next owner: {svc.slug==="parivahan" ? "buyer" : svc.slug==="epfo" ? "employer" : "citizen"}</div>
          <div className="mt-2 text-xs text-zinc-600">Production needs: authorized API, identity, payment, audit. No private API used. No scraping.</div>
          <div className="mt-3 text-xs rounded-full bg-zinc-900 text-white inline-flex px-3 py-1">Works: UI + workflow · Mocked: submission · Planned: authorized integration</div>
        </CardContent>
      </Card>

      <div className="mt-6 rounded-xl bg-zinc-900 text-white p-4 text-xs">
        Same primitives as flagship: ServiceDefinition JSON → WorkflowEngine → Evidence vault (synthetic) → MockAdapter → Disclosure. No custom architecture.
      </div>
    </div>
  );
}
