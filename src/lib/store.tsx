"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { CitizenCase, ExtractedFact } from "./types";
import { MOCK_REFERENCES, SEEDED_FACTS, SEEDED_STATEMENT, SEEDED_CASES } from "./fixtures";

const STORE_KEY = "indiaone_case_v1";

function makeDemoCase(): CitizenCase {
  return {
    id: "demo",
    serviceSlug: "fda",
    status: "draft",
    createdAt: new Date().toISOString(),
    transaction: {
      rail: "UPI",
      amount: 48500,
      occurredAt: "2026-08-26T11:42:00.000Z",
      reference: "321768904512",
      institution: "HDFC Bank · UPI via PhonePe",
      recipient: "collect@oksbi",
      authorized: false,
    },
    evidenceIds: ["fx_sms_hdfc", "fx_phonepe"],
    facts: SEEDED_FACTS,
    statement: SEEDED_STATEMENT,
  };
}

function loadInitialCase(): CitizenCase | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORE_KEY);
  if (raw) {
    try { return JSON.parse(raw) as CitizenCase; } catch { /* ignore */ }
  }
  return makeDemoCase();
}

type Store = {
  c: CitizenCase | null;
  setStatus: (s: CitizenCase["status"]) => void;
  setCase: (c: CitizenCase | null) => void;
  updateFact: (id: string, patch: Partial<ExtractedFact>) => void;
  mockSubmit: () => void;
  reset: () => void;
  loadSeededCase: (key: keyof typeof SEEDED_CASES) => void;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [c, setC] = useState<CitizenCase | null>(() => loadInitialCase());

  useEffect(() => { if (c) localStorage.setItem(STORE_KEY, JSON.stringify(c)); }, [c]);

  const setStatus = useCallback((status: CitizenCase["status"]) => setC(prev => prev ? { ...prev, status } : prev), []);
  const setCase = useCallback((nc: CitizenCase | null) => setC(nc), []);
  const updateFact = useCallback((id: string, patch: Partial<ExtractedFact>) =>
    setC(prev => prev ? { ...prev, facts: prev.facts.map(f => f.id === id ? { ...f, ...patch } : f) } : prev), []);
  const mockSubmit = useCallback(() => setC(prev => prev ? { ...prev, status: "submitted", referenceIds: MOCK_REFERENCES } : prev), []);
  const reset = useCallback(() => {
    localStorage.removeItem(STORE_KEY);
    setC(makeDemoCase());
  }, []);
  const loadSeededCase = useCallback((key: keyof typeof SEEDED_CASES) => {
    const seed = SEEDED_CASES[key];
    if (!seed) return;
    const nc: CitizenCase = { id: "demo", serviceSlug: "fda", status: "transaction", createdAt: new Date().toISOString(), transaction: seed.transaction, evidenceIds: seed.evidenceIds, facts: seed.facts, statement: seed.statement };
    setC(nc);
  }, []);
  return <Ctx.Provider value={{ c, setStatus, setCase, updateFact, mockSubmit, reset, loadSeededCase }}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore outside provider");
  return v;
}

export function useDemoCase() { return makeDemoCase(); }
