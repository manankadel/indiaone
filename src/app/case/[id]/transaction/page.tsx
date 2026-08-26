"use client";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { CitizenCase } from "@/lib/types";
import { useI18n } from "@/lib/i18n/context";

export default function TransactionPage() {
  const { c, setCase, setStatus } = useStore();
  const { t } = useI18n();
  const router = useRouter();
  const [form, setForm] = useState<NonNullable<CitizenCase["transaction"]>>(c?.transaction ?? {
    rail: "UPI" as const, amount: 48500, occurredAt: "2026-08-26T11:42", reference: "321768904512", institution: "HDFC Bank · UPI via PhonePe", recipient: "collect@oksbi", authorized: false
  });
  if (!c) return <div className="p-10 text-sm">Loading…</div>;
  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">STEP 2/7 · {t("transaction.title")}</div>
      <h1 className="mt-2 text-[28px] font-semibold tracking-tight leading-none">Kitna, kab kata?</h1>
      <p className="text-zinc-600 mt-1 text-sm">{t("transaction.sub")}</p>

      <Card className="mt-4">
        <CardContent className="p-4 space-y-4">
          <div>
            <div className="text-xs font-semibold tracking-widest text-zinc-500">KAUN SA? — 1 TAP</div>
            <div className="mt-2 flex gap-2">
              {(["UPI","Card","Wallet","BankTransfer"] as const).map(r => (
                <button key={r} onClick={()=>setForm({...form, rail: r})} className={`rounded-full border px-4 py-2 text-sm font-medium ${form.rail===r ? "bg-zinc-900 text-white border-zinc-900" : "bg-white border-zinc-300"}`}>{r}</button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
              <div className="text-xs font-medium text-zinc-500">AMOUNT · AI bhara, aap confirm</div>
              <div className="mt-1 text-xl font-semibold">₹{form.amount.toLocaleString("en-IN")}</div>
              <div className="mt-2 flex gap-2">
                {[48500,7500,12999].map(v=> <button key={v} onClick={()=>setForm({...form, amount:v})} className="rounded-full bg-white border border-zinc-200 px-3 py-1 text-xs">₹{v.toLocaleString("en-IN")}</button>)}
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
              <div className="text-xs font-medium text-zinc-500">KAB? — 1 TAP</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button onClick={()=>setForm({...form, occurredAt: new Date().toISOString().slice(0,16)})} className="rounded-full bg-white border border-zinc-200 px-3 py-1.5 text-xs">{t("chip.now")}</button>
                <button onClick={()=>setForm({...form, occurredAt: "2026-08-26T11:42"})} className="rounded-full bg-white border border-zinc-200 px-3 py-1.5 text-xs">{t("chip.today")} 11:42</button>
                <button onClick={()=>setForm({...form, occurredAt: "2026-08-25T18:20"})} className="rounded-full bg-white border border-zinc-200 px-3 py-1.5 text-xs">{t("chip.yesterday")}</button>
              </div>
              <div className="mt-2 text-xs font-mono bg-white border border-zinc-200 rounded-lg px-2 py-1">{form.occurredAt}</div>
            </div>
          </div>

          <details className="rounded-xl border border-zinc-200 bg-white">
            <summary className="px-4 py-3 text-sm font-medium cursor-pointer">Details edit karo? (optional)</summary>
            <div className="px-4 pb-4 grid sm:grid-cols-2 gap-3">
              <label className="space-y-1"><span className="text-xs font-medium">Ref / UTR</span><input value={form.reference} onChange={e=>setForm({...form, reference:e.target.value})} className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm" placeholder="321768904512" /></label>
              <label className="space-y-1"><span className="text-xs font-medium">Bank / Wallet</span><input value={form.institution} onChange={e=>setForm({...form, institution:e.target.value})} className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm" /></label>
              <label className="space-y-1 sm:col-span-2"><span className="text-xs font-medium">Payee</span><input value={form.recipient} onChange={e=>setForm({...form, recipient:e.target.value})} className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm" /></label>
            </div>
          </details>
        </CardContent>
      </Card>

      <div className="mt-3 text-xs text-zinc-500">Browser me hi save. Type karna zaroori nahi — chips se kaam chalega. Dono haath se bina typing.</div>

      <div className="mt-6 flex gap-3">
        <Link href="/case/demo/contain" className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium">Back</Link>
        <Button variant="accent" size="lg" className="flex-1" onClick={() => { setCase({ ...c, transaction: form, status: "evidence" }); setStatus("evidence"); router.push("/case/demo/evidence"); }}>Saboot jodo →</Button>
      </div>
    </div>
  );
}
