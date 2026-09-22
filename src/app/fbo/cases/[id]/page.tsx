"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SEEDED_FOOD_CASES } from "@/lib/fixtures";

export default function FboCasePage() {
  const { id } = useParams<{ id: string }>();
  const c = (SEEDED_FOOD_CASES as any)[id] as any;
  const [response, setResponse] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!c) return <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-10">Business case not found. <Link href="/fbo" className="underline">Back</Link></div>;

  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-6">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">FBO NOTICE — {c.label.toUpperCase()}</div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">You have a reported concern to respond to</h1>
      <p className="text-sm text-zinc-600 mt-1">This is a <b>reported concern</b>, not a finding of guilt. You can respond with documents. Public page stays redacted until inspection.</p>

      <Card className="mt-4 border-amber-200 bg-amber-50">
        <CardContent className="p-4 text-sm text-amber-900">
          <div className="font-semibold">What was reported</div>
          <div className="mt-1">Shop: {c.shop} · Violation (reported): {c.violation}</div>
          <div className="mt-1 text-xs">Source: synthetic photo + citizen concern chips. Officer must verify.</div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="text-xs font-semibold tracking-widest text-zinc-500">YOUR RESPONSE — correction / evidence</div>
          <textarea value={response} onChange={e=>setResponse(e.target.value)} placeholder="Example: FSSAI 11524035001234 valid till 2027, see attached licence. Kitchen cleaned, pest control done 26 Aug." rows={4} className="mt-2 w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm" />
          <div className="mt-2 flex gap-2">
            <Button variant="outline" size="sm" onClick={()=> alert("Demo: licence upload would go to private vault, SHA-256, officer sees it.")}>Upload licence / invoice</Button>
            <Button variant="outline" size="sm" onClick={()=> alert("Demo: correction creates review task, public page stays reported concern.")}>Request correction of fact</Button>
          </div>
          <div className="mt-4 flex gap-3">
            <Button variant="accent" disabled={!response.trim() || submitted} onClick={()=> setSubmitted(true)}>{submitted ? "Response recorded (mock)" : "Submit response →"}</Button>
            {submitted && <span className="text-xs text-emerald-700 py-2">Recorded as FBO — officer will see it. Public page not updated until inspection.</span>}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="text-xs font-semibold tracking-widest text-zinc-500">OFFICIAL OUTCOME</div>
          <div className="mt-2 text-sm">Inspection not yet recorded. After officer completes checklist, you will see <i>inspection_completed</i> and can appeal if allowed per SOP.</div>
          <div className="mt-2 text-xs text-zinc-500">Due process is a feature — appeal and retraction are first-class states per PRD §6.</div>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-3">
        <Link href="/fbo" className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium">Back to FBO</Link>
        <Link href={`/food/track/${id}`} className="flex-1 rounded-full bg-zinc-900 text-white py-3 text-center text-sm font-semibold">See public page (redacted) →</Link>
      </div>
    </div>
  );
}
