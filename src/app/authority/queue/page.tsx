"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { loadAllCases } from "@/lib/foodRepo";
import type { FoodCase } from "@/lib/foodTypes";

export default function AuthorityQueuePage() {
  const [cases, setCases] = useState<FoodCase[]>([]);
  useEffect(()=> setCases(loadAllCases()), []);
  return (
    <div className="mx-auto max-w-[1160px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">AUTHORITY — QUEUE (PRD 9.1) · Mock auth</div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Officer queue — priority, map, duplicates</h1>
      <p className="text-sm text-zinc-600 mt-1">Filter: district, commodity, hazard. Action requires reason code + audit event. Demo: browser-local only.</p>

      <div className="mt-4 flex gap-2 text-xs">
        <span className="rounded-full bg-white border border-zinc-200 px-3 py-1">Filter: All</span>
        <span className="rounded-full bg-red-50 border border-red-200 px-3 py-1">High priority</span>
        <span className="rounded-full bg-zinc-100 border px-3 py-1">Duplicate clusters</span>
        <span className="rounded-full bg-zinc-100 border px-3 py-1">SLA at risk</span>
      </div>

      <div className="mt-4 grid gap-3">
        {cases.length===0 && <Card><CardContent className="p-6 text-sm text-zinc-600">No cases in this browser. Create one at <Link href="/food" className="underline">/food</Link> → it appears here (same device). Production: Postgres + PostGIS.</CardContent></Card>}
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
        Production: RBAC + MFA, PostgreSQL + PostGIS, event log immutable. No synthetic case leaves browser — officer sees only permissioned queue.
      </div>
    </div>
  );
}
