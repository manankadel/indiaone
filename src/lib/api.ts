export type ApiError = {
  code: string;
  message: string;
  userAction?: string;
  retryable: boolean;
  requestId: string;
  fieldErrors?: Record<string, string>;
};

export function makeRequestId() {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function apiError(code: string, message: string, opts: Partial<ApiError> = {}): ApiError {
  return { code, message, retryable: false, requestId: makeRequestId(), ...opts };
}

// In-memory rate limiter (per-instance, safe for Vercel edge-ish)
const hits = new Map<string, number[]>();
export function rateLimit(key: string, max = 20, windowMs = 60_000): boolean {
  const now = Date.now();
  const arr = hits.get(key) ?? [];
  const recent = arr.filter(t => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length <= max;
}

export const ALLOWED_EVIDENCE_IDS = new Set(["fx_milk_packet","fx_hotel_kitchen","fx_zepto_store"]);
