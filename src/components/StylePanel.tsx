"use client";

import { useRef, type ReactNode } from "react";
import type {
  CornerDotType,
  CornerSquareType,
  DotType,
  ErrorCorrection,
  QRStyle,
} from "@/lib/qr-style";
import { ColorPicker, Field, Input, Label, Select, Switch } from "./ui";
import { Upload, X } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import type { Key } from "@/lib/i18n";

type Props = {
  style: QRStyle;
  onChange: (s: QRStyle) => void;
  frameLabel: string;
  onFrameLabelChange: (v: string) => void;
  frameColor: string;
  onFrameColorChange: (v: string) => void;
};

const dotStyles: { value: DotType; key: Key }[] = [
  { value: "square", key: "style.dot.square" },
  { value: "dots", key: "style.dot.dots" },
  { value: "rounded", key: "style.dot.rounded" },
  { value: "extra-rounded", key: "style.dot.extraRounded" },
  { value: "classy", key: "style.dot.classy" },
  { value: "classy-rounded", key: "style.dot.classyRounded" },
];

const cornerSquareStyles: { value: CornerSquareType; key: Key }[] = [
  { value: "square", key: "corner.square" },
  { value: "dot", key: "corner.dot" },
  { value: "extra-rounded", key: "corner.extraRounded" },
];

const cornerDotStyles: { value: CornerDotType; key: Key }[] = [
  { value: "square", key: "corner.square" },
  { value: "dot", key: "corner.dot" },
];

const presets: { key: Key; partial: Partial<QRStyle> }[] = [
  {
    key: "preset.classic",
    partial: {
      dotStyle: "square",
      dotColor: "#000000",
      bgColor: "#ffffff",
      cornerSquareStyle: "square",
      cornerSquareColor: "#000000",
      cornerDotStyle: "square",
      cornerDotColor: "#000000",
      dotGradient: "none",
    },
  },
  {
    key: "preset.modern",
    partial: {
      dotStyle: "rounded",
      dotColor: "#0f172a",
      bgColor: "#ffffff",
      cornerSquareStyle: "extra-rounded",
      cornerSquareColor: "#0f172a",
      cornerDotStyle: "dot",
      cornerDotColor: "#0f172a",
      dotGradient: "none",
    },
  },
  {
    key: "preset.sunset",
    partial: {
      dotStyle: "extra-rounded",
      dotColor: "#c2410c",
      bgColor: "#fff7ed",
      cornerSquareStyle: "extra-rounded",
      cornerSquareColor: "#c2410c",
      cornerDotStyle: "dot",
      cornerDotColor: "#c2410c",
      dotGradient: "none",
    },
  },
  {
    key: "preset.ocean",
    partial: {
      dotStyle: "dots",
      dotColor: "#1e40af",
      bgColor: "#ecfeff",
      cornerSquareStyle: "extra-rounded",
      cornerSquareColor: "#1e40af",
      cornerDotStyle: "dot",
      cornerDotColor: "#1e40af",
      dotGradient: "none",
    },
  },
  {
    key: "preset.forest",
    partial: {
      dotStyle: "classy-rounded",
      dotColor: "#14532d",
      bgColor: "#f7fee7",
      cornerSquareStyle: "extra-rounded",
      cornerSquareColor: "#14532d",
      cornerDotStyle: "dot",
      cornerDotColor: "#14532d",
      dotGradient: "none",
    },
  },
  {
    key: "preset.noir",
    partial: {
      dotStyle: "rounded",
      dotColor: "#fafafa",
      bgColor: "#0a0a0a",
      cornerSquareStyle: "extra-rounded",
      cornerSquareColor: "#fafafa",
      cornerDotStyle: "dot",
      cornerDotColor: "#fafafa",
      dotGradient: "none",
    },
  },
];

const dotCorners: Record<DotType, [boolean, boolean, boolean, boolean]> = {
  square: [false, false, false, false],
  dots: [false, false, false, false],
  rounded: [true, true, true, true],
  "extra-rounded": [true, true, true, true],
  classy: [true, false, true, false],
  "classy-rounded": [true, true, true, false],
};

const dotRadius: Record<DotType, number> = {
  square: 0,
  dots: 0,
  rounded: 2,
  "extra-rounded": 3.5,
  classy: 3.5,
  "classy-rounded": 3.5,
};

