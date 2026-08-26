"use client";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("citizen@indiaone.demo");
  const [pw, setPw] = useState("demo1234");
  const router = useRouter();
  return (
    <div className="mx-auto max-w-[480px] px-4 sm:px-6 py-10">
      <div className="text-xs font-semibold tracking-widest text-zinc-500">MOCK CONSUMER LOGIN</div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Reviewer login</h1>
      <p className="text-sm text-zinc-600 mt-1">All accounts are mock/synthetic. No real OTP or password is used. Credentials are shown here and in submission notes.</p>
      <Card className="mt-6">
        <CardContent className="p-5 space-y-4">
          <label className="block space-y-1"><span className="text-xs font-medium">Email</span><input value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm" /></label>
          <label className="block space-y-1"><span className="text-xs font-medium">Password (mock)</span><input value={pw} onChange={e=>setPw(e.target.value)} className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm" /></label>
          <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3 text-xs text-zinc-600">Mock creds: <b>citizen@indiaone.demo / demo1234</b> · Another: <b>asha.demo@indiaone.demo / demo1234</b> · No OTP sent — “Send demo code” auto-accepts <b>000000</b>.</div>
          <Button variant="accent" size="lg" className="w-full" onClick={()=>router.push("/#start")}>Enter as mock citizen →</Button>
          <div className="text-xs text-center text-zinc-500">Or skip login → <a href="/#start" className="underline">Start Fraud First Aid without login</a> (emergency content is public).</div>
        </CardContent>
      </Card>
    </div>
  );
}
