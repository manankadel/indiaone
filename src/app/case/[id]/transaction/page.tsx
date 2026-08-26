"use client";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useState } from "react";

export default function TransactionPage() {
  const { c, setCase, setStatus } = useStore();
  const [form, setForm] = useState(c?.transaction ?? {
    rail: "UPI" as const, amount: 48500, occurredAt: "2026-08-26T11:42", reference: "321768904512", institution: "HDFC Bank · UPI via PhonePe", recipient: "collect@oksbi", authorized: false as boolean
  });
  if (!c) return <div className="p-10 text-sm">Loading…</div>;
  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">STEP 2 OF 7 · TRANSACTION</div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">What was taken, when?</h1>
      <p className="text-zinc-600 mt-1 text-sm">Manual entry always works. Unknown is allowed — we’ll mark it as missing evidence instead of forcing you to invent data.</p>

      <Card className="mt-4">
        <CardHeader className="pb-2"><div className="text-sm font-semibold">Transaction facts</div><div className="text-xs text-zinc-500">Currency: INR · Screen-reader legible · Validation on blur</div></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <label className="space-y-1"> <span className="text-xs font-medium">Payment rail *</span>
            <select value={form.rail} onChange={e=>setForm({...form, rail: e.target.value as any})} className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm">
              <option>UPI</option><option>Card</option><option>BankTransfer</option><option>Wallet</option>
            </select>
          </label>
          <label className="space-y-1"> <span className="text-xs font-medium">Amount (INR) *</span>
            <input type="number" value={form.amount} onChange={e=>setForm({...form, amount: Number(e.target.value)})} className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm" />
          </label>
          <label className="space-y-1"> <span className="text-xs font-medium">Date & time *</span>
            <input type="datetime-local" value={form.occurredAt} onChange={e=>setForm({...form, occurredAt: e.target.value})} className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm" />
          </label>
          <label className="space-y-1"> <span className="text-xs font-medium">Reference / UTR (or Unknown)</span>
            <input value={form.reference} onChange={e=>setForm({...form, reference: e.target.value})} placeholder="321768904512 or Unknown" className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm" />
          </label>
          <label className="space-y-1"> <span className="text-xs font-medium">Sending bank / wallet *</span>
            <input value={form.institution} onChange={e=>setForm({...form, institution: e.target.value})} className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm" />
          </label>
          <label className="space-y-1"> <span className="text-xs font-medium">Recipient / payee</span>
            <input value={form.recipient} onChange={e=>setForm({...form, recipient: e.target.value})} placeholder="collect@oksbi" className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm" />
          </label>
          <label className="sm:col-span-2 flex gap-2 items-center text-sm"><input type="checkbox" checked={form.authorized} onChange={e=>setForm({...form, authorized: e.target.checked})} /> I authorized this transaction</label>
        </CardContent>
      </Card>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600">We store this only as a synthetic case in your browser. Autosave idle + on navigate. No real OTP. Refresh keeps progress.</div>

      <div className="mt-6 flex gap-3">
        <a href="/case/demo/contain" className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium">Back</a>
        <Button variant="accent" size="lg" className="flex-1" onClick={() => {
          setCase({ ...c, transaction: form as any, status: "evidence" });
          setStatus("evidence"); location.href="/case/demo/evidence";
        }}>Save & continue to evidence →</Button>
      </div>
    </div>
  );
}