function rrPath(
  x: number,
  y: number,
  s: number,
  r: number,
  c: [boolean, boolean, boolean, boolean],
) {
  const [tl, tr, br, bl] = c;
  return (
    `M${x + (tl ? r : 0)},${y}` +
    `L${x + s - (tr ? r : 0)},${y}` +
    (tr ? `Q${x + s},${y} ${x + s},${y + r}` : "") +
    `L${x + s},${y + s - (br ? r : 0)}` +
    (br ? `Q${x + s},${y + s} ${x + s - r},${y + s}` : "") +
    `L${x + (bl ? r : 0)},${y + s}` +
    (bl ? `Q${x},${y + s} ${x},${y + s - r}` : "") +
    `L${x},${y + (tl ? r : 0)}` +
    (tl ? `Q${x},${y} ${x + r},${y}` : "") +
    "Z"
  );
}

function DotSwatch({ type }: { type: DotType }) {
  const s = 7,
    gap = 2,
    off = 1.5;
  const cells: ReactNode[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const x = off + c * (s + gap);
      const y = off + r * (s + gap);
      const key = `${r}-${c}`;
      cells.push(
        type === "dots" ? (
          <circle key={key} cx={x + s / 2} cy={y + s / 2} r={s / 2} />
        ) : (
          <path key={key} d={rrPath(x, y, s, dotRadius[type], dotCorners[type])} />
        ),
      );
    }
  }
  return (
    <svg viewBox="0 0 28 28" className="w-7 h-7" fill="currentColor">
      {cells}
    </svg>
  );
}

function CornerSquareSwatch({ type }: { type: CornerSquareType }) {
  return (
    <svg
      viewBox="0 0 28 28"
      className="w-7 h-7"
      fill="none"
      stroke="currentColor"
      strokeWidth={4}
    >
      {type === "dot" ? (
        <circle cx={14} cy={14} r={11} />
      ) : (
        <rect x={3} y={3} width={22} height={22} rx={type === "extra-rounded" ? 7 : 0} />
      )}
    </svg>
  );
}

function CornerDotSwatch({ type }: { type: CornerDotType }) {
  return (
    <svg viewBox="0 0 28 28" className="w-7 h-7" fill="currentColor">
      {type === "dot" ? (
        <circle cx={14} cy={14} r={6} />
      ) : (
        <rect x={8} y={8} width={12} height={12} />
      )}
    </svg>
  );
}

