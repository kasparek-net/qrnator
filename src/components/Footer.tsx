"use client";

import { useI18n } from "@/lib/i18n-context";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-[var(--border)] mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[var(--muted)]">
        <p>{t("footer.tagline", { year: new Date().getFullYear() })}</p>
        <p>
          {t("footer.trademark")}{" "}
          <span className="text-[var(--foreground)]">DENSO WAVE</span>.
        </p>
      </div>
    </footer>
  );
}
