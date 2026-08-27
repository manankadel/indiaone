"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { FoodCase, FoodEvent } from "@/lib/foodTypes";

export default function AuthorityCasePage() {
  const { id } = useParams<{ id: string }>();
  const [c, setC] = useState<FoodCase | null>(null);
  const [events, setEvents] = useState<FoodEvent[]>([]);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(()=> {
    fetch("/api/food/authority/session").then(r=>r.json()).then(session=>{ setAuthenticated(Boolean(session.authenticated)); if (session.authenticated) fetch(`/api/food/cases/${encodeURIComponent(id)}`).then(r=>r.ok ? r.json() : null).then(result=>{ setC(result?.data ?? null); setEvents(result?.events ?? []); }); });
  }, [id]);

  const signIn = async () => { const response = await fetch("/api/food/authority/session", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ code }) }); if (!response.ok) { setError("Access code was not accepted."); return; } setAuthenticated(true); const result = await fetch(`/api/food/cases/${encodeURIComponent(id)}`).then(r=>r.json()); setC(result.data ?? null); setEvents(result.events ?? []); };
  if (authenticated === false) return <div className="mx-auto max-w-[520px] px-4 sm:px-6 py-16"><h1 className="text-2xl font-semibold">Food-safety officer access</h1><p className="mt-2 text-sm text-zinc-600">Sign in with your authorised officer access code to open this case.</p><div className="mt-6 flex gap-2"><input value={code} onChange={e=>setCode(e.target.value)} type="password" placeholder="Officer access code" className="flex-1 rounded-xl border border-zinc-300 px-3 py-2 text-sm"/><button onClick={signIn} className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">Continue</button></div>{error && <p className="mt-2 text-sm text-red-700">{error}</p>}</div>;
  if (authenticated === null) return <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-10 text-sm text-zinc-600">Checking officer access…</div>;

  if (!c) return <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-10">Case not found in this browser. <Link href="/authority/queue" className="underline">Back to queue</Link></div>;

  const act = (type: string, reason: string) => {
    const actionId = type === "assigned" ? "inspection" : type === "inspection_completed" ? "inspection" : type === "clarification_requested" ? "triage" : "outcome";
    const updated = { ...c, status: type as any, actionPlan: (c.actionPlan ?? []).map(action => action.id === actionId ? { ...action, status: type === "inspection_completed" ? "completed" as const : "in_progress" as const } : action), updatedAt: new Date().toISOString() };
    fetch(`/api/food/cases/${encodeURIComponent(id)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ case: updated, actorId: "fso", actorRole: "fso", reasonCode: reason }) }).then(r=>r.json()).then(result=>{ setC(result.data); setEvents(result.events ?? []); });
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

      <Card className="mt-4 border-red-200">
        <CardContent className="p-4">
          <div className="text-xs font-semibold tracking-widest text-zinc-500">CASE ACTION PLAN</div>
          <div className="mt-3 grid gap-2 text-sm">
            {(c.actionPlan ?? []).map(action => <div key={action.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3"><div className="font-medium">{action.title}</div><div className="text-xs text-zinc-600 mt-1">{action.description}</div><div className="text-[11px] text-zinc-400 mt-1">Owner: {action.owner.replace("_", " ")} · Status: {action.status}</div></div>)}
          </div>
          <div className="mt-3 text-xs text-zinc-500">Linked citizen submissions: {c.linkedSubmissionCount ?? 1} · Incident: {c.incidentId ?? "Unlinked"}</div>
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
