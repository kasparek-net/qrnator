"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { translate, type Key, type Locale } from "./i18n";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: Key, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<Ctx | null>(null);

const STORAGE = "qrnator-lang";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("cs");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE) as Locale | null;
      if (saved === "en" || saved === "cs") {
        setLocaleState(saved);
        document.documentElement.lang = saved;
      }
    } catch {}
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    document.documentElement.lang = l;
    try {
      localStorage.setItem(STORAGE, l);
    } catch {}
  }, []);

  const t = useCallback(
    (key: Key, vars?: Record<string, string | number>) =>
      translate(locale, key, vars),
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
