"use client";

import { useEffect, useState } from "react";
import { Download, Trash2, History as HistoryIcon } from "lucide-react";
import {
  clearHistory,
  loadHistory,
  removeFromHistory,
  type HistoryItem,
} from "@/lib/history";
import { encodePayload } from "@/lib/qr-types";
import { exportQR, type ExportFormat } from "@/lib/export";
import { useI18n } from "@/lib/i18n-context";
import type { Key } from "@/lib/i18n";

const typeKey: Record<string, Key> = {
  link: "tab.link",
  text: "tab.text",
  email: "tab.email",
  phone: "tab.phone",
  sms: "tab.sms",
  whatsapp: "tab.whatsapp",
  skype: "tab.skype",
  zoom: "tab.zoom",
  wifi: "tab.wifi",
  vcard: "tab.vcard",
  event: "tab.event",
  paypal: "tab.paypal",
  bitcoin: "tab.bitcoin",
};

export function HistoryList() {
  const { t, locale } = useI18n();
  const [items, setItems] = useState<HistoryItem[] | null>(null);

  useEffect(() => {
    setItems(loadHistory());
  }, []);

  function refresh() {
    setItems(loadHistory());
  }

  if (items === null) return null;

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] p-10 text-center">
        <HistoryIcon className="w-8 h-8 mx-auto text-[var(--muted)] mb-3" />
        <h3 className="font-semibold mb-1">{t("history.empty.title")}</h3>
        <p className="text-sm text-[var(--muted)]">{t("history.empty.text")}</p>
      </div>
    );
  }

  async function download(item: HistoryItem, format: ExportFormat) {
    const data = encodePayload(item.payload);
    await exportQR(data, item.style, format, "qrcode");
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button
          onClick={() => {
            if (confirm(t("history.confirmClear"))) {
              clearHistory();
              refresh();
            }
          }}
          className="text-xs text-[var(--muted)] hover:text-red-500 transition cursor-pointer"
        >
          {t("history.clearAll")}
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
          >
            {item.thumbnail && (
              <img
                src={item.thumbnail}
                alt=""
                className="w-full aspect-square rounded-xl bg-white object-contain border border-[var(--border)]"
              />
            )}
            <div className="mt-3 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
                  {t(typeKey[item.payload.type] ?? "tab.link")}
                </div>
                <div className="text-xs text-[var(--muted)]">
                  {new Date(item.createdAt).toLocaleString(
                    locale === "cs" ? "cs-CZ" : "en-US",
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => download(item, "png")}
                  title={t("history.downloadPng")}
                  className="p-2 rounded-lg hover:bg-[var(--accent)] transition cursor-pointer text-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    removeFromHistory(item.id);
                    refresh();
                  }}
                  title={t("history.delete")}
                  className="p-2 rounded-lg hover:bg-[var(--accent)] transition cursor-pointer text-[var(--muted)] hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
