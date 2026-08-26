import { EvidenceFixture, ExtractedFact, CitizenCase } from "./types";

export const EVIDENCE_FIXTURES: EvidenceFixture[] = [
  { id: "fx_sms_hdfc", type: "sms", title: "HDFC Bank SMS", preview: "HDFC", excerpt: "Rs.48,500 debited via UPI on 26-Aug-26 11:42 AM. UPI Ref 321768904512. To vpa collect@oksbi. Avl Bal Rs.12,340. — HDFC Bank" },
  { id: "fx_phonepe", type: "receipt", title: "PhonePe Receipt", preview: "PhonePe", excerpt: "Paid ₹48,500 to collect@oksbi · Transaction ID T240826114211 · 26 Aug, 11:42 AM · UPI · Status Success" },
  { id: "fx_chat", type: "chat", title: "WhatsApp Chat", preview: "WA", excerpt: "Hello sir, your KYC expired. Click https://kyc-update-secure-verify.work/ok?u=8821 to avoid account freeze. — +91 98XXXX X210" },
  { id: "fx_email", type: "email", title: "Bank Alert Email", preview: "Email", excerpt: "Alert: UPI transaction of INR 48,500 to UPI ID collect@oksbi succeeded. Ref 321768904512. Not you? Call 1800-258-xxxx." },
  { id: "fx_card_alert", type: "sms", title: "ICICI Card Alert", preview: "ICICI", excerpt: "Alert: Your ICICI Card XX4521 was used for USD 149.99 at WALMART INTL on 26-Aug-26 09:15 AM. Not you? Call 18002600." },
  { id: "fx_wallet_sms", type: "sms", title: "Paytm Wallet SMS", preview: "Paytm", excerpt: "Rs.7,500 debited from Paytm Wallet to merchant pay@paytm on 25-Aug-26 18:20. Ref PTM88201923. Wallet balance Rs.430." },
];

// Seeded facts for three distinct fraud stories (audit requirement: three seeded cases)
export const SEEDED_FACTS_A: ExtractedFact[] = [
  { id: "f1", field: "amount", label: "Amount", value: "₹48,500", sourceEvidenceId: "fx_sms_hdfc", sourceExcerpt: "Rs.48,500 debited", confidence: "high", status: "pending" },
  { id: "f2", field: "transaction_reference", label: "UPI Ref / Transaction ID", value: "321768904512", sourceEvidenceId: "fx_sms_hdfc", sourceExcerpt: "UPI Ref 321768904512", confidence: "high", status: "pending" },
  { id: "f3", field: "occurred_at", label: "Date & time", value: "26 Aug 2026, 11:42 AM", sourceEvidenceId: "fx_phonepe", sourceExcerpt: "26 Aug, 11:42 AM", confidence: "high", status: "pending" },
  { id: "f4", field: "institution", label: "Your bank / wallet", value: "HDFC Bank · UPI via PhonePe", sourceEvidenceId: "fx_sms_hdfc", sourceExcerpt: "HDFC Bank", confidence: "medium", status: "pending" },
  { id: "f5", field: "recipient", label: "Recipient / Payee", value: "collect@oksbi", sourceEvidenceId: "fx_phonepe", sourceExcerpt: "to collect@oksbi", confidence: "high", status: "pending" },
  { id: "f6", field: "url", label: "Suspicious link", value: "https://kyc-update-secure-verify.work/ok?u=8821", sourceEvidenceId: "fx_chat", sourceExcerpt: "https://kyc-update-secure-verify.work", confidence: "medium", status: "pending" },
  { id: "f7", field: "suspect_contact", label: "Suspect contact", value: "+91 98XXXX X210", sourceEvidenceId: "fx_chat", sourceExcerpt: "+91 98XXXX X210", confidence: "low", status: "pending" },
];

export const SEEDED_FACTS_B: ExtractedFact[] = [
  { id: "fb1", field: "amount", label: "Amount", value: "USD 149.99", sourceEvidenceId: "fx_card_alert", sourceExcerpt: "USD 149.99", confidence: "high", status: "pending" },
  { id: "fb2", field: "institution", label: "Your bank / wallet", value: "ICICI Bank Card XX4521", sourceEvidenceId: "fx_card_alert", sourceExcerpt: "ICICI Card XX4521", confidence: "high", status: "pending" },
  { id: "fb3", field: "occurred_at", label: "Date & time", value: "26 Aug 2026, 09:15 AM", sourceEvidenceId: "fx_card_alert", sourceExcerpt: "09:15 AM", confidence: "high", status: "pending" },
  { id: "fb4", field: "recipient", label: "Recipient / Payee", value: "WALMART INTL", sourceEvidenceId: "fx_card_alert", sourceExcerpt: "WALMART INTL", confidence: "medium", status: "pending" },
  { id: "fb5", field: "channel", label: "Channel", value: "Card — international", sourceEvidenceId: "fx_card_alert", sourceExcerpt: "Card XX4521 was used", confidence: "medium", status: "pending" },
];

