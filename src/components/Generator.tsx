"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Mail,
  Phone,
  MessageSquare,
  Wifi,
  Contact,
  Calendar,
  CreditCard,
  Bitcoin,
  Link as LinkIcon,
  Type,
  Video,
  MessageCircle,
  Download,
  ChevronDown,
  Save,
  QrCode,
} from "lucide-react";
import { QRPreview } from "./QRPreview";
import { QRForm } from "./QRForms";
import { StylePanel } from "./StylePanel";
import {
  defaultPayloads,
  encodePayload,
  type QRPayload,
  type QRType,
} from "@/lib/qr-types";
import { defaultStyle, type QRStyle } from "@/lib/qr-style";
import { exportQR, getThumbnail, type ExportFormat } from "@/lib/export";
import { addToHistory } from "@/lib/history";
import { useI18n } from "@/lib/i18n-context";
import type { Key } from "@/lib/i18n";

const tabs: {
  type: QRType;
  key: Key;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { type: "link", key: "tab.link", icon: LinkIcon },
  { type: "vcard", key: "tab.vcard", icon: Contact },
  { type: "text", key: "tab.text", icon: Type },
  { type: "email", key: "tab.email", icon: Mail },
  { type: "phone", key: "tab.phone", icon: Phone },
  { type: "sms", key: "tab.sms", icon: MessageSquare },
  { type: "whatsapp", key: "tab.whatsapp", icon: MessageCircle },
  { type: "skype", key: "tab.skype", icon: Video },
  { type: "zoom", key: "tab.zoom", icon: Video },
  { type: "wifi", key: "tab.wifi", icon: Wifi },
  { type: "event", key: "tab.event", icon: Calendar },
  { type: "paypal", key: "tab.paypal", icon: CreditCard },
  { type: "bitcoin", key: "tab.bitcoin", icon: Bitcoin },
];

export function Generator({
  initial,
}: {
  initial?: {
    payload: QRPayload;
    style: QRStyle;
    frameLabel: string;
    frameColor: string;
  };
}) {
  const { t } = useI18n();
  const [type, setType] = useState<QRType>(initial?.payload.type ?? "link");
  const [payloads, setPayloads] = useState<Record<QRType, QRPayload>>(() => {
    if (initial) {
      return { ...defaultPayloads, [initial.payload.type]: initial.payload };
    }
    return defaultPayloads;
  });
  const [style, setStyle] = useState<QRStyle>(initial?.style ?? defaultStyle);
  const [frameLabel, setFrameLabel] = useState(initial?.frameLabel ?? "");
  const [frameColor, setFrameColor] = useState(
    initial?.frameColor ?? "#0f172a",
  );
  const [exporting, setExporting] = useState(false);
  const [exportMenu, setExportMenu] = useState(false);
  const [saved, setSaved] = useState(false);

  const payload = payloads[type];
  const data = useMemo(() => encodePayload(payload), [payload]);

  const setPayload = useCallback((p: QRPayload) => {
    setPayloads((prev) => ({ ...prev, [p.type]: p }));
  }, []);

  async function handleExport(format: ExportFormat) {
    setExporting(true);
    setExportMenu(false);
    try {
      await exportQR(data, style, format, "qrcode");
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(false);
    }
  }

  async function handleSave() {
    try {
      const thumbnail = await getThumbnail(data, style);
      addToHistory({ payload, style, frameLabel, frameColor, thumbnail });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_18px_50px_rgba(0,0,0,0.08)] p-5 sm:p-8">
      <div className="flex items-center gap-3 mb-7">
        <div className="w-11 h-11 rounded-[13px] flex items-center justify-center text-white bg-[var(--primary)] shadow-md">
          <QrCode className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xl font-semibold tracking-tight leading-tight text-[var(--foreground)]">
            QR Studio
          </div>
          <div className="text-sm text-[var(--muted)]">{t("gen.subtitle")}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-7">
        <div className="space-y-6 min-w-0 order-2 lg:order-1">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = tab.type === type;
              return (
                <button
                  key={tab.type}
                  onClick={() => setType(tab.type)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                    active
                      ? "bg-[var(--primary)] text-white shadow-sm"
                      : "bg-[var(--accent)] text-[var(--foreground)] hover:opacity-80"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t(tab.key)}
                </button>
              );
            })}
          </div>

          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[var(--muted)] mb-3">
              {t("gen.contentTitle")}
            </h2>
            <QRForm payload={payload} onChange={setPayload} />
          </div>

          <div className="h-px bg-[var(--border)]" />

          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[var(--muted)] mb-4">
              {t("gen.styleTitle")}
            </h2>
            <StylePanel
              style={style}
              onChange={setStyle}
              frameLabel={frameLabel}
              onFrameLabelChange={setFrameLabel}
              frameColor={frameColor}
              onFrameColorChange={setFrameColor}
            />
          </div>
        </div>

        <div className="lg:sticky lg:top-20 self-start space-y-3 order-1 lg:order-2">
          <div className="rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
            <QRPreview
              data={data}
              style={style}
              frameLabel={frameLabel}
              frameColor={frameColor}
            />
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1 flex">
              <button
                onClick={() => handleExport("svg")}
                disabled={exporting}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-l-[14px] bg-[var(--primary)] text-white text-sm font-semibold px-4 py-3 hover:opacity-90 disabled:opacity-50 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {exporting ? t("gen.downloading") : t("gen.downloadSvg")}
              </button>
              <button
                onClick={() => setExportMenu((v) => !v)}
                disabled={exporting}
                aria-label={t("gen.otherFormat")}
                className="px-3 rounded-r-[14px] bg-[var(--primary)] text-white border-l border-white/20 hover:opacity-90 disabled:opacity-50 transition cursor-pointer"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {exportMenu && (
                <div className="absolute z-10 top-full mt-1 right-0 w-32 rounded-[14px] border border-[var(--border)] bg-[var(--card)] shadow-lg overflow-hidden">
                  {(["svg", "png", "jpg", "webp", "pdf"] as ExportFormat[]).map(
                    (f) => (
                      <button
                        key={f}
                        onClick={() => handleExport(f)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--accent)] transition cursor-pointer uppercase tracking-wide"
                      >
                        {f}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
            <button
              onClick={handleSave}
              title={t("gen.saveTooltip")}
              className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-[var(--border)] bg-[var(--card)] text-sm font-semibold px-4 py-3 hover:bg-[var(--accent)] transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {saved ? t("gen.saved") : t("gen.save")}
            </button>
          </div>

          <p className="text-[11px] text-[var(--muted)] text-center px-2">
            {t("gen.tip")}
          </p>
        </div>
      </div>
    </div>
  );
}
