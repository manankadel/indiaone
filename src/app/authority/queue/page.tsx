"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import type { FoodCase } from "@/lib/foodTypes";

export default function AuthorityQueuePage() {
  const [cases, setCases] = useState<FoodCase[]>([]);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  useEffect(()=> { fetch("/api/food/authority/session").then(r=>r.json()).then(session=>{ setAuthenticated(Boolean(session.authenticated)); if (session.authenticated) fetch("/api/food/cases").then(r=>r.json()).then(result=>setCases(result.data ?? [])); }); }, []);
  const signIn = async () => { const response = await fetch("/api/food/authority/session", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ code }) }); if (!response.ok) { setError("Access code was not accepted."); return; } setAuthenticated(true); const result = await fetch("/api/food/cases").then(r=>r.json()); setCases(result.data ?? []); };
  if (authenticated === false) return <div className="mx-auto max-w-[520px] px-4 sm:px-6 py-16"><h1 className="text-2xl font-semibold">Food-safety officer access</h1><p className="mt-2 text-sm text-zinc-600">This workspace is for authorised food-safety staff. Citizens can report or track a case from the main menu.</p><div className="mt-6 flex gap-2"><input value={code} onChange={e=>setCode(e.target.value)} type="password" placeholder="Officer access code" className="flex-1 rounded-xl border border-zinc-300 px-3 py-2 text-sm"/><button onClick={signIn} className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">Continue</button></div>{error && <p className="mt-2 text-sm text-red-700">{error}</p>}</div>;
  if (authenticated === null) return <div className="mx-auto max-w-[1160px] px-4 sm:px-6 py-10 text-sm text-zinc-600">Checking officer access…</div>;
  return (
    <div className="mx-auto max-w-[1160px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">AUTHORITY — CASE QUEUE</div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Officer queue — priority, map, duplicates</h1>
      <p className="text-sm text-zinc-600 mt-1">Cases are ordered by urgency. Open a case to assign an officer, record action and publish a verified update.</p>

      <div className="mt-4 flex gap-2 text-xs">
        <span className="rounded-full bg-white border border-zinc-200 px-3 py-1">Filter: All</span>
        <span className="rounded-full bg-red-50 border border-red-200 px-3 py-1">High priority</span>
        <span className="rounded-full bg-zinc-100 border px-3 py-1">Duplicate clusters</span>
        <span className="rounded-full bg-zinc-100 border px-3 py-1">SLA at risk</span>
      </div>

      <div className="mt-4 grid gap-3">
        {cases.length===0 && <Card><CardContent className="p-6 text-sm text-zinc-600">No open cases are assigned to this queue.</CardContent></Card>}
        {cases.map(c => (
          <Link key={c.id} href={`/authority/cases/${c.id}`}>
            <Card className="hover:shadow-md transition">
              <CardContent className="p-4 flex gap-3">
                <span className={`h-2 w-2 rounded-full mt-2 ${c.priority==="critical"?"bg-red-600":c.priority==="high"?"bg-amber-500":"bg-zinc-400"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{c.publicReference} · {c.category} · {c.priority.toUpperCase()} · {c.status}</div>
                  <div className="text-xs text-zinc-500 truncate">Evidence: {c.evidenceIds.join(", ") || "none"} · Subject FSSAI: {c.subject.fssaiNumber || "—"}</div>
                  <div className="text-xs text-zinc-500">{new Date(c.createdAt).toLocaleString()} · {c.jurisdictionId}</div>
                </div>
                <span className="text-xs rounded-full border bg-white px-2 py-1 h-fit">{c.status}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600">
        Officer actions are permissioned and recorded in the case history. Citizens see only verified public updates.
      </div>
    </div>
  );
}
