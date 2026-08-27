import { FoodCase, FoodEvent, FoodEvidence, FoodCategory, FoodAction } from "./foodTypes";
import { ExtractedFact } from "./types";

const CASE_KEY = "food_cases_v1";
const EVENT_KEY = "food_events_v1";

function uid(prefix: string) { return `${prefix}_${Math.random().toString(36).slice(2,8)}_${Date.now().toString(36)}`; }

export function makePublicRef(): string { return `MH-FDA-${new Date().getFullYear()}-${Math.floor(1000+Math.random()*9000)}`; }

export function createFoodCase(category: FoodCategory): FoodCase {
  const now = new Date().toISOString();
  const id = uid("case");
  return {
    id,
    publicReference: makePublicRef(),
    category,
    status: "draft",
    priority: "medium",
    jurisdictionId: "MH-PUNE",
    createdBy: "citizen",
    anonymityMode: "identified",
    consent: { shareContact: true, allowFollowUp: true, allowAggregate: true, allowBusinessSeeEvidence: false, publishRedacted: true },
    subject: {},
    evidenceIds: [],
    facts: [],
    statement: "",
    createdAt: now,
    updatedAt: now,
  };
}

export function triagePriority(c: FoodCase): { priority: string; reasons: string[]; scores: { severity:number; exposure:number; urgency:number; evidenceQuality:number } } {
  // Deterministic rules engine per PRD 8.6 — no opaque AI. Evidence alone does NOT prove location.
  let severity = 2, exposure = 2, urgency = 2, evidenceQuality = 1;
  const reasons: string[] = [];
  const hasIllness = c.category === "illness";
  const hasMultipleEvidence = c.evidenceIds.length >= 2;
  const hasIdentifiable = !!c.subject.fssaiNumber || !!c.subject.name;
  const hasLocation = !!c.subject.addressCoarse || !!c.subject.geoHash;

  if (hasIllness) { severity = 5; reasons.push("Illness cluster reported — potential biological hazard"); }
  else if (c.category === "packaged") { severity = 3; reasons.push("Packaged product — distributed risk"); }
  else if (c.category === "premises") { severity = 4; reasons.push("Premises hygiene — active sale"); }

  if (hasMultipleEvidence) { evidenceQuality = 4; reasons.push("Multiple evidence items — clear images"); }
  else if (c.evidenceIds.length===1) { evidenceQuality = 2; reasons.push("Single image — needs more context"); }

  if (hasIdentifiable) { exposure = 4; reasons.push("Business identifiable — traceable"); }
  if (hasLocation) { urgency = 3; reasons.push("Location available — routable"); }

  const score = severity * exposure * urgency * evidenceQuality;
  let priority = "low";
  if (score >= 80) priority = "critical";
  else if (score >= 40) priority = "high";
  else if (score >= 15) priority = "medium";

  return { priority: priority as any, reasons, scores: { severity, exposure, urgency, evidenceQuality } };
}

export function routeAuthority(c: FoodCase): { authority: string; reason: string; capability: "manual_handoff"|"live"; nextAction: string; jurisdictionId: string } {
  // Jurisdiction lookup — uses geoHash / addressCoarse, not just MH-PUNE. PRD requires official boundary data in production.
  const loc = (c.subject.geoHash || c.subject.addressCoarse || "").toLowerCase();
  let jurisdictionId = c.jurisdictionId || "MH-PUNE";
  let authority = "FSSAI State FDA — Pune (MH)";
  let reason = "Location + FSSAI jurisdiction (MH-PUNE fallback — official boundary data required in production)";
  let capability: "manual_handoff"|"live" = "live";
  let nextAction = "Acknowledged — assigned for inspection triage";

  if (loc.includes("delhi") || loc.includes("dl-")) { jurisdictionId = "DL-CENTRAL"; authority = "FSSAI State FDA — Delhi"; reason = "Jurisdiction from coarse location: Delhi"; }
  else if (loc.includes("mumbai") || loc.includes("mh-mumbai")) { jurisdictionId = "MH-MUMBAI"; authority = "FSSAI State FDA — Mumbai"; reason = "Jurisdiction from coarse location: Mumbai"; }
  else if (loc.includes("nagpur")) { jurisdictionId = "MH-NAGPUR"; authority = "FSSAI State FDA — Nagpur"; reason = "Jurisdiction from coarse location: Nagpur"; }

  if (c.category === "illness") { authority = authority.replace("FSSAI State FDA", "State FDA + NCDC district cell"); reason = "Illness cluster — FDA + public-health (NCDC)"; nextAction = "Acknowledged — officer will request meal/order details and onset time"; }
  else if (c.category === "delivery") { authority = authority.replace("State FDA", "State FDA — online aggregator cell"); reason = "Delivery/aggregator order — State FDA + FSSAI Food Safety Connect copy"; nextAction = "Routed to aggregator + State FDA copy (manual_handoff in production if no API)"; capability = "manual_handoff"; }

  return { authority, reason, capability, nextAction, jurisdictionId };
}

