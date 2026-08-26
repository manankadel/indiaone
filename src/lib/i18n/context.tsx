"use client";
import { createContext, useContext, useCallback, useState } from "react";
import { Locale, dict, t } from "./dictionary";

const Ctx = createContext<{ locale: Locale; setLocale: (l: Locale) => void; t: (k: string) => string } | null>(null);

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem("indiaone_locale") as Locale | null;
  if (saved && dict[saved]) return saved;
  return "en";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleRaw] = useState<Locale>(() => getInitialLocale());
  const setLocale = useCallback((l: Locale) => {
    setLocaleRaw(l);
    localStorage.setItem("indiaone_locale", l);
    document.documentElement.lang = l;
  }, []);
  const tr = useCallback((k: string) => t(locale, k), [locale]);
  return <Ctx.Provider value={{ locale, setLocale, t: tr }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n outside provider");
  return v;
}