export const SEEDED_FACTS_C: ExtractedFact[] = [
  { id: "fc1", field: "amount", label: "Amount", value: "₹7,500", sourceEvidenceId: "fx_wallet_sms", sourceExcerpt: "Rs.7,500 debited", confidence: "high", status: "pending" },
  { id: "fc2", field: "transaction_reference", label: "Reference", value: "PTM88201923", sourceEvidenceId: "fx_wallet_sms", sourceExcerpt: "Ref PTM88201923", confidence: "high", status: "pending" },
  { id: "fc3", field: "occurred_at", label: "Date & time", value: "25 Aug 2026, 18:20", sourceEvidenceId: "fx_wallet_sms", sourceExcerpt: "25-Aug-26 18:20", confidence: "high", status: "pending" },
  { id: "fc4", field: "institution", label: "Your bank / wallet", value: "Paytm Wallet", sourceEvidenceId: "fx_wallet_sms", sourceExcerpt: "Paytm Wallet", confidence: "high", status: "pending" },
  { id: "fc5", field: "recipient", label: "Recipient / Payee", value: "pay@paytm", sourceEvidenceId: "fx_wallet_sms", sourceExcerpt: "pay@paytm", confidence: "high", status: "pending" },
];

// Backward compat: default = A
export const SEEDED_FACTS = SEEDED_FACTS_A;

export const SEEDED_STATEMENT_A = `On 26 Aug 2026 at 11:42 AM, I received an SMS from HDFC Bank that Rs.48,500 was debited via UPI (Ref 321768904512) to collect@oksbi via PhonePe (T240826114211). I did not authorize this.
Earlier I received WhatsApp from +91 98XXXX X210 claiming KYC expired with link https://kyc-update-secure-verify.work/ok?u=8821. I may have opened it. Discovered debit at 11:45 AM. No OTP shared.`;

export const SEEDED_STATEMENT_B = `On 26 Aug 2026 at 09:15 AM my ICICI Card XX4521 was charged USD 149.99 at WALMART INTL. I did not authorize this international transaction. Card is with me. I request record and guidance.`;

export const SEEDED_STATEMENT_C = `On 25 Aug 2026 at 18:20, Rs.7,500 was debited from my Paytm Wallet to pay@paytm (Ref PTM88201923). I did not authorize this wallet payment.`;

export const SEEDED_STATEMENT = SEEDED_STATEMENT_A;

export const SEEDED_CASES: Record<string, { label: string; transaction: NonNullable<CitizenCase["transaction"]>; evidenceIds: string[]; facts: ExtractedFact[]; statement: string; }> = {
  upi_collect: {
    label: "UPI Collect — ₹48,500",
    transaction: { rail: "UPI", amount: 48500, occurredAt: "2026-08-26T11:42:00.000Z", reference: "321768904512", institution: "HDFC Bank · UPI via PhonePe", recipient: "collect@oksbi", authorized: false },
    evidenceIds: ["fx_sms_hdfc","fx_phonepe","fx_chat"],
    facts: SEEDED_FACTS_A,
    statement: SEEDED_STATEMENT_A,
  },
  card_intl: {
    label: "Card International — USD 149.99",
    transaction: { rail: "Card", amount: 12999, occurredAt: "2026-08-26T09:15:00.000Z", reference: "ICICI-XX4521-0915", institution: "ICICI Bank Card XX4521", recipient: "WALMART INTL", authorized: false },
    evidenceIds: ["fx_card_alert"],
    facts: SEEDED_FACTS_B,
    statement: SEEDED_STATEMENT_B,
  },
  wallet: {
    label: "Wallet — ₹7,500",
    transaction: { rail: "Wallet", amount: 7500, occurredAt: "2026-08-25T18:20:00.000Z", reference: "PTM88201923", institution: "Paytm Wallet", recipient: "pay@paytm", authorized: false },
    evidenceIds: ["fx_wallet_sms"],
    facts: SEEDED_FACTS_C,
    statement: SEEDED_STATEMENT_C,
  },
};

export const MOCK_REFERENCES = { bank: "BANK-ALERT-MOCK-77319", portal: "IND-CYBER-2026-88471" };
