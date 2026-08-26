import { EvidenceFixture, ExtractedFact } from "./types";

export const EVIDENCE_FIXTURES: EvidenceFixture[] = [
  { id: "fx_sms_hdfc", type: "sms", title: "HDFC Bank SMS", preview: "HDFC", excerpt: "Rs.48,500 debited via UPI on 26-Aug-26 11:42 AM. UPI Ref 321768904512. To vpa collect@oksbi. Avl Bal Rs.12,340. — HDFC Bank" },
  { id: "fx_phonepe", type: "receipt", title: "PhonePe Receipt", preview: "PhonePe", excerpt: "Paid ₹48,500 to collect@oksbi · Transaction ID T240826114211 · 26 Aug, 11:42 AM · UPI · Status Success" },
  { id: "fx_chat", type: "chat", title: "WhatsApp Chat", preview: "WA", excerpt: "Hello sir, your KYC expired. Click https://kyc-update-secure-verify.work/ok?u=8821 to avoid account freeze. — +91 98XXXX X210" },
  { id: "fx_email", type: "email", title: "Bank Alert Email", preview: "Email", excerpt: "Alert: UPI transaction of INR 48,500 to UPI ID collect@oksbi succeeded. Ref 321768904512. Not you? Call 1800-258-xxxx." },
];

export const SEEDED_FACTS: ExtractedFact[] = [
  { id: "f1", field: "amount", label: "Amount", value: "₹48,500", sourceEvidenceId: "fx_sms_hdfc", sourceExcerpt: "Rs.48,500 debited", confidence: "high", status: "pending" },
  { id: "f2", field: "transaction_reference", label: "UPI Ref / Transaction ID", value: "321768904512", sourceEvidenceId: "fx_sms_hdfc", sourceExcerpt: "UPI Ref 321768904512", confidence: "high", status: "pending" },
  { id: "f3", field: "occurred_at", label: "Date & time", value: "26 Aug 2026, 11:42 AM", sourceEvidenceId: "fx_phonepe", sourceExcerpt: "26 Aug, 11:42 AM", confidence: "high", status: "pending" },
  { id: "f4", field: "institution", label: "Your bank / wallet", value: "HDFC Bank · UPI via PhonePe", sourceEvidenceId: "fx_sms_hdfc", sourceExcerpt: "HDFC Bank", confidence: "medium", status: "pending" },
  { id: "f5", field: "recipient", label: "Recipient / Payee", value: "collect@oksbi", sourceEvidenceId: "fx_phonepe", sourceExcerpt: "to collect@oksbi", confidence: "high", status: "pending" },
  { id: "f6", field: "url", label: "Suspicious link", value: "https://kyc-update-secure-verify.work/ok?u=8821", sourceEvidenceId: "fx_chat", sourceExcerpt: "https://kyc-update-secure-verify.work", confidence: "medium", status: "pending" },
  { id: "f7", field: "suspect_contact", label: "Suspect contact", value: "+91 98XXXX X210", sourceEvidenceId: "fx_chat", sourceExcerpt: "+91 98XXXX X210", confidence: "low", status: "pending" },
];

export const SEEDED_STATEMENT = `On 26 Aug 2026 at 11:42 AM, I received an SMS from HDFC Bank that Rs.48,500 was debited via UPI (Ref 321768904512) to UPI ID collect@oksbi via PhonePe (Transaction T240826114211). I did not authorize this transaction.

Earlier that morning I received a WhatsApp message from +91 98XXXX X210 claiming my KYC had expired and asking me to click https://kyc-update-secure-verify.work/ok?u=8821. I may have opened the link.

I discovered the debit at 11:45 AM when checking my balance. I have not shared OTP. I request assistance to record this incident and guidance on next steps.`;

export const MOCK_REFERENCES = { bank: "BANK-ALERT-MOCK-77319", portal: "IND-CYBER-2026-88471" };
