"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Check, Clock, AlertCircle } from "lucide-react";
import { FOOD_STATUSES, FoodCase, FoodEvent } from "@/lib/foodTypes";

export default function FoodTrackRefPage() {
  const { publicReference } = useParams<{ publicReference: string }>();
  const [c, setC] = useState<FoodCase | null>(null);
  const [events, setEvents] = useState<FoodEvent[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch(`/api/food/cases/${encodeURIComponent(publicReference)}`).then(r=>r.ok ? r.json() : null).then(result=>{ setC(result?.data ?? null); setEvents(result?.events ?? []); }).finally(()=>setLoading(false)); }, [publicReference]);
  if (loading) return <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-10">Loading report…</div>;
  if (!c) {
    return (
      <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-10">
        <h1 className="text-xl font-semibold">Case not found</h1>
        <p className="text-sm text-zinc-600 mt-2">We could not find a report with reference <span className="font-mono">{publicReference}</span>. Check the number and try again.</p>
        <Link href="/food" className="mt-4 inline-flex rounded-full bg-zinc-900 text-white px-4 py-2 text-sm">Start a new report</Link>
      </div>
    );
  }


  const statusMeta = FOOD_STATUSES.find(s=>s.id===c!.status);

  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-emerald-700">PUBLIC CASE PAGE · {c!.publicReference}</div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${c!.status.startsWith("closed") ? "bg-zinc-400" : "bg-emerald-500 animate-pulse"}`} /> {statusMeta?.label ?? c!.status}
      </h1>
      <p className="text-sm text-zinc-600 mt-1">Category: {c!.category} · Priority: <span className="font-semibold uppercase">{c!.priority}</span> · Jurisdiction: {c!.jurisdictionId} · Responsible office: {c!.routing?.authority ?? "Being assigned"}</p>

      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="text-xs font-semibold tracking-widest text-zinc-500">EVIDENCE & SUBJECT</div>
          <div className="mt-2 text-sm">Evidence items: {c!.evidenceIds.join(", ") || "none"} · FSSAI: {c!.subject.fssaiNumber || "Not provided"} · Location: {c!.subject.addressCoarse || "Coarse GPS only"}</div>
          <div className="mt-2 text-xs text-zinc-500">Public page hides complainant name/contact, faces, exact home coordinates, officer personal phone.</div>
        </CardContent>
      </Card>

      <Card className="mt-4 border-red-200">
        <CardContent className="p-4">
          <div className="text-xs font-semibold tracking-widest text-zinc-500">WHAT THE FOOD-SAFETY TEAM DOES NEXT</div>
          <div className="mt-3 grid gap-2">
            {(c!.actionPlan ?? []).map(action => (
              <div key={action.id} className="flex gap-3 rounded-xl border border-zinc-200 bg-white p-3">
                <span className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${action.status === "completed" ? "bg-emerald-500" : "bg-amber-400"}`} />
                <div className="min-w-0"><div className="text-sm font-medium">{action.title}</div><div className="text-xs text-zinc-600">{action.description}</div><div className="mt-1 text-[11px] uppercase tracking-wide text-zinc-400">Owner: {action.owner.replace("_", " ")} · {action.dueLabel}</div></div>
              </div>
            ))}
          </div>
          {c!.linkedSubmissionCount && c!.linkedSubmissionCount > 1 && <div className="mt-3 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-900">{c!.linkedSubmissionCount} reports are linked to this food-safety case so the team can inspect one incident instead of processing duplicate forms.</div>}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="text-xs font-semibold tracking-widest text-zinc-500">WHAT HAS HAPPENED</div>
          <div className="mt-3 space-y-2">
            {events.length===0 && <div className="text-sm text-zinc-500">No events yet — draft.</div>}
            {events.map(e => (
              <div key={e.id} className="flex gap-3 rounded-xl border border-zinc-200 bg-white p-3">
                <span className={`h-6 w-6 grid place-items-center rounded-full text-xs ${e.visibility==="public" ? "bg-emerald-600 text-white" : "bg-zinc-200"}`}>{e.type[0].toUpperCase()}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{e.type} <span className="text-xs font-normal text-zinc-500">· {e.actorRole} · {new Date(e.occurredAt).toLocaleString()}</span></div>
                  {e.reasonCode && <div className="text-xs text-zinc-600">Reason: {e.reasonCode}</div>}
                </div>
                <span className="text-xs rounded-full border px-2 py-1 h-fit">{e.visibility}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4 border-amber-200 bg-amber-50">
        <CardContent className="p-4 flex gap-2 text-sm text-amber-900">
          <AlertCircle size={16} className="mt-0.5" /> Status updates are shown only after they are recorded by the responsible team.
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-3">
        <Link href="/food" className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium">New report</Link>
        <Link href="/" className="flex-1 rounded-full bg-zinc-900 text-white py-3 text-center text-sm font-semibold">Home</Link>
      </div>
    </div>
  );
}
