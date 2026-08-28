import { Pool } from "pg";
import { buildActionPlan, createFoodCase } from "./foodRepo";
import type { FoodCase, FoodCategory, FoodEvent } from "./foodTypes";

export function databaseConfigured() {
  return Boolean(process.env.FOOD_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL);
}

let pool: Pool | null = null;
function getPool() {
  const url = process.env.FOOD_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
  if (!url) throw new Error("Food database is not configured");
  pool ??= new Pool({ connectionString: url, max: Number(process.env.FOOD_DATABASE_POOL_MAX ?? 10), idleTimeoutMillis: 30000, connectionTimeoutMillis: 5000, ssl: process.env.FOOD_DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined });
  return pool;
}

let schemaReady: Promise<void> | null = null;
export function ensureFoodSchema() {
  if (!schemaReady) schemaReady = getPool().query(`
    CREATE TABLE IF NOT EXISTS food_cases (id TEXT PRIMARY KEY, public_reference TEXT NOT NULL UNIQUE, category TEXT NOT NULL, status TEXT NOT NULL, payload JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL);
    CREATE TABLE IF NOT EXISTS food_submissions (id TEXT PRIMARY KEY, case_id TEXT NOT NULL REFERENCES food_cases(id), payload JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL);
    CREATE TABLE IF NOT EXISTS food_events (id TEXT PRIMARY KEY, case_id TEXT NOT NULL REFERENCES food_cases(id), type TEXT NOT NULL, actor_id TEXT NOT NULL, actor_role TEXT NOT NULL, visibility TEXT NOT NULL, reason_code TEXT, payload JSONB, occurred_at TIMESTAMPTZ NOT NULL);
    CREATE TABLE IF NOT EXISTS food_evidence (id TEXT PRIMARY KEY, case_id TEXT NOT NULL REFERENCES food_cases(id), filename TEXT NOT NULL, mime_type TEXT NOT NULL, sha256 TEXT NOT NULL, storage_path TEXT NOT NULL, captured_at TIMESTAMPTZ NOT NULL, redaction_state TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL);
    CREATE INDEX IF NOT EXISTS food_cases_updated_idx ON food_cases (updated_at DESC);
    CREATE INDEX IF NOT EXISTS food_cases_status_idx ON food_cases (status);
    CREATE INDEX IF NOT EXISTS food_events_case_idx ON food_events (case_id, occurred_at ASC);
    CREATE INDEX IF NOT EXISTS food_submissions_case_idx ON food_submissions (case_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS food_evidence_case_idx ON food_evidence (case_id, created_at DESC);
  `).then(() => undefined);
  return schemaReady;
}

function rowCase(row: { payload: unknown }) { return row.payload as FoodCase; }

export async function createDatabaseCase(category: FoodCategory) {
  await ensureFoodSchema();
  const c = createFoodCase(category);
  const payload = { ...c, actionPlan: c.actionPlan ?? buildActionPlan(c), linkedSubmissionCount: c.linkedSubmissionCount ?? 1 };
  const db = getPool();
  await db.query("INSERT INTO food_cases (id, public_reference, category, status, payload, created_at, updated_at) VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7)", [payload.id, payload.publicReference, payload.category, payload.status, JSON.stringify(payload), payload.createdAt, payload.updatedAt]);
  await db.query("INSERT INTO food_submissions (id, case_id, payload, created_at) VALUES ($1, $2, $3::jsonb, $4)", [`sub_${payload.id}`, payload.id, JSON.stringify({ id: `sub_${payload.id}`, caseId: payload.id, createdAt: payload.createdAt }), payload.createdAt]);
  await db.query("INSERT INTO food_events (id, case_id, type, actor_id, actor_role, visibility, occurred_at) VALUES ($1, $2, $3, 'citizen', 'citizen', 'private', $4)", [`evt_${payload.id}`, payload.id, payload.status, payload.createdAt]);
  return payload;
}

export async function getDatabaseCase(idOrReference: string) {
  await ensureFoodSchema();
  const result = await getPool().query("SELECT payload FROM food_cases WHERE id = $1 OR public_reference = $1 LIMIT 1", [idOrReference]);
  return result.rows[0] ? rowCase(result.rows[0] as { payload: unknown }) : null;
}

export async function insertFoodEvidence(input: { id: string; caseId: string; filename: string; mimeType: string; sha256: string; storagePath: string; capturedAt: string; redactionState: string; createdAt: string }) {
  await ensureFoodSchema();
  await getPool().query(
    `INSERT INTO food_evidence (id, case_id, filename, mime_type, sha256, storage_path, captured_at, redaction_state, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [input.id, input.caseId, input.filename, input.mimeType, input.sha256, input.storagePath, input.capturedAt, input.redactionState, input.createdAt],
  );
  return input;
}

export async function listFoodEvidence(caseId: string) {
  await ensureFoodSchema();
  const result = await getPool().query(
    `SELECT id, case_id AS "caseId", filename, mime_type AS "mimeType", sha256, captured_at AS "capturedAt", redaction_state AS "redactionState", created_at AS "createdAt" FROM food_evidence WHERE case_id = $1 ORDER BY created_at ASC`,
    [caseId],
  );
  return result.rows;
}

export async function listDatabaseCases() {
  await ensureFoodSchema();
  const result = await getPool().query("SELECT payload FROM food_cases ORDER BY updated_at DESC LIMIT 500");
  return result.rows.map(row => rowCase(row as { payload: unknown }));
}

export async function updateDatabaseCase(input: FoodCase, actorId: string, actorRole: FoodEvent["actorRole"], reasonCode?: string) {
  await ensureFoodSchema();
  const current = await getDatabaseCase(input.id);
  const next = { ...input, actionPlan: input.actionPlan ?? buildActionPlan(input), updatedAt: new Date().toISOString() };
  const db = getPool();
  await db.query("UPDATE food_cases SET status = $1, payload = $2::jsonb, updated_at = $3 WHERE id = $4", [next.status, JSON.stringify(next), next.updatedAt, next.id]);
  if (!current || current.status !== next.status) await db.query("INSERT INTO food_events (id, case_id, type, actor_id, actor_role, visibility, reason_code, occurred_at) VALUES ($1, $2, $3, $4, $5, 'public', $6, $7)", [`evt_${crypto.randomUUID()}`, next.id, next.status, actorId, actorRole, reasonCode ?? null, next.updatedAt]);
  return next;
}

export async function getDatabaseEvents(caseId: string) {
  await ensureFoodSchema();
  const result = await getPool().query("SELECT id, case_id AS \"caseId\", type, actor_id AS \"actorId\", actor_role AS \"actorRole\", visibility, reason_code AS \"reasonCode\", payload, occurred_at AS \"occurredAt\" FROM food_events WHERE case_id = $1 ORDER BY occurred_at ASC", [caseId]);
  return result.rows as FoodEvent[];
}
