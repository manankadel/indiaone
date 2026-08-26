"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Phone, Shield, Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { logEvent } from "@/lib/analytics";
import { useI18n } from "@/lib/i18n/context";

const TASKS_HG = [
  { id: "1930", title: "1930 pe call karo", desc: "Paise abhi kate hon toh sabse pehle.", urgent: true },
  { id: "bank", title: "Bank ko bolo — card pe diye number se", desc: "SMS wale number pe call mat karo.", urgent: true },
  { id: "block", title: "UPI / Card block karo", desc: "Bank app me jaake block. Saboot delete mat karo.", urgent: false },
];

export default function ContainPage() {
  const { c, setStatus } = useStore();
  const { t } = useI18n();
  const [done, setDone] = useState<Record<string, boolean>>({});
  const router = useRouter();
  if (!c) return <div className="p-10 text-sm">Loading…</div>;
  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">STEP 1/7 · {t("contain.title")}</div>
      <h1 className="mt-2 text-[28px] font-semibold tracking-tight leading-none">Pehle — paise roko</h1>
      <p className="text-zinc-600 mt-1 text-sm">Tick sirf reminder hai. Hum call nahi karte.</p>

      <Card className="mt-4 border-amber-200 bg-amber-50">
        <CardContent className="p-4 flex gap-3">
          <Phone className="text-amber-800 mt-0.5" size={18} />
          <div className="flex-1">
            <div className="font-semibold text-amber-900">Abhi kate? — 1930</div>
            <div className="text-sm text-amber-800">Khula rakho, hum details ready rakhte hain.</div>
          </div>
          <a href="tel:1930" className="hidden sm:inline-flex h-10 rounded-full bg-amber-600 px-5 items-center text-sm font-semibold text-white">1930 Call</a>
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-3">
        {TASKS_HG.map(task => (
          <label key={task.id} className={`flex gap-3 rounded-2xl border p-4 cursor-pointer ${done[task.id] ? "bg-zinc-900 text-white border-zinc-900" : "bg-white border-zinc-200"}`}>
            <input type="checkbox" className="mt-1 h-5 w-5 accent-zinc-900" checked={!!done[task.id]} onChange={e=>setDone(s=> ({...s, [task.id]: e.target.checked}))} />
            <span className="flex-1">
              <span className={`block text-[16px] font-medium ${done[task.id] ? "text-white" : ""}`}>{task.title} {task.urgent && <span className="ml-2 rounded-full bg-[#FF5A1F] text-white px-2 py-0.5 text-xs">zaroori</span>}</span>
              <span className={`block text-sm ${done[task.id] ? "text-white/70" : "text-zinc-600"}`}>{task.desc}</span>
            </span>
            {done[task.id] && <Check size={16} className="text-white" />}
          </label>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-3 flex items-center gap-2 text-sm">
        <Shield size={14} /> Demo: ₹48,500 · HDFC UPI · Ref 321768904512 · 1 tap me aage.
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/" className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium">Back</Link>
        <Button variant="accent" size="lg" className="flex-1" onClick={()=>{ logEvent({ name:"containment_viewed", props:{ elapsed_bucket:"<30m" }}); setStatus("transaction"); router.push("/case/demo/transaction"); }}>Aage badho →</Button>
      </div>
      <p className="mt-3 text-xs text-zinc-500 text-center">Skip bhi kar sakte ho — force nahi.</p>
    </div>
  );
}
