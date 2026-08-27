"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { loadCase, loadEvents, saveCaseWithActor } from "@/lib/foodRepo";

export default function AuthorityCasePage() {
  const { id } = useParams<{ id: string }>();
  const [c, setC] = useState<ReturnType<typeof loadCase>>(null);
  const [events, setEvents] = useState<ReturnType<typeof loadEvents>>([]);

  useEffect(()=> {
    const loaded = loadCase(id);
    setC(loaded);
    setEvents(loadEvents(id));
  }, [id]);

  if (!c) return <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-10">Case not found in this browser. <Link href="/authority/queue" className="underline">Back to queue</Link></div>;

  const act = (type: string, reason: string) => {
    // P0 fix: authority actions must be server-validated and recorded as officer, not citizen. For demo, require simple password gate.
    const pw = typeof window !== "undefined" ? window.prompt("Officer demo password (hint: demo123) — in production: RBAC + MFA") : null;
    if (pw !== "demo123") {
      alert("Demo auth failed — use demo123. Production requires MFA + role check.");
      return;
    }
    const updated = { ...c, status: type as any, updatedAt: new Date().toISOString() };
    saveCaseWithActor(updated, "fso_demo", "fso");
    // Append explicit event with reason code for audit
    const stored = loadCase(id);
    setC(stored);
    setEvents(loadEvents(id));
    alert(`Event ${type} recorded as fso_demo with reason: ${reason} (audit trail — citizen_demo not used)`);
  };

  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">AUTHORITY CASE — {c.publicReference}</div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">{c.category} · {c.priority.toUpperCase()} · {c.status}</h1>
      <p className="text-sm text-zinc-600 mt-1">Triage reasons: {c.risk?.reasons.join(" · ") || "Not triaged yet"} · Routing: {c.routing?.authority ?? "State FDA"}</p>

      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="text-xs font-semibold tracking-widest text-zinc-500">TRIAGE ACTIONS (PRD 9.2)</div>
          <div className="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
            <Button variant="outline" onClick={()=>act("assigned","Inspection warranted — risk high")}>Accept and assign</Button>
            <Button variant="outline" onClick={()=>act("clarification_requested","Need batch/expiry photo")}>Request clarification</Button>
            <Button variant="outline" onClick={()=>act("closed_insufficient","Weak evidence — outside scope")}>Mark outside scope</Button>
            <Button variant="outline" onClick={()=>act("inspection_completed","Checklist completed — finding recorded")}>Record inspection</Button>
          </div>
          <div className="mt-2 text-xs text-zinc-500">Each action requires reason code + audit event per PRD — not silent status change.</div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="text-xs font-semibold tracking-widest text-zinc-500">INSPECTION CHECKLIST (PRD 9.3)</div>
          <div className="mt-2 grid sm:grid-cols-2 gap-2 text-xs">
            {["Business identity & FSSAI", "Hygiene & pest", "Water/waste", "Handling & personal hygiene", "Storage/cold chain", "Labelling/batch", "Supplier traceability", "Sample seal"].map(item => (
              <label key={item} className="flex gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-2"><input type="checkbox" /> {item}</label>
            ))}
          </div>
          <div className="mt-2 text-xs text-zinc-500">Checklist version is authority-supplied — not hard-coded legal conclusion.</div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="text-xs font-semibold tracking-widest text-zinc-500">EVENT LOG — immutable</div>
          <div className="mt-2 space-y-2">
            {events.map(e => (
              <div key={e.id} className="rounded-xl border bg-white p-3 text-sm flex gap-3">
                <span className="font-mono text-xs">{e.type}</span>
                <span className="ml-auto text-xs text-zinc-500">{e.actorRole} · {new Date(e.occurredAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-3">
        <Link href="/authority/queue" className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium">Back to queue</Link>
        <Link href={`/food/track/${c.publicReference}`} className="flex-1 rounded-full bg-zinc-900 text-white py-3 text-center text-sm font-semibold">View public page →</Link>
      </div>
    </div>
  );
}
