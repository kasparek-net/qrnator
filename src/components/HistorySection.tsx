"use client";

import { HistoryList } from "./HistoryList";
import { useI18n } from "@/lib/i18n-context";

export function HistorySection() {
  const { t } = useI18n();
  return (
    <>
      <section className="max-w-4xl mx-auto px-4 pt-10 pb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          {t("history.title")}
        </h1>
        <p className="mt-2 text-[var(--muted)]">{t("history.subtitle")}</p>
      </section>
      <section className="max-w-4xl mx-auto px-4 pb-10">
        <HistoryList />
      </section>
    </>
  );
}
