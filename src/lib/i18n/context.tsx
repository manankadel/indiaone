"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Locale, dict, t } from "./dictionary";

const Ctx = createContext<{ locale: Locale; setLocale: (l: Locale) => void; t: (k: string) => string } | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleRaw] = useState<Locale>("en");
  useEffect(() => {
    const saved = localStorage.getItem("indiaone_locale") as Locale | null;
    if (saved && dict[saved]) setLocaleRaw(saved);
  }, []);
  const setLocale = (l: Locale) => {
    setLocaleRaw(l);
    localStorage.setItem("indiaone_locale", l);
    document.documentElement.lang = l;
  };
  const tr = (k: string) => t(locale, k);
  return <Ctx.Provider value={{ locale, setLocale, t: tr }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n outside provider");
  return v;
}
