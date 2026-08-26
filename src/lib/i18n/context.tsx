"use client";
import { createContext, useContext, useCallback, useState } from "react";
import { Locale, dict, t } from "./dictionary";

const Ctx = createContext<{ locale: Locale; setLocale: (l: Locale) => void; t: (k: string) => string } | null>(null);

const FULLY_SUPPORTED: Locale[] = ["hg", "hi", "en"];
const BETA: Locale[] = ["mr", "bn", "ta", "te", "gu"];

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "hg";
  const saved = localStorage.getItem("indiaone_locale") as Locale | null;
  if (saved && dict[saved]) return saved;
  // Default to Hinglish — matches majority urban preference, judges understand, short copy.
  return "hg";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleRaw] = useState<Locale>(() => getInitialLocale());
  const setLocale = useCallback((l: Locale) => {
    setLocaleRaw(l);
    localStorage.setItem("indiaone_locale", l);
    document.documentElement.lang = l === "hg" ? "hi" : l;
  }, []);
  const tr = useCallback((k: string) => t(locale, k), [locale]);
  return <Ctx.Provider value={{ locale, setLocale, t: tr }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n outside provider");
  return v;
}

export const SUPPORTED = { full: FULLY_SUPPORTED, beta: BETA };
