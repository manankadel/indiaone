/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Shield, MapPin, Camera, Check, Clock, AlertTriangle } from "lucide-react";
import { SEEDED_FOOD_CASES } from "@/lib/fixtures";

type CaseKey = keyof typeof SEEDED_FOOD_CASES;

export default function FoodPage() {
  const router = useRouter();
  const [key, setKey] = useState<CaseKey>("milk");
  const c = SEEDED_FOOD_CASES[key];

  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <div className="inline-flex items-center gap-2 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-semibold text-red-700">
        <Shield size={12} /> FLAGSHIP · Mundhe Food Suraksha — Nationwide · Photo se Action
      </div>
      <h1 className="mt-3 text-[30px] font-semibold tracking-tight leading-none">Milawat dikha? Photo bhejo.</h1>
      <p className="text-sm text-zinc-600 mt-1">Mundhe FDA: 1,131 inspections, ₹49.57cr seized, 56 licences suspended — Indian Express July 2026. Ab poore India ke liye — 1 photo, 72h action.</p>

      <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900 flex gap-2">
        <AlertTriangle size={16} className="mt-0.5" /> Nationwide: State FDA + FSSAI + Central. Photo GPS se ward auto — address type nahi. Cost recovery owner se (NMMC style).
      </div>

      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="text-xs font-semibold tracking-widest text-zinc-500">3 MUNDHE CASES — 1 TAP ME LOAD (synthetic)</div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(Object.keys(SEEDED_FOOD_CASES) as CaseKey[]).map(k => (
              <button key={k} onClick={()=>setKey(k)} className={`rounded-xl border p-3 text-left ${key===k ? "bg-zinc-900 text-white border-zinc-900" : "bg-white border-zinc-200"}`}>
                <div className="text-sm font-medium">{SEEDED_FOOD_CASES[k].label.split("—")[0]}</div>
                <div className={`text-xs ${key===k ? "text-white/70" : "text-zinc-500"}`}>{SEEDED_FOOD_CASES[k].violation.slice(0,28)}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4 overflow-hidden">
        <div className="bg-zinc-900 text-white px-4 py-2 text-xs flex items-center justify-between">
          <span className="flex items-center gap-2"><Camera size={14} /> Photo + GPS — no typing</span><span className="opacity-70">mock</span>
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 flex gap-3">
            <img alt="evidence" src={`https://picsum.photos/seed/${key}/80/80`} className="h-20 w-20 rounded-xl object-cover border" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{c.shop}</div>
              <div className="text-xs text-zinc-600 flex items-center gap-1"><MapPin size={12} /> Auto GPS 18.98, 75.78 · Ward A — Beed · No address typing</div>
              <div className="mt-2 inline-flex rounded-full bg-white border border-zinc-200 px-2.5 py-1 text-xs">{c.violation}</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-white border border-zinc-200 p-3">
              <div className="text-xs font-semibold tracking-widest text-zinc-500">VIOLATION CHIP — 1 TAP</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  c.violation.includes("FSSAI") ? "No FSSAI" : "No display",
                  c.violation.includes("Gutkha") ? "Gutkha" : "Cold chain",
                  "Hygiene fail",
                ].map(v => (
                  <span key={v} className="rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-medium text-red-700">{v}</span>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-white border border-zinc-200 p-3">
              <div className="text-xs font-semibold tracking-widest text-zinc-500">FSSAI CHECK — AUTO</div>
              <div className="mt-1 font-mono text-sm">{c.facts.find(f=>f.field==="fssai_number")?.value ?? "Not displayed"}</div>
              <div className="text-xs text-zinc-500">Source: photo excerpt · AI extracts, you confirm</div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-3">
            <div className="text-xs font-semibold tracking-widest text-zinc-500">72H TIMELINE — OWNER PUBLIC (Mundhe style)</div>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex gap-2"><Check size={14} className="text-emerald-600 mt-0.5" /> Day 0: Photo + GPS → Ward A Officer (name public, like suspended 10 in Navi Mumbai)</div>
              <div className="flex gap-2"><Clock size={14} className="text-zinc-500 mt-0.5" /> Day 1: Notice MRTP/FSS Act → Owner pays, not taxpayer</div>
              <div className="flex gap-2"><Shield size={14} className="text-red-600 mt-0.5" /> Day 3: Seizure/Demolition → Cost recovered from owner (NMMC 12,687 illegal, 1,804 razed)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-3 flex gap-3">
        <input type="checkbox" id="consent-food" defaultChecked className="mt-1 h-5 w-5" />
        <label htmlFor="consent-food" className="text-sm">Samajh gaya — <b>mock</b> hai. No real FDA call. Photo synthetic, GPS mock. 72h SLA is Mundhe time-bound principle.</label>
      </div>

      <div className="mt-6 flex gap-3">
        <Button variant="accent" size="lg" className="flex-1" onClick={()=>router.push(`/food/track?k=${key}`)}>Mock FDA ko bhejo →</Button>
        <Button variant="outline" onClick={()=>router.push("/")}>Back</Button>
      </div>

      <div className="mt-3 text-xs text-center text-zinc-500">Nationwide: MH → DL → TN same flow, state FDA auto-routed by GPS. Walk with Commissioner = weekly live + async voice — time-bound, result-oriented.</div>
    </div>
  );
}
