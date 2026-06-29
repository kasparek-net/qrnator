"use client";

import { Sparkles, ShieldCheck, Zap, Heart } from "lucide-react";
import { Generator } from "./Generator";
import { useI18n } from "@/lib/i18n-context";

export function Landing() {
  const { t } = useI18n();
  return (
    <>
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-6 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs text-[var(--muted)] mb-4">
          <Sparkles className="w-3 h-3 text-red-600" />
          {t("hero.badge")}
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--foreground)]">
          {t("hero.title")}{" "}
          <span className="text-red-600">{t("hero.title.accent")}</span>
        </h1>
        <p className="mt-3 text-[var(--muted)] max-w-2xl mx-auto">
          {t("hero.subtitle")}
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-10">
        <Generator />
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-3 gap-4">
          <Feature
            icon={<Zap className="w-5 h-5" />}
            title={t("feature.live.title")}
            text={t("feature.live.text")}
          />
          <Feature
            icon={<ShieldCheck className="w-5 h-5" />}
            title={t("feature.privacy.title")}
            text={t("feature.privacy.text")}
          />
          <Feature
            icon={<Heart className="w-5 h-5" />}
            title={t("feature.free.title")}
            text={t("feature.free.text")}
          />
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">{t("faq.title")}</h2>
        <div className="space-y-3">
          <FAQ q={t("faq.q1")} a={t("faq.a1")} />
          <FAQ q={t("faq.q2")} a={t("faq.a2")} />
          <FAQ q={t("faq.q3")} a={t("faq.a3")} />
          <FAQ q={t("faq.q4")} a={t("faq.a4")} />
          <FAQ q={t("faq.q5")} a={t("faq.a5")} />
        </div>
      </section>
    </>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="inline-flex w-9 h-9 items-center justify-center rounded-lg bg-red-600/10 text-red-600 mb-3">
        {icon}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-[var(--muted)]">{text}</p>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
      <summary className="flex items-center justify-between cursor-pointer list-none font-medium">
        {q}
        <span className="text-[var(--muted)] group-open:rotate-45 transition">
          +
        </span>
      </summary>
      <p className="mt-2 text-sm text-[var(--muted)]">{a}</p>
    </details>
  );
}
