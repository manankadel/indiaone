import type { FoodCase, FoodEvent } from "./foodTypes";
import { buildActionPlan } from "./foodRepo";

type Store = { cases: Map<string, FoodCase>; events: Map<string, FoodEvent[]> };

const globalStore = globalThis as typeof globalThis & { __foodSurakshaStore?: Store };
const store: Store = globalStore.__foodSurakshaStore ?? { cases: new Map(), events: new Map() };
globalStore.__foodSurakshaStore = store;

export function putServerCase(input: FoodCase, actorId = "citizen", actorRole: FoodEvent["actorRole"] = "citizen") {
  const previous = store.cases.get(input.id);
  const next = { ...input, actionPlan: input.actionPlan ?? buildActionPlan(input), linkedSubmissionCount: input.linkedSubmissionCount ?? 1, updatedAt: new Date().toISOString() };
  store.cases.set(next.id, next);
  const events = store.events.get(next.id) ?? [];
  if (!previous || previous.status !== next.status) {
    events.push({ id: `evt_${crypto.randomUUID()}`, caseId: next.id, type: next.status, actorId, actorRole, visibility: "public", occurredAt: next.updatedAt });
  }
  store.events.set(next.id, events);
  return next;
}

export function getServerCase(idOrReference: string) {
  return Array.from(store.cases.values()).find(c => c.id === idOrReference || c.publicReference === idOrReference) ?? null;
}

export function listServerCases() { return Array.from(store.cases.values()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)); }

export function getServerEvents(caseId: string) { return store.events.get(caseId) ?? []; }
