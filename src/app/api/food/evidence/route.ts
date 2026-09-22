import { randomUUID, createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { getDatabaseCase, databaseConfigured, getFoodEvidence, insertFoodEvidence, listFoodEvidence } from "@/lib/foodDatabase";
import { isAuthorityRequest } from "@/lib/authorityAuth";
import { makeRequestId } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

export async function POST(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") ?? makeRequestId();
  if (!databaseConfigured()) return NextResponse.json({ code: "database_not_configured", requestId }, { status: 503 });
  const form = await req.formData();
  const caseId = String(form.get("caseId") ?? "");
  const file = form.get("file");
  if (!caseId || !(file instanceof File)) return NextResponse.json({ code: "file_and_case_required", requestId }, { status: 400 });
  if (!ALLOWED.has(file.type)) return NextResponse.json({ code: "unsupported_file_type", message: "Use a JPG, PNG, WebP or PDF.", requestId }, { status: 415 });
  if (file.size > MAX_BYTES) return NextResponse.json({ code: "file_too_large", message: "Keep each file under 8 MB.", requestId }, { status: 413 });
  const c = await getDatabaseCase(caseId);
  if (!c) return NextResponse.json({ code: "case_not_found", requestId }, { status: 404 });
  const bytes = Buffer.from(await file.arrayBuffer());
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  const id = `ev_${randomUUID()}`;
  const extension = ({ "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "application/pdf": ".pdf" } as Record<string, string>)[file.type] ?? ".bin";
  const root = process.env.EVIDENCE_STORAGE_PATH || "/var/lib/food-suraksha/evidence";
  const relativePath = path.join(/*turbopackIgnore: true*/ c.id, `${id}${extension}`);
  const absolutePath = path.join(/*turbopackIgnore: true*/ root, relativePath);
  await mkdir(path.dirname(/*turbopackIgnore: true*/ absolutePath), { recursive: true });
  await writeFile(absolutePath, bytes, { flag: "wx" });
  const now = new Date().toISOString();
  const evidence = await insertFoodEvidence({ id, caseId: c.id, filename: file.name.slice(0, 180), mimeType: file.type, sha256, storagePath: relativePath, capturedAt: now, redactionState: "pending", createdAt: now });
  return NextResponse.json({ data: { ...evidence, previewUrl: null }, requestId }, { status: 201, headers: { "x-request-id": requestId } });
}

export async function GET(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") ?? makeRequestId();
  const params = new URL(req.url).searchParams;
  const evidenceId = params.get("id");
  if (evidenceId) {
    if (!(await isAuthorityRequest(req))) return NextResponse.json({ code: "authority_auth_required", requestId }, { status: 401 });
    const evidence = await getFoodEvidence(evidenceId);
    if (!evidence) return NextResponse.json({ code: "evidence_not_found", requestId }, { status: 404 });
    const bytes = await import("node:fs/promises").then(fs => fs.readFile(path.join(/*turbopackIgnore: true*/ process.env.EVIDENCE_STORAGE_PATH || "/var/lib/food-suraksha/evidence", evidence.storagePath)));
    return new NextResponse(bytes, { headers: { "content-type": evidence.mimeType, "cache-control": "private, no-store", "x-content-sha256": evidence.sha256 } });
  }
  const caseId = params.get("caseId");
  if (!caseId || !databaseConfigured()) return NextResponse.json({ code: "case_required", requestId }, { status: 400 });
  const c = await getDatabaseCase(caseId);
  if (!c) return NextResponse.json({ code: "case_not_found", requestId }, { status: 404 });
  return NextResponse.json({ data: await listFoodEvidence(c.id), requestId });
}
