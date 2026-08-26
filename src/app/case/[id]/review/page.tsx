"use client";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export default function ReviewPage() {
  const { c, mockSubmit } = useStore();
  const { t } = useI18n();
  const router = useRouter();
  const [consent, setConsent] = useState(false);
  if (!c) return <div className="p-10 text-sm">Loading…</div>;
  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">STEP 6/7 · {t("review.title")}</div>
      <h1 className="mt-2 text-[28px] font-semibold tracking-tight leading-none">Ek baar dekh lo</h1>
      <p className="text-sm text-zinc-600">{t("review.sub")} — 3 bullets, no para.</p>

      <Card className="mt-4">
        <CardContent className="p-4 space-y-3 text-sm">
          <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3 flex items-center justify-between"><span>💸 {c.transaction?.rail} · ₹{c.transaction?.amount.toLocaleString("en-IN")} · {c.transaction?.reference}</span><span className="text-xs bg-white border rounded-full px-2 py-1">tap to edit</span></div>
          <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">🧾 {c.evidenceIds.length} saboot · {c.evidenceIds.join(", ")}</div>
          <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">📝 {c.statement.slice(0, 120)}…</div>
          <div className="text-xs text-zinc-500">Bhejne par → <span className="font-mono">mock</span> bank + portal. Koi real nahi.</div>
        </CardContent>
      </Card>

      <label className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 flex gap-3 cursor-pointer">
        <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} className="mt-1 h-5 w-5" />
        <span className="text-sm"><b>Samajh gaya — ye mock hai.</b> Koi real report nahi jayega. Browser me hi, 24h me expire.</span>
      </label>

      <div className="mt-6 flex gap-3">
        <Link href="/case/demo/statement" className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium">Edit</Link>
        <Button variant="accent" size="lg" className="flex-1" disabled={!consent} onClick={()=>{ mockSubmit(); router.push("/case/demo/submitted"); }}>
          Mock bhejo →
        </Button>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500"><ShieldAlert size={14} />Double tap bhi ek hi mock. Koi fake call nahi.</div>
    </div>
  );
}
