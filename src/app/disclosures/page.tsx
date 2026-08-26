import { Card, CardContent } from "@/components/ui/Card";

export default function Disclosures() {
  return (
    <div className="mx-auto max-w-[1160px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">HONESTY · REAL / MOCKED / PLANNED</div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">What works, what’s mocked, what production needs</h1>
      <p className="mt-2 text-zinc-600 max-w-3xl">This prototype never calls a live government system, never uses private APIs, never stores real Aadhaar/PAN/OTP/payment. All integrations are deterministic simulations.</p>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <Card className="border-emerald-200"><CardContent className="p-5"><div className="font-semibold text-emerald-800">Works in prototype</div><ul className="mt-2 text-sm text-zinc-700 list-disc pl-5 space-y-1"><li>Intent-first routing, workflow engine, form validation, autosave, case timeline</li><li>Synthetic fixture selection, source-linked extraction (deterministic fallback)</li><li>Editable statement, missing-evidence rules, review, idempotent mock submit</li><li>Responsive 360px, keyboard, focus, 200% zoom, reduced-motion</li><li>Public link, seeded demo, resume, expiry 24h</li></ul></CardContent></Card>
        <Card className="border-amber-200 bg-amber-50"><CardContent className="p-5"><div className="font-semibold text-amber-900">Mocked (deterministic simulation)</div><ul className="mt-2 text-sm text-amber-900 list-disc pl-5 space-y-1"><li>Bank alert: accepted mock ref BANK-ALERT-MOCK-77319</li><li>Portal submission: acknowledged mock ref IND-CYBER-2026-88471</li><li>OTP: “Send demo code” reveals/demo-accepts — no SMS</li><li>Status transitions: demo-seeded timeline</li><li>Payment, e-verification, SRN/PNR/ACK numbers: synthetic</li></ul></CardContent></Card>
        <Card><CardContent className="p-5"><div className="font-semibold">Production dependency</div><ul className="mt-2 text-sm text-zinc-700 list-disc pl-5 space-y-1"><li>Authorized bank notification channel (contracted, authenticated)</li><li>Official cybercrime submission/status API if offered & approved</li><li>Identity: approved government identity + DigiLocker consent</li><li>Audit, data residency, CERT-In 180-day log, DPDP compliance</li><li>Ops owners: routing, retention, abuse, appeal, correction requests</li></ul></CardContent></Card>
      </div>

      <div className="mt-6 rounded-[20px] border border-zinc-200 bg-white p-6">
        <div className="font-semibold">Safety labels — shown before & after every simulated action</div>
        <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">“Simulate report submission” — never “Submit complaint”</div>
          <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">“Mock/simulated” beside every reference ID</div>
          <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">“We cannot contact 1930/bank” — persistent banner</div>
          <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">Evidence gate: “Demo only — do not upload real data”</div>
        </div>
      </div>

      <div className="mt-6 text-xs text-zinc-500">Authoritative sources: cybercrime.gov.in (1930), GIGW 3.0, WCAG 2.2, DPDP Act 2023, CERT-In Directions. No live system tested. No scraping.</div>
    </div>
  );
}
