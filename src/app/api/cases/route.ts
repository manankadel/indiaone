import { NextRequest, NextResponse } from "next/server";
import { makeRequestId } from "@/lib/api";

export const dynamic = "force-dynamic";

// Mock /v1/cases for hackathon — honest adapter: capability demo, not live FSSAI
// Production would persist to Postgres + event log + adapter

export async function POST(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") ?? makeRequestId();
  const body: any = await req.json().catch(()=> ({}));
  const category = body.category ?? "packaged";
  const publicReference = `MH-FDA-${new Date().getFullYear()}-${Math.floor(1000+Math.random()*9000)}`;
  return NextResponse.json({
    id: `case_${Math.random().toString(36).slice(2,8)}`,
    publicReference,
    category,
    status: "evidence_received",
    capability: "demo",
    nextAction: "Mock routed — State FDA Pune",
    requestId,
  }, { headers: { "x-request-id": requestId } });
}

export async function GET(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") ?? makeRequestId();
  return NextResponse.json({ ok:true, message:"Use browser-local foodRepo for demo. Production: Postgres. See /api/food/extract for versioned extraction.", requestId }, { headers: { "x-request-id": requestId } });
}
