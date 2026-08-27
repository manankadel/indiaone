import crypto from "node:crypto";

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
