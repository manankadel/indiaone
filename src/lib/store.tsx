"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { CitizenCase, ExtractedFact, ServiceSlug } from "./types";
import { MOCK_REFERENCES, SEEDED_FACTS, SEEDED_STATEMENT } from "./fixtures";

const STORE_KEY = "indiaone_case_v1";

function makeDemoCase(): CitizenCase {
  return {
    id: "demo",
    serviceSlug: "fraud",
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

type Store = {
  c: CitizenCase | null;
  setStatus: (s: CitizenCase["status"]) => void;
  setCase: (c: CitizenCase | null) => void;
  updateFact: (id: string, patch: Partial<ExtractedFact>) => void;
  mockSubmit: () => void;
  reset: () => void;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [c, setC] = useState<CitizenCase | null>(null);
  useEffect(() => {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      try { setC(JSON.parse(raw)); return; } catch {}
    }
    setC(makeDemoCase());
  }, []);
  useEffect(() => { if (c) localStorage.setItem(STORE_KEY, JSON.stringify(c)); }, [c]);

  const setStatus = (status: CitizenCase["status"]) => setC(prev => prev ? { ...prev, status } : prev);
  const setCase = (nc: CitizenCase | null) => setC(nc);
  const updateFact = (id: string, patch: Partial<ExtractedFact>) =>
    setC(prev => prev ? { ...prev, facts: prev.facts.map(f => f.id === id ? { ...f, ...patch } : f) } : prev);
  const mockSubmit = () => setC(prev => prev ? { ...prev, status: "submitted", referenceIds: MOCK_REFERENCES } : prev);
  const reset = () => {
    localStorage.removeItem(STORE_KEY);
    setC(makeDemoCase());
  };
  return <Ctx.Provider value={{ c, setStatus, setCase, updateFact, mockSubmit, reset }}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore outside provider");
  return v;
}

export function useDemoCase() { return makeDemoCase(); }
