// Minimal allowlisted analytics — no PII, no evidence, no free text, no case content.
// For Round 1: in-browser only, or server logs with redaction.
// If you add real analytics later, send ONLY these buckets.

export type AnalyticsEvent =
  | { name: "journey_started"; props: { service_slug: string; demo_mode: boolean; locale: string } }
  | { name: "containment_viewed"; props: { elapsed_bucket: string } }
  | { name: "evidence_fixture_selected"; props: { count_bucket: string; types: string } }
  | { name: "ai_extraction_completed"; props: { mode: string; latency_bucket: string; fallback: boolean; field_count: number } }
  | { name: "fact_reviewed"; props: { field_type: string; action: string } }
  | { name: "simulation_submitted"; props: { adapters: string } }
  | { name: "error_shown"; props: { code: string; route: string } };

const BUCKETS = {
  latency: (ms: number) => ms < 500 ? "<500ms" : ms < 2000 ? "0.5-2s" : ms < 8000 ? "2-8s" : ">8s",
  count: (n: number) => n === 0 ? "0" : n === 1 ? "1" : n <= 3 ? "2-3" : "4+",
};

export function logEvent(e: AnalyticsEvent) {
  // Redaction: never log case IDs, amounts, references, free text, evidence, URLs.
  // Server: write to structured log with requestId, NOT to user-visible analytics.
  if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", e.name, e.props);
  }
}

export { BUCKETS };
