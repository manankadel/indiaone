export type ServiceSlug = "fraud" | "fda" | "irctc" | "income-tax" | "cpgrams" | "gst" | "epfo" | "mca" | "umang" | "parivahan" | "rti";

export type ServiceDefinition = {
  slug: ServiceSlug;
  title: string;
  short: string;
  problem: string;
  persona: string;
  badge: string;
  color: string;
  intents: string[];
  workflow: { id: string; title: string; kind: "form" | "evidence" | "ai_review" | "consent" | "integration" | "result" }[];
  mockArtifact: string;
};

export type ExtractedFact = {
  id: string;
  field: "amount" | "transaction_reference" | "occurred_at" | "institution" | "recipient" | "channel" | "suspect_contact" | "url" | "fssai_number" | "violation_type" | "shop_name" | "product";
  label: string;
  value: string;
  sourceEvidenceId: string;
  sourceExcerpt?: string;
  confidence: "high" | "medium" | "low";
  status: "pending" | "confirmed" | "edited" | "rejected";
};

export type EvidenceFixture = {
  id: string;
  type: "sms" | "email" | "receipt" | "chat" | "url";
  title: string;
  preview: string;
  excerpt: string;
};

export type CaseStatus = "draft" | "contain" | "transaction" | "evidence" | "verify" | "statement" | "review" | "submitted" | "acknowledged" | "under_review" | "resolved";

export type CitizenCase = {
  id: string;
  serviceSlug: ServiceSlug;
  status: CaseStatus;
  createdAt: string;
  transaction?: {
    rail: "UPI" | "Card" | "BankTransfer" | "Wallet";
    amount: number;
    occurredAt: string;
    reference: string;
    institution: string;
    recipient: string;
    authorized: boolean;
  };
  evidenceIds: string[];
  facts: ExtractedFact[];
  statement: string;
  referenceIds?: { bank: string; portal: string };
};
