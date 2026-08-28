import crypto from "node:crypto";
import { createRemoteJWKSet, jwtVerify } from "jose";

const COOKIE = "food_authority_session";

function secret() {
  return process.env.AUTHORITY_SESSION_SECRET || process.env.FOOD_AUTHORITY_API_KEY || "change-this-authority-secret";
}

export function authorityCookieName() { return COOKIE; }
export function createAuthorityToken() {
  const body = `fso:${Date.now()}`;
  const signature = crypto.createHmac("sha256", secret()).update(body).digest("hex");
  return `${body}.${signature}`;
}
export function verifyAuthorityToken(token: string | undefined) {
  if (!token) return false;
  const splitAt = token.lastIndexOf(".");
  const body = splitAt > 0 ? token.slice(0, splitAt) : "";
  const signature = splitAt > 0 ? token.slice(splitAt + 1) : "";
  if (!body || !signature) return false;
  const expected = crypto.createHmac("sha256", secret()).update(body).digest("hex");
  return signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
export function authorityCodeValid(code: string | undefined) {
  return Boolean(code && process.env.FOOD_AUTHORITY_API_KEY && code === process.env.FOOD_AUTHORITY_API_KEY);
}

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
export async function verifyBluebloodSession(token: string | undefined) {
  const issuer = process.env.BLUEBLOOD_ID_ISSUER || "https://id.bluebloodstudio.com";
  const audience = process.env.BLUEBLOOD_ID_JWT_AUDIENCE || "food-suraksha";
  if (!token) return false;
  try {
    jwks ??= createRemoteJWKSet(new URL(`${issuer}/api/.well-known/jwks.json`));
    const { payload } = await jwtVerify(token, jwks, { issuer, audience });
    const role = String(payload.role ?? payload.scope ?? "");
    return payload.isAdmin === true || ["fso", "do", "food_authority", "super_admin"].some(value => role.split(/[ ,]/).includes(value));
  } catch {
    return false;
  }
}

export async function isAuthorityRequest(req: { cookies: { get(name: string): { value: string } | undefined }; headers: { get(name: string): string | null } }) {
  if (verifyAuthorityToken(req.cookies.get(authorityCookieName())?.value)) return true;
  if (req.headers.get("x-authority-key") === process.env.FOOD_AUTHORITY_API_KEY) return true;
  return verifyBluebloodSession(req.cookies.get("bb_session")?.value);
}
