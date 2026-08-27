import { FoodCase, FoodEvent, FoodEvidence, FoodCategory } from "./foodTypes";
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
    createdBy: "citizen_demo",
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
  // Deterministic rules engine per PRD 8.6 — no opaque AI
  let severity = 2, exposure = 2, urgency = 2, evidenceQuality = 1;
  const reasons: string[] = [];
  const hasIllness = c.category === "illness";
  const hasMultipleEvidence = c.evidenceIds.length >= 2;
  const hasIdentifiable = !!c.subject.fssaiNumber || !!c.subject.name;
  const hasLocation = !!c.subject.addressCoarse || c.evidenceIds.length>0;

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

export function routeAuthority(c: FoodCase): { authority: string; reason: string; capability: "demo"; nextAction: string } {
  // Jurisdiction lookup stub — MH-PUNE default, demo capability
  if (c.category === "illness") return { authority: "State FDA + NCDC district cell", reason: "Illness cluster — FDA + public-health", capability: "demo", nextAction: "Acknowledged — officer will request meal/order details and onset time" };
  if (c.category === "delivery") return { authority: "State FDA — online aggregator cell", reason: "Delivery/aggregator order", capability: "demo", nextAction: "Routed to aggregator + State FDA copy" };
  return { authority: "FSSAI State FDA — Pune (MH)", reason: "Location + FSSAI jurisdiction", capability: "demo", nextAction: "Acknowledged — assigned for inspection triage" };
}

// Browser-local persistence (honest for hackathon; production → Postgres + PostGIS + events)
export function saveCase(c: FoodCase) {
  if (typeof window === "undefined") return;
  const all = loadAllCases();
  const idx = all.findIndex(x=>x.id===c.id);
  if (idx>=0) all[idx]=c; else all.unshift(c);
  localStorage.setItem(CASE_KEY, JSON.stringify(all.slice(0,50)));
  appendEvent({ id: uid("evt"), caseId: c.id, type: c.status, actorId: "citizen_demo", actorRole: "citizen", visibility: "public", occurredAt: new Date().toISOString() });
}

export function loadAllCases(): FoodCase[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(CASE_KEY) || "[]"); } catch { return []; }
}

export function loadCase(id: string): FoodCase | null {
  return loadAllCases().find(c=>c.id===id || c.publicReference===id) || null;
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

export function mockInspectionEvents(caseId: string) {
  const now = new Date();
  const base: FoodEvent[] = [
    { id: uid("evt"), caseId, type: "evidence_received", actorId: "system", actorRole: "system", visibility: "public", occurredAt: new Date(now.getTime()-1000*60*30).toISOString() },
    { id: uid("evt"), caseId, type: "triage_pending", actorId: "system", actorRole: "system", visibility: "public", occurredAt: new Date(now.getTime()-1000*60*25).toISOString() },
    { id: uid("evt"), caseId, type: "routed", actorId: "system", actorRole: "system", visibility: "public", occurredAt: new Date(now.getTime()-1000*60*20).toISOString() },
    { id: uid("evt"), caseId, type: "acknowledged", actorId: "fso_demo", actorRole: "fso", visibility: "public", occurredAt: new Date(now.getTime()-1000*60*15).toISOString() },
    { id: uid("evt"), caseId, type: "assigned", actorId: "do_demo", actorRole: "do", visibility: "public", occurredAt: new Date(now.getTime()-1000*60*10).toISOString() },
  ];
  base.forEach(appendEvent);
  return base;
}
