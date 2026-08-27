"use client";
import { Card, CardContent } from "@/components/ui/Card";
import { Shield, Package, Store, Truck, HeartPulse, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FoodCategory } from "@/lib/foodTypes";

const CATS: { id: FoodCategory; title: string; desc: string; icon: any; chips: string[] }[] = [
  { id: "packaged", title: "Packaged food", desc: "Label, expiry, seal, foreign object, adulteration suspect", icon: Package, chips: ["No FSSAI", "Expired", "Seal broken"] },
  { id: "premises", title: "Food premises", desc: "Hygiene, pests, licence display, prohibited product", icon: Store, chips: ["Gutkha sale", "Dirty kitchen", "No licence display"] },
  { id: "delivery", title: "Delivery / storage", desc: "Temperature, torn pack, cold-chain, online order", icon: Truck, chips: ["Cold chain 12°C", "Torn pack", "Late delivery"] },
  { id: "illness", title: "Illness after food", desc: "Symptoms, time, people affected, meal/order", icon: HeartPulse, chips: ["4 people ill", "Same meal", "Hospital"] },
];

export default function FoodPage() {
  const router = useRouter();

  const start = async (cat: FoodCategory) => {
    const response = await fetch("/api/food/cases", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ category: cat }) });
    if (!response.ok) return;
    const { data } = await response.json();
    router.push(`/food/report/${data.id}`);
  };

  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <div className="inline-flex items-center gap-2 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-semibold text-red-700">
        <Shield size={12} /> Food safety
      </div>
      <h1 className="mt-3 text-[30px] font-semibold tracking-tight leading-none">What did you see or experience?</h1>
      <p className="text-sm text-zinc-600 mt-1">Choose the closest option. We’ll ask only what is needed to send a clear report.</p>

      <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
        Not sure who handles it? That’s okay. We’ll identify the right food-safety authority from the place and type of problem.
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

      <p className="mt-6 text-xs text-center text-zinc-500">If someone is seriously ill or in immediate danger, seek medical help first.</p>
    </div>
  );
}
