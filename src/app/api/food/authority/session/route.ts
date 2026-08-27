import { NextRequest, NextResponse } from "next/server";
import { authorityCodeValid, authorityCookieName, createAuthorityToken } from "@/lib/authorityAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return NextResponse.json({ authenticated: Boolean(req.cookies.get(authorityCookieName())?.value) });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as { code?: string };
  if (!authorityCodeValid(body.code)) return NextResponse.json({ code: "invalid_authority_credentials", message: "Use your authorised officer access code." }, { status: 401 });
  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(authorityCookieName(), createAuthorityToken(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
  return response;
}
