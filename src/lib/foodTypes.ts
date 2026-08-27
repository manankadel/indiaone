export type FoodCategory = "packaged" | "premises" | "delivery" | "illness";

export type FoodCaseStatus =
  | "draft"
  | "evidence_received"
  | "triage_pending"
  | "routed"
  | "acknowledged"
  | "clarification_requested"
  | "assigned"
  | "inspection_completed"
  | "sample_sent"
  | "corrective_requested"
  | "notice_recorded"
  | "closed_action"
  | "closed_insufficient"
  | "appealed";

export type FoodCase = {
  id: string;
  publicReference: string;
  category: FoodCategory;
  status: FoodCaseStatus;
  priority: "low" | "medium" | "high" | "critical";
  jurisdictionId: string;
  createdBy: string;
  anonymityMode: "identified" | "anonymous";
  consent: { shareContact: boolean; allowFollowUp: boolean; allowAggregate: boolean; allowBusinessSeeEvidence: boolean; publishRedacted: boolean };
  subject: { name?: string; fssaiNumber?: string; addressCoarse?: string; geoHash?: string; platformOrderId?: string; batchNumber?: string };
  evidenceIds: string[];
  facts: import("./types").ExtractedFact[];
  statement: string;
  risk?: { severity: number; exposure: number; urgency: number; evidenceQuality: number; priority: string; reasons: string[] };
  routing?: { authority: string; reason: string; capability: "live"|"manual_handoff"|"demo"; nextAction: string };
  createdAt: string;
  updatedAt: string;
};

export type FoodEvidence = {
  id: string;
  caseId: string;
  kind: string;
  sha256: string;
  capturedAt: string;
  coarseLocation?: string;
  redactionState: "pending"|"clean"|"redacted";
  retentionUntil?: string;
};

export type FoodEvent = {
  id: string;
  caseId: string;
  type: string;
  actorId: string;
  actorRole: "citizen"|"system"|"fso"|"do"|"lab"|"fbo";
  visibility: "public"|"private";
  reasonCode?: string;
  payload?: Record<string,unknown>;
  occurredAt: string;
};

export const FOOD_STATUSES: { id: FoodCaseStatus; label: string; public: boolean }[] = [
  { id: "draft", label: "Draft", public: false },
  { id: "evidence_received", label: "Evidence received", public: true },
  { id: "triage_pending", label: "Triage pending", public: true },
  { id: "routed", label: "Routed", public: true },
  { id: "acknowledged", label: "Acknowledged", public: true },
  { id: "clarification_requested", label: "Clarification requested", public: true },
  { id: "assigned", label: "Assigned for inspection", public: true },
  { id: "inspection_completed", label: "Inspection completed", public: true },
  { id: "sample_sent", label: "Sample sent to lab", public: true },
  { id: "corrective_requested", label: "Corrective action requested", public: true },
  { id: "notice_recorded", label: "Notice / enforcement recorded", public: true },
  { id: "closed_action", label: "Closed — action taken", public: true },
  { id: "closed_insufficient", label: "Closed — insufficient evidence", public: true },
  { id: "appealed", label: "Appealed / reopened", public: true },
];