export function buildActionPlan(c: FoodCase): FoodAction[] {
  const plan: FoodAction[] = [
    { id: "triage", owner: "authority", title: "Review and assign", description: "Check the evidence, confirm jurisdiction and assign a food-safety officer.", status: "pending", dueLabel: "First response" },
    { id: "inspection", owner: "authority", title: "Inspect the food business", description: "Use the approved inspection checklist and record findings with time and location.", status: "pending", dueLabel: "After triage" },
  ];
  if (c.category === "packaged" || c.category === "delivery") plan.push({ id: "sample", owner: "laboratory", title: "Collect and test a sample", description: "If the officer finds a material risk, seal a sample and send it through the chain of custody.", status: "pending", dueLabel: "If required" });
  if (c.category === "illness") plan.push({ id: "cluster", owner: "public_health", title: "Check for other reports", description: "Compare time, meal, location and symptoms to detect a possible cluster.", status: "pending", dueLabel: "Urgent" });
  plan.push({ id: "business", owner: "business", title: "Give the business a response window", description: "The food business can provide records, explain the issue and submit corrective action.", status: "pending", dueLabel: "After inspection" });
  plan.push({ id: "outcome", owner: "authority", title: "Publish the verified outcome", description: "Record closure, corrective action, notice, recall or reason for no action. Appeals remain visible.", status: "pending", dueLabel: "After review" });
  return plan;
}

// Browser-local persistence (honest for hackathon; production → Postgres + PostGIS + events)
// For audit: officer actions must be recorded with officer identity, not citizen. Use saveCaseWithActor for authority flows.
export function saveCase(c: FoodCase, actor?: { id: string; role: FoodEvent["actorRole"] }) {
  if (typeof window === "undefined") return;
  const all = loadAllCases();
  const idx = all.findIndex(x=>x.id===c.id);
  const next = { ...c, actionPlan: c.actionPlan ?? buildActionPlan(c), linkedSubmissionCount: c.linkedSubmissionCount ?? 1 };
  if (idx>=0) all[idx]=next; else all.unshift(next);
  localStorage.setItem(CASE_KEY, JSON.stringify(all.slice(0,50)));
  const act = actor ?? { id: "citizen", role: "citizen" as const };
  appendEvent({ id: uid("evt"), caseId: c.id, type: c.status, actorId: act.id, actorRole: act.role, visibility: "public", occurredAt: new Date().toISOString() });
}

export function saveCaseWithActor(c: FoodCase, actorId: string, actorRole: FoodEvent["actorRole"]) {
  return saveCase(c, { id: actorId, role: actorRole });
}

export function loadAllCases(): FoodCase[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(CASE_KEY) || "[]"); } catch { return []; }
}

export function loadCase(id: string): FoodCase | null {
  return loadAllCases().find(c=>c.id===id || c.publicReference===id) || null;
}

export function findRelatedCases(c: FoodCase): FoodCase[] {
  const subject = (c.subject.name || c.subject.fssaiNumber || "").trim().toLowerCase();
  return loadAllCases().filter(other => {
    if (other.id === c.id || other.category !== c.category) return false;
    const otherSubject = (other.subject.name || other.subject.fssaiNumber || "").trim().toLowerCase();
    return !!subject && subject === otherSubject;
  });
}

function appendEvent(e: FoodEvent) {
  if (typeof window === "undefined") return;
  const all: FoodEvent[] = JSON.parse(localStorage.getItem(EVENT_KEY) || "[]");
  all.push(e);
  localStorage.setItem(EVENT_KEY, JSON.stringify(all.slice(-200)));
}

export function loadEvents(caseId: string): FoodEvent[] {
  if (typeof window === "undefined") return [];
  try { const all: FoodEvent[] = JSON.parse(localStorage.getItem(EVENT_KEY) || "[]"); return all.filter(e=>e.caseId===caseId); } catch { return []; }
}
