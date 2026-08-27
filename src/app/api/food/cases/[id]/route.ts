import { NextRequest, NextResponse } from "next/server";
import { makeRequestId } from "@/lib/api";
import { getServerCase, getServerEvents, putServerCase } from "@/lib/serverFoodRepo";
import type { FoodCase, FoodEvent } from "@/lib/foodTypes";
import { databaseConfigured, getDatabaseCase, getDatabaseEvents, updateDatabaseCase } from "@/lib/foodDatabase";
import { authorityCookieName, verifyAuthorityToken } from "@/lib/authorityAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = req.headers.get("x-request-id") ?? makeRequestId();
  const { id } = await params;
  if (process.env.NODE_ENV === "production" && !databaseConfigured()) return NextResponse.json({ code: "database_not_configured", message: "Service unavailable", requestId }, { status: 503 });
  const data = databaseConfigured() ? await getDatabaseCase(id) : getServerCase(id);
  if (!data) return NextResponse.json({ code: "not_found", requestId }, { status: 404 });
  return NextResponse.json({ data, events: databaseConfigured() ? await getDatabaseEvents(data.id) : getServerEvents(data.id), requestId }, { headers: { "x-request-id": requestId } });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const requestId = req.headers.get("x-request-id") ?? makeRequestId();
  const { id } = await params;
  if (process.env.NODE_ENV === "production" && !databaseConfigured()) return NextResponse.json({ code: "database_not_configured", message: "Service unavailable", requestId }, { status: 503 });
  const current = databaseConfigured() ? await getDatabaseCase(id) : getServerCase(id);
  if (!current) return NextResponse.json({ code: "not_found", requestId }, { status: 404 });
  const body = await req.json().catch(() => ({})) as { case?: Partial<FoodCase>; actorId?: string; actorRole?: FoodEvent["actorRole"]; reasonCode?: string };
  const authoritySession = verifyAuthorityToken(req.cookies.get(authorityCookieName())?.value);
  if (body.actorRole && body.actorRole !== "citizen" && process.env.NODE_ENV === "production" && !authoritySession && req.headers.get("x-authority-key") !== process.env.FOOD_AUTHORITY_API_KEY) {
    return NextResponse.json({ code: "authority_auth_required", message: "Authorised officer access required", requestId }, { status: 401 });
  }
  const saved = databaseConfigured() ? await updateDatabaseCase({ ...current, ...(body.case ?? {}), id: current.id }, body.actorId ?? "citizen", body.actorRole ?? "citizen", body.reasonCode) : putServerCase({ ...current, ...(body.case ?? {}), id: current.id }, body.actorId ?? "citizen", body.actorRole ?? "citizen");
  return NextResponse.json({ data: saved, events: databaseConfigured() ? await getDatabaseEvents(saved.id) : getServerEvents(saved.id), requestId }, { headers: { "x-request-id": requestId } });
}