function ShapeOption({
  selected,
  onClick,
  label,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-lg border px-1 py-2 transition cursor-pointer ${
        selected
          ? "border-[var(--primary)] bg-[var(--accent)] ring-1 ring-[var(--primary)] text-[var(--foreground)]"
          : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--foreground)]"
      }`}
    >
      {children}
      <span className="text-[10px] leading-tight text-center">{label}</span>
    </button>
  );
}

export function StylePanel({
  style,
  onChange,
  frameLabel,
  onFrameLabelChange,
  frameColor,
  onFrameColorChange,
}: Props) {
  const { t } = useI18n();
  const fileRef = useRef<HTMLInputElement | null>(null);

  function handleLogo(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        onChange({ ...style, logo: result });
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-sm font-semibold mb-3 text-[var(--foreground)]">
          {t("style.presets")}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((p) => (
            <button
              key={p.key}
              onClick={() => onChange({ ...style, ...p.partial })}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 py-2 text-xs font-medium hover:border-[var(--primary)] hover:bg-[var(--accent)] transition cursor-pointer"
            >
              {t(p.key)}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-3">{t("style.dots")}</h3>
        <div className="space-y-3">
          <div>
            <Label>{t("style.dotShape")}</Label>
            <div className="grid grid-cols-3 gap-2">
              {dotStyles.map((d) => (
                <ShapeOption
                  key={d.value}
                  selected={style.dotStyle === d.value}
                  onClick={() => onChange({ ...style, dotStyle: d.value })}
                  label={t(d.key)}
                >
                  <DotSwatch type={d.value} />
                </ShapeOption>
              ))}
            </div>
          </div>
          <ColorPicker
            label={t("style.color1")}
            value={style.dotColor}
            onChange={(v) =>
              onChange({ ...style, dotColor: v, dotGradient: "none" })
            }
          />
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-3">{t("style.bg")}</h3>
        <div className="space-y-3">
          <Switch
            checked={style.bgTransparent}
            onChange={(v) => onChange({ ...style, bgTransparent: v })}
            label={t("style.transparent")}
          />
          {!style.bgTransparent && (
            <ColorPicker
              label={t("style.bgColor")}
              value={style.bgColor}
              onChange={(v) => onChange({ ...style, bgColor: v })}
            />
          )}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-3">{t("style.corners")}</h3>
        <div className="space-y-3">
          <div>
            <Label>{t("style.frameShape")}</Label>
            <div className="grid grid-cols-3 gap-2">
              {cornerSquareStyles.map((d) => (
                <ShapeOption
                  key={d.value}
                  selected={style.cornerSquareStyle === d.value}
                  onClick={() =>
                    onChange({ ...style, cornerSquareStyle: d.value })
                  }
                  label={t(d.key)}
                >
                  <CornerSquareSwatch type={d.value} />
                </ShapeOption>
              ))}
            </div>
          </div>
          <div>
            <Label>{t("style.centerShape")}</Label>
            <div className="grid grid-cols-3 gap-2">
              {cornerDotStyles.map((d) => (
                <ShapeOption
                  key={d.value}
                  selected={style.cornerDotStyle === d.value}
                  onClick={() => onChange({ ...style, cornerDotStyle: d.value })}
                  label={t(d.key)}
                >
                  <CornerDotSwatch type={d.value} />
                </ShapeOption>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <ColorPicker
            label={t("style.frameColor")}
            value={style.cornerSquareColor}
            onChange={(v) => onChange({ ...style, cornerSquareColor: v })}
          />
          <ColorPicker
            label={t("style.centerColor")}
            value={style.cornerDotColor}
            onChange={(v) => onChange({ ...style, cornerDotColor: v })}
          />
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-3">{t("style.logo")}</h3>
        <div className="space-y-3">
          {style.logo ? (
            <div className="flex items-center gap-3">
              <img
                src={style.logo}
                alt="Logo"
                className="w-14 h-14 object-contain rounded-md border border-[var(--border)] bg-white p-1"
              />
              <button
                onClick={() => onChange({ ...style, logo: null })}
                className="inline-flex items-center gap-1 text-xs text-[var(--muted)] hover:text-red-500 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> {t("style.logoRemove")}
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full rounded-lg border border-dashed border-[var(--border)] bg-[var(--card)] px-3 py-4 text-sm text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--foreground)] transition cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              {t("style.logoUpload")}
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleLogo(f);
              e.target.value = "";
            }}
          />
          {style.logo && (
            <Field
              label={t("style.logoSize", { pct: Math.round(style.logoSize * 100) })}
            >
              <input
                type="range"
                min="0.1"
                max="0.5"
                step="0.01"
                value={style.logoSize}
                onChange={(e) =>
                  onChange({ ...style, logoSize: parseFloat(e.target.value) })
                }
                className="w-full"
              />
            </Field>
          )}
          {style.logo && (
            <Switch
              checked={style.hideBgDots}
              onChange={(v) => onChange({ ...style, hideBgDots: v })}
              label={t("style.hideDotsBehindLogo")}
            />
          )}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-3">{t("style.frame")}</h3>
        <div className="space-y-3">
          <Field
            label={t("style.frameText")}
            hint={t("style.frameTextHint")}
          >
            <Input
              value={frameLabel}
              onChange={(e) => onFrameLabelChange(e.target.value)}
              placeholder={t("style.frameTextPh")}
            />
          </Field>
          {frameLabel && (
            <ColorPicker
              label={t("style.frameColorLabel")}
              value={frameColor}
              onChange={onFrameColorChange}
            />
          )}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold mb-3">{t("style.advanced")}</h3>
        <div className="space-y-3">
          <Field
            label={t("style.size", { px: style.size })}
            hint={t("style.sizeHint")}
          >
            <input
              type="range"
              min="200"
              max="1200"
              step="50"
              value={style.size}
              onChange={(e) =>
                onChange({ ...style, size: parseInt(e.target.value) })
              }
              className="w-full"
            />
          </Field>
          <Field
            label={t("style.errorCorrection")}
            hint={t("style.ecHint")}
          >
            <Select
              value={style.errorCorrection}
              onChange={(e) =>
                onChange({
                  ...style,
                  errorCorrection: e.target.value as ErrorCorrection,
                })
              }
            >
              <option value="L">{t("ec.L")}</option>
              <option value="M">{t("ec.M")}</option>
              <option value="Q">{t("ec.Q")}</option>
              <option value="H">{t("ec.H")}</option>
            </Select>
          </Field>
        </div>
      </section>
    </div>
  );
}
