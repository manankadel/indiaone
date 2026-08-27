import { EvidenceFixture, ExtractedFact, CitizenCase } from "./types";

export const EVIDENCE_FIXTURES: EvidenceFixture[] = [
  { id: "fx_sms_hdfc", type: "sms", title: "HDFC Bank SMS", preview: "HDFC", excerpt: "Rs.48,500 debited via UPI on 26-Aug-26 11:42 AM. UPI Ref 321768904512. To vpa collect@oksbi. Avl Bal Rs.12,340. — HDFC Bank" },
  { id: "fx_phonepe", type: "receipt", title: "PhonePe Receipt", preview: "PhonePe", excerpt: "Paid ₹48,500 to collect@oksbi · Transaction ID T240826114211 · 26 Aug, 11:42 AM · UPI · Status Success" },
  { id: "fx_chat", type: "chat", title: "WhatsApp Chat", preview: "WA", excerpt: "Hello sir, your KYC expired. Click https://kyc-update-secure-verify.work/ok?u=8821 to avoid account freeze. — +91 98XXXX X210" },
  { id: "fx_email", type: "email", title: "Bank Alert Email", preview: "Email", excerpt: "Alert: UPI transaction of INR 48,500 to UPI ID collect@oksbi succeeded. Ref 321768904512. Not you? Call 1800-258-xxxx." },
  { id: "fx_card_alert", type: "sms", title: "ICICI Card Alert", preview: "ICICI", excerpt: "Alert: Your ICICI Card XX4521 was used for USD 149.99 at WALMART INTL on 26-Aug-26 09:15 AM. Not you? Call 18002600." },
  { id: "fx_wallet_sms", type: "sms", title: "Paytm Wallet SMS", preview: "Paytm", excerpt: "Rs.7,500 debited from Paytm Wallet to merchant pay@paytm on 25-Aug-26 18:20. Ref PTM88201923. Wallet balance Rs.430." },
  { id: "fx_milk_packet", type: "receipt", title: "Milk Packet — No FSSAI", preview: "🥛", excerpt: "Amul-like packet, MRP ₹28, no FSSAI number, mfg 20-Aug-26, village shop Beed. Photo GPS 18.98,75.78" },
  { id: "fx_hotel_kitchen", type: "url", title: "Hotel Kitchen — Gutkha + Dirty", preview: "🏨", excerpt: "Shiv Sagar Hotel, Nagpur — gutkha sale at counter, kitchen with cockroaches, FSSAI 11524035001234 expired 2024" },
  { id: "fx_zepto_store", type: "receipt", title: "Zepto Dark Store — No License Display", preview: "⚡", excerpt: "Zepto Store, Pune — 2026 FDA raid: no FSSAI display, milk storage 12°C vs required 4°C, stock ₹3.2L" },
  { id: "fx_illness_cluster", type: "receipt", title: "Illness — 4 People, Same Meal", preview: "🤒", excerpt: "Family meal 25-Aug-26, 4 reported vomiting 6h after paneer, hospital OPD slip, no sample retained" },
  { id: "fx_packaged_label", type: "receipt", title: "Packaged Label — Expired + Seal Broken", preview: "🏷️", excerpt: "Biscuit pack, expiry 15-Aug-26, seal broken, batch B882, FSSAI 11518011001234" },
];

// Food — Mundhe FDA nationwide (1131 inspections, ₹49.57cr seized, 56 licenses suspended, 904 raids — Indian Express July 2026)
export const FOOD_FIXTURES = [
  { id: "fd_milk", evidenceIds: ["fx_milk_packet"], label: "Milk — No FSSAI" },
  { id: "fd_hotel", evidenceIds: ["fx_hotel_kitchen"], label: "Hotel — Gutkha + Expired License" },
  { id: "fd_zepto", evidenceIds: ["fx_zepto_store"], label: "Dark Store — Cold Chain Fail" },
];
export const SEEDED_FOOD_A: ExtractedFact[] = [
  { id: "fd1", field: "product", label: "Product", value: "Milk packet — no FSSAI", sourceEvidenceId: "fx_milk_packet", sourceExcerpt: "no FSSAI number", confidence: "high", status: "pending" },
  { id: "fd2", field: "violation_type", label: "Violation", value: "No FSSAI license + suspected adulteration", sourceEvidenceId: "fx_milk_packet", sourceExcerpt: "no FSSAI number", confidence: "high", status: "pending" },
  { id: "fd3", field: "shop_name", label: "Shop", value: "Village Kirana, Beed — GPS 18.98,75.78", sourceEvidenceId: "fx_milk_packet", sourceExcerpt: "village shop Beed", confidence: "high", status: "pending" },
  { id: "fd4", field: "fssai_number", label: "FSSAI", value: "Not displayed / expired", sourceEvidenceId: "fx_milk_packet", sourceExcerpt: "no FSSAI number", confidence: "high", status: "pending" },
];
export const SEEDED_FOOD_B: ExtractedFact[] = [
  { id: "fd5", field: "shop_name", label: "Shop", value: "Shiv Sagar Hotel, Nagpur", sourceEvidenceId: "fx_hotel_kitchen", sourceExcerpt: "Shiv Sagar Hotel", confidence: "high", status: "pending" },
  { id: "fd6", field: "violation_type", label: "Violation", value: "Gutkha sale + hygiene fail", sourceEvidenceId: "fx_hotel_kitchen", sourceExcerpt: "gutkha sale at counter", confidence: "high", status: "pending" },
  { id: "fd7", field: "fssai_number", label: "FSSAI", value: "11524035001234 (expired 2024)", sourceEvidenceId: "fx_hotel_kitchen", sourceExcerpt: "11524035001234 expired 2024", confidence: "high", status: "pending" },
];
export const SEEDED_FOOD_C: ExtractedFact[] = [
  { id: "fd8", field: "shop_name", label: "Shop", value: "Zepto Dark Store, Pune", sourceEvidenceId: "fx_zepto_store", sourceExcerpt: "Zepto Store, Pune", confidence: "high", status: "pending" },
  { id: "fd9", field: "violation_type", label: "Violation", value: "No display + cold chain 12°C vs 4°C", sourceEvidenceId: "fx_zepto_store", sourceExcerpt: "milk storage 12°C vs required 4°C", confidence: "high", status: "pending" },
  { id: "fd10", field: "fssai_number", label: "Stock value", value: "₹3.2L", sourceEvidenceId: "fx_zepto_store", sourceExcerpt: "stock ₹3.2L", confidence: "medium", status: "pending" },
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

export const SEEDED_FOOD_CASES: Record<string, { label: string; evidenceIds: string[]; facts: ExtractedFact[]; shop: string; violation: string; }> = {
  milk: { label: "Milk — No FSSAI · Beed", evidenceIds: ["fx_milk_packet"], facts: SEEDED_FOOD_A, shop: "Village Kirana, Beed", violation: "No FSSAI + adulteration suspect" },
  hotel: { label: "Hotel — Gutkha + Expired · Nagpur", evidenceIds: ["fx_hotel_kitchen"], facts: SEEDED_FOOD_B, shop: "Shiv Sagar Hotel, Nagpur", violation: "Gutkha + hygiene + expired 11524035001234" },
  zepto: { label: "Zepto — Cold Chain · Pune", evidenceIds: ["fx_zepto_store"], facts: SEEDED_FOOD_C, shop: "Zepto Dark Store, Pune", violation: "No display + 12°C vs 4°C, ₹3.2L stock" },
};

export const MOCK_REFERENCES = { bank: "BANK-ALERT-MOCK-77319", portal: "IND-CYBER-2026-88471" };
