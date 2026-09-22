import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { ShieldCheck } from "lucide-react";

export default function FboLandingPage() {
  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-8">
      <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900 text-white px-3 py-1 text-xs font-semibold"><ShieldCheck size={12} /> FBO Portal — Due process</div>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Food business — see notice, respond, correct</h1>
      <p className="text-sm text-zinc-600 mt-2">You received a verified notice about a reported concern. You can respond with evidence, correct a factual error, and see the official outcome. Public pages show <i>reported concern</i> until inspection.</p>

      <Card className="mt-6">
        <CardContent className="p-5">
          <div className="text-sm font-semibold">How it works (PRD §10)</div>
          <ol className="mt-3 space-y-2 text-sm list-decimal pl-5">
            <li>Notice shows reported concern + evidence (redacted), not guilt.</li>
            <li>You have a response window — upload licence, invoice, corrective action.</li>
            <li>Inspection outcome → you see result → appeal if allowed.</li>
            <li>Public page stays <i>reported concern</i> until authority event.</li>
          </ol>
        </CardContent>
      </Card>

      <div className="mt-6">
        <div className="text-xs font-semibold tracking-widest text-zinc-500">TRY A SYNTHETIC BUSINESS CASE</div>
        <div className="mt-2 grid sm:grid-cols-3 gap-3">
          {[
            { id: "milk", label: "Village Kirana — Milk" },
            { id: "hotel", label: "Shiv Sagar Hotel" },
            { id: "zepto", label: "Zepto Dark Store" },
          ].map(c => (
            <Link key={c.id} href={`/fbo/cases/${c.id}`} className="rounded-2xl border border-zinc-200 bg-white p-4 hover:shadow-md transition">
              <div className="font-medium">{c.label}</div>
              <div className="text-xs text-zinc-500 mt-1">View notice → Respond</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
        Demo: No real business is notified. Synthetic shop names only. Production requires verified FSSAI business identity and signed notice.
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/food" className="rounded-full bg-zinc-900 text-white px-6 py-3 text-sm font-semibold">Report as citizen</Link>
        <Link href="/authority/queue" className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium">Officer queue</Link>
      </div>
    </div>
  );
}
