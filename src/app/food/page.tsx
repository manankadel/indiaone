"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Shield, Package, Store, Truck, HeartPulse, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { createFoodCase, saveCase } from "@/lib/foodRepo";
import type { FoodCategory } from "@/lib/foodTypes";

const CATS: { id: FoodCategory; title: string; desc: string; icon: any; chips: string[] }[] = [
  { id: "packaged", title: "Packaged food", desc: "Label, expiry, seal, foreign object, adulteration suspect", icon: Package, chips: ["No FSSAI", "Expired", "Seal broken"] },
  { id: "premises", title: "Food premises", desc: "Hygiene, pests, licence display, prohibited product", icon: Store, chips: ["Gutkha sale", "Dirty kitchen", "No licence display"] },
  { id: "delivery", title: "Delivery / storage", desc: "Temperature, torn pack, cold-chain, online order", icon: Truck, chips: ["Cold chain 12°C", "Torn pack", "Late delivery"] },
  { id: "illness", title: "Illness after food", desc: "Symptoms, time, people affected, meal/order", icon: HeartPulse, chips: ["4 people ill", "Same meal", "Hospital"] },
];

export default function FoodPage() {
  const router = useRouter();

  const start = (cat: FoodCategory) => {
    const c = createFoodCase(cat);
    // Pre-seed with one fixture per category for demo
    if (cat === "packaged") c.evidenceIds = ["fx_milk_packet"];
    if (cat === "premises") c.evidenceIds = ["fx_hotel_kitchen"];
    if (cat === "delivery") c.evidenceIds = ["fx_zepto_store"];
    if (cat === "illness") c.evidenceIds = ["fx_milk_packet", "fx_hotel_kitchen"];
    c.status = "evidence_received";
    saveCase(c);
    router.push(`/food/report/${c.id}`);
  };

  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <div className="inline-flex items-center gap-2 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-semibold text-red-700">
        <Shield size={12} /> PRD 8.2 — Choose what happened — food-only citizen flow
      </div>
      <h1 className="mt-3 text-[30px] font-semibold tracking-tight leading-none">What did you see or experience?</h1>
      <p className="text-sm text-zinc-600 mt-1">Tap one. You can add “Other” later — no long narrative required. All cases are synthetic demo data.</p>

      <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
        Not sure if this is FSSAI, State FDA or municipal? We will route it or explain why we cannot — and show what happens next. We never claim to be FSSAI.
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        {CATS.map(cat => {
          const Icon = cat.icon;
          return (
            <Card key={cat.id} className="hover:shadow-md transition cursor-pointer" onClick={()=>start(cat.id)}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 grid place-items-center rounded-xl bg-zinc-900 text-white"><Icon size={18} /></span>
                  <div className="font-semibold">{cat.title}</div>
                </div>
                <div className="text-sm text-zinc-600 mt-2">{cat.desc}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {cat.chips.map(ch => <span key={ch} className="rounded-full bg-zinc-100 border border-zinc-200 px-2.5 py-1 text-xs">{ch}</span>)}
                </div>
                <div className="mt-4 text-sm font-medium flex items-center gap-1">Start report <ArrowRight size={14} /></div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 flex items-center justify-between">
        <div className="text-sm">
          <div className="font-medium">Already have a reference?</div>
          <div className="text-zinc-600">Track a synthetic case: try <Link href="/food/track/milk" className="underline">milk</Link>, <Link href="/food/track/hotel" className="underline">hotel</Link>, <Link href="/food/track/zepto" className="underline">zepto</Link></div>
        </div>
        <Link href="/" className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium">Home</Link>
      </div>

      <p className="mt-3 text-xs text-center text-zinc-500">PRD Release 0 — credible prototype: citizen evidence → deterministic triage → mock routing → public timeline. No lab claim from photo.</p>
    </div>
  );
}
