"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Phone, Shield, Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { logEvent } from "@/lib/analytics";

const TASKS = [
  { id: "1930", title: "Call 1930 — National Cybercrime helpline", desc: "For financial fraud, seconds matter. We’ll prep your transaction facts while you call.", action: "tel:1930", urgent: true },
  { id: "bank", title: "Contact your bank via number on card / official app", desc: "Don’t use a number from SMS. Verifiable channel only.", urgent: true },
  { id: "block", title: "Block UPI / card if you suspect access", desc: "Inside your bank app → block card / disable UPI. Don’t delete evidence.", urgent: false },
  { id: "preserve", title: "Preserve evidence — don’t delete SMS / screenshots", desc: "We’ll structure them next. An accurate record = faster acknowledgement.", urgent: false },
];

export default function ContainPage() {
  const { c, setStatus } = useStore();
  const [done, setDone] = useState<Record<string, boolean>>({});
  const router = useRouter();
  if (!c) return <div className="p-10 text-sm">Loading…</div>;
  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">FRAUD FIRST AID · STEP 1 OF 7</div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">First — contain and preserve</h1>
      <p className="text-zinc-600 mt-1">We’re an independent prototype. We cannot contact your bank or police. Checking a box only records your acknowledgement — it doesn’t make a real call.</p>

      <Card className="mt-4 border-amber-200 bg-amber-50">
        <CardContent className="p-4 flex gap-3">
          <Phone className="text-amber-800 mt-0.5" size={18} />
          <div className="flex-1">
            <div className="font-semibold text-amber-900">If money just left — call 1930 now</div>
            <div className="text-sm text-amber-800">Keep this page open. Tap below when you’re ready to continue reporting.</div>
          </div>
          <a href="tel:1930" className="hidden sm:inline-flex h-10 rounded-full bg-amber-600 px-5 items-center text-sm font-semibold text-white">Call 1930</a>
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-3">
        {TASKS.map(t => (
          <label key={t.id} className={`flex gap-3 rounded-2xl border p-4 cursor-pointer ${done[t.id] ? "bg-zinc-900 text-white border-zinc-900" : "bg-white border-zinc-200"}`}>
            <input type="checkbox" className="mt-1" checked={!!done[t.id]} onChange={e=>setDone(s=> ({...s, [t.id]: e.target.checked}))} />
            <span className="flex-1">
              <span className={`block text-sm font-medium ${done[t.id] ? "text-white" : ""}`}>{t.title} {t.urgent && <span className="ml-2 rounded-full bg-[#FF5A1F] text-white px-2 py-0.5 text-xs">urgent</span>}</span>
              <span className={`block text-sm ${done[t.id] ? "text-white/70" : "text-zinc-600"}`}>{t.desc}</span>
            </span>
            {done[t.id] && <Check size={16} className="text-white" />}
          </label>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4">
        <div className="text-sm font-medium flex items-center gap-2"><Shield size={16} /> Demo mode</div>
        <p className="text-sm text-zinc-600">Reviewer path uses synthetic data: ₹48,500 · HDFC Bank · UPI via PhonePe · Ref 321768904512 · No real OTP, no real call.</p>
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/" className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium">Back</Link>
        <Button variant="accent" size="lg" className="flex-1" onClick={()=>{ logEvent({ name:"containment_viewed", props:{ elapsed_bucket:"<30m" }}); setStatus("transaction"); router.push("/case/demo/transaction"); }}>Continue reporting →</Button>
      </div>
      <p className="mt-3 text-xs text-zinc-500 text-center">You can continue without marking tasks complete — we warn but don’t trap you.</p>
    </div>
  );
}
