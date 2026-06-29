"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Moon, QrCode, ScanLine, Sun, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

export function Header() {
  const { t, locale, setLocale } = useI18n();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("qrnator-theme", next ? "dark" : "light");
    } catch {}
  }

  function toggleLang() {
    setLocale(locale === "en" ? "cs" : "en");
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--background)]/80 border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight text-[var(--foreground)] shrink-0"
        >
          <span className="inline-flex w-7 h-7 items-center justify-center rounded-md bg-red-600 text-white">
            <QrCode className="w-4 h-4" />
          </span>
          <span>QRnator</span>
        </Link>
        <nav className="flex items-center gap-0.5 sm:gap-1">
          <Link
            href="/"
            className="px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition"
          >
            {t("nav.generator")}
          </Link>
          <Link
            href="/scanner"
            className="px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition inline-flex items-center gap-1.5"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("nav.scanner")}</span>
          </Link>
          <Link
            href="/historie"
            className="px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition"
          >
            {t("nav.history")}
          </Link>
          <button
            onClick={toggleLang}
            aria-label={t("nav.lang")}
            title={t("nav.lang")}
            className="ml-0.5 sm:ml-1 inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition cursor-pointer"
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">{locale}</span>
          </button>
          <button
            onClick={toggleTheme}
            aria-label={t("nav.theme")}
            className="p-2 rounded-md text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] transition cursor-pointer"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
