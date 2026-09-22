import { NextRequest, NextResponse } from "next/server";
import { makeRequestId } from "@/lib/api";
import { getServerCase, listServerCases, putServerCase } from "@/lib/serverFoodRepo";
import { createFoodCase } from "@/lib/foodRepo";
import type { FoodCategory } from "@/lib/foodTypes";
import { createDatabaseCase, databaseConfigured, getDatabaseCase, listDatabaseCases } from "@/lib/foodDatabase";
import { isAuthorityRequest } from "@/lib/authorityAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") ?? makeRequestId();
  const search = new URL(req.url).searchParams;
  const id = search.get("id");
  const q = search.get("q")?.toLowerCase().trim();
  if (process.env.NODE_ENV === "production" && !databaseConfigured()) return NextResponse.json({ code: "database_not_configured", message: "Service unavailable", requestId }, { status: 503 });
  if (!id && process.env.NODE_ENV === "production" && !(await isAuthorityRequest(req))) return NextResponse.json({ code: "authority_auth_required", message: "Authorised officer access required", requestId }, { status: 401 });
  let data = databaseConfigured() ? (id ? await getDatabaseCase(id) : await listDatabaseCases()) : (id ? getServerCase(id) : listServerCases());
  if (!id && q && Array.isArray(data)) data = data.filter(c => `${c.publicReference} ${c.category} ${c.jurisdictionId} ${c.subject.name ?? ""} ${c.subject.fssaiNumber ?? ""}`.toLowerCase().includes(q));
  return NextResponse.json({ data, requestId }, { headers: { "x-request-id": requestId } });
}

export async function POST(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") ?? makeRequestId();
  const body = await req.json().catch(() => ({})) as { category?: FoodCategory };
  const allowed: FoodCategory[] = ["packaged", "premises", "delivery", "illness"];
  if (!body.category || !allowed.includes(body.category)) return NextResponse.json({ code: "invalid_category", message: "Choose a food-safety category", requestId }, { status: 400 });
  if (process.env.NODE_ENV === "production" && !databaseConfigured()) return NextResponse.json({ code: "database_not_configured", message: "Service unavailable", requestId }, { status: 503 });
  const saved = databaseConfigured() ? await createDatabaseCase(body.category) : putServerCase(createFoodCase(body.category));
  // Duplicate clustering: same category within 24h → cluster (PRD §18) — simple in-memory for pilot, production would use PostGIS + FSSAI
  let duplicateInfo: { isDuplicate: boolean; clusterSize: number } | null = null;
  if (databaseConfigured()) {
    try {
      const all = await listDatabaseCases();
      const recent = all.filter(c => c.category === body.category && c.id !== saved.id && new Date(c.createdAt).getTime() > Date.now() - 24*60*60*1000);
      if (recent.length > 0) duplicateInfo = { isDuplicate: true, clusterSize: recent.length + 1 };
    } catch {}
  }
  return NextResponse.json({ data: { ...saved, duplicateCluster: duplicateInfo }, requestId }, { status: 201, headers: { "x-request-id": requestId } });
}
