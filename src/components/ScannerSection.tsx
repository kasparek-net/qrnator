"use client";

import { Scanner } from "./Scanner";
import { useI18n } from "@/lib/i18n-context";

export function ScannerSection() {
  const { t } = useI18n();
  return (
    <>
      <section className="max-w-3xl mx-auto px-4 pt-10 pb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          {t("scanner.title")}
        </h1>
        <p className="mt-3 text-[var(--muted)]">{t("scanner.subtitle")}</p>
      </section>
      <section className="max-w-3xl mx-auto px-4 pb-10">
        <Scanner />
      </section>
    </>
  );
}
