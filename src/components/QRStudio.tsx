"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import qrcode from "qrcode-generator";

type QType = "url" | "text" | "wifi" | "contact" | "email" | "phone" | "sms";

type Fields = {
  url: string;
  text: string;
  ssid: string;
  password: string;
  enc: string;
  fn: string;
  ln: string;
  org: string;
  tel: string;
  email: string;
  subj: string;
  body: string;
  smsNum: string;
  smsBody: string;
};

const initialFields: Fields = {
  url: "https://kasparek.net",
  text: "",
  ssid: "",
  password: "",
  enc: "WPA",
  fn: "",
  ln: "",
  org: "",
  tel: "",
  email: "",
  subj: "",
  body: "",
  smsNum: "",
  smsBody: "",
};

type Props = {
  accent?: string;
  layout?: "split" | "stacked";
  dotStyle?: "rounded" | "dots";
  panelTitle?: string;
};

const font =
  "-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',sans-serif";

function rrPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  r = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function eye(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  m: number,
  fg: string,
  eyeBg: string,
) {
  ctx.fillStyle = fg;
  ctx.beginPath();
  rrPath(ctx, x, y, 7 * m, 7 * m, 7 * m * 0.28);
  ctx.fill();
  ctx.fillStyle = eyeBg;
  ctx.beginPath();
  rrPath(ctx, x + m, y + m, 5 * m, 5 * m, 5 * m * 0.26);
  ctx.fill();
  ctx.fillStyle = fg;
  ctx.beginPath();
  rrPath(ctx, x + 2 * m, y + 2 * m, 3 * m, 3 * m, 3 * m * 0.32);
  ctx.fill();
}

const esc = (s: string) => String(s).replace(/([\\;,:"])/g, "\\$1");

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 14px",
  border: "none",
  background: "#f5f5f7",
  borderRadius: 13,
  fontSize: 16,
  color: "#1d1d1f",
  outline: "none",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: ".04em",
  color: "#86868b",
  textTransform: "uppercase",
  marginBottom: 7,
};

export function QRStudio({
  accent = "#0071e3",
  layout = "split",
  dotStyle = "rounded",
  panelTitle = "QR Studio",
}: Props) {
  const [type, setType] = useState<QType>("url");
  const [fg, setFg] = useState("#1d1d1f");
  const [bg, setBg] = useState("#ffffff");
  const [logo, setLogo] = useState<string | null>(null);
  const [fields, setFields] = useState<Fields>(initialFields);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);

  const setField = (k: keyof Fields, v: string) =>
    setFields((s) => ({ ...s, [k]: v }));

  const buildText = useCallback(() => {
    const f = fields;
    const v = (k: keyof Fields) => (f[k] || "").trim();
    switch (type) {
      case "url":
        return v("url");
      case "text":
        return f.text || "";
      case "wifi":
        if (!v("ssid")) return "";
        return `WIFI:T:${f.enc || "WPA"};S:${esc(v("ssid"))};P:${esc(v("password"))};;`;
      case "contact":
        if (!v("fn") && !v("ln")) return "";
        return [
          "BEGIN:VCARD",
          "VERSION:3.0",
          `N:${v("ln")};${v("fn")}`,
          `FN:${(v("fn") + " " + v("ln")).trim()}`,
          `ORG:${v("org")}`,
          `TEL:${v("tel")}`,
          `EMAIL:${v("email")}`,
          "END:VCARD",
        ].join("\n");
      case "email": {
        if (!v("email")) return "";
        const q: string[] = [];
        if (v("subj")) q.push("subject=" + encodeURIComponent(v("subj")));
        if (f.body) q.push("body=" + encodeURIComponent(f.body));
        return "mailto:" + v("email") + (q.length ? "?" + q.join("&") : "");
      }
      case "phone":
        return v("tel") ? "tel:" + v("tel") : "";
      case "sms":
        return v("smsNum") ? `SMSTO:${v("smsNum")}:${f.smsBody || ""}` : "";
      default:
        return "";
    }
  }, [type, fields]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const text = buildText();
    let qr: ReturnType<typeof qrcode> | null = null;
    if (text) {
      try {
        qr = qrcode(0, "H");
        qr.addData(text);
        qr.make();
      } catch {
        qr = null;
      }
    }
    if (!qr) {
      const s = 600;
      canvas.width = s;
      canvas.height = s;
      ctx.fillStyle = bg === "transparent" ? "#fff" : bg;
      ctx.fillRect(0, 0, s, s);
      return;
    }
    const count = qr.getModuleCount();
    const quiet = 4;
    const total = count + quiet * 2;
    const m = Math.max(6, Math.round(1100 / total));
    const dim = total * m;
    const off = quiet * m;
    canvas.width = dim;
    canvas.height = dim;
    if (bg === "transparent") ctx.clearRect(0, 0, dim, dim);
    else {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, dim, dim);
    }
    const eyeBg = bg === "transparent" ? "#ffffff" : bg;
    const dots = dotStyle === "dots";
    const isFinder = (r: number, c: number) =>
      (r < 7 && c < 7) ||
      (r < 7 && c >= count - 7) ||
      (r >= count - 7 && c < 7);
    ctx.fillStyle = fg;
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (!qr.isDark(r, c) || isFinder(r, c)) continue;
        const x = off + c * m;
        const y = off + r * m;
        if (dots) {
          ctx.beginPath();
          ctx.arc(x + m / 2, y + m / 2, m * 0.42, 0, 6.2832);
          ctx.fill();
        } else {
          ctx.beginPath();
          rrPath(ctx, x + m * 0.08, y + m * 0.08, m * 0.84, m * 0.84, m * 0.3);
          ctx.fill();
        }
      }
    }
    (
      [
        [0, 0],
        [0, count - 7],
        [count - 7, 0],
      ] as const
    ).forEach(([r0, c0]) => eye(ctx, off + c0 * m, off + r0 * m, m, fg, eyeBg));
    const img = logoImgRef.current;
    if (logo && img && img.complete) {
      const ls = dim * 0.2;
      const lx = (dim - ls) / 2;
      const ly = (dim - ls) / 2;
      const pad = ls * 0.12;
      ctx.fillStyle = eyeBg;
      ctx.beginPath();
      rrPath(ctx, lx - pad, ly - pad, ls + 2 * pad, ls + 2 * pad, ls * 0.24);
      ctx.fill();
      ctx.save();
      ctx.beginPath();
      rrPath(ctx, lx, ly, ls, ls, ls * 0.2);
      ctx.clip();
      ctx.drawImage(img, lx, ly, ls, ls);
      ctx.restore();
    }
  }, [buildText, bg, fg, dotStyle, logo]);

  useEffect(() => {
    draw();
  }, [draw]);

  function buildSvg() {
    const text = buildText();
    if (!text) return "";
    let qr: ReturnType<typeof qrcode>;
    try {
      qr = qrcode(0, "H");
      qr.addData(text);
      qr.make();
    } catch {
      return "";
    }
    const count = qr.getModuleCount();
    const quiet = 4;
    const m = 10;
    const total = count + quiet * 2;
    const dim = total * m;
    const off = quiet * m;
    const dots = dotStyle === "dots";
    const eyeBg = bg === "transparent" ? "#ffffff" : bg;
    const isFinder = (r: number, c: number) =>
      (r < 7 && c < 7) ||
      (r < 7 && c >= count - 7) ||
      (r >= count - 7 && c < 7);
    const p: string[] = [
      `<svg xmlns='http://www.w3.org/2000/svg' width='${dim}' height='${dim}' viewBox='0 0 ${dim} ${dim}'>`,
    ];
    if (bg !== "transparent")
      p.push(`<rect width='${dim}' height='${dim}' fill='${bg}'/>`);
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (!qr.isDark(r, c) || isFinder(r, c)) continue;
        const x = off + c * m;
        const y = off + r * m;
        if (dots)
          p.push(
            `<circle cx='${x + m / 2}' cy='${y + m / 2}' r='${m * 0.42}' fill='${fg}'/>`,
          );
        else
          p.push(
            `<rect x='${x + m * 0.08}' y='${y + m * 0.08}' width='${m * 0.84}' height='${m * 0.84}' rx='${m * 0.3}' fill='${fg}'/>`,
          );
      }
    }
    (
      [
        [0, 0],
        [0, count - 7],
        [count - 7, 0],
      ] as const
    ).forEach(([r0, c0]) => {
      const x = off + c0 * m;
      const y = off + r0 * m;
      p.push(
        `<rect x='${x}' y='${y}' width='${7 * m}' height='${7 * m}' rx='${7 * m * 0.28}' fill='${fg}'/>`,
      );
      p.push(
        `<rect x='${x + m}' y='${y + m}' width='${5 * m}' height='${5 * m}' rx='${5 * m * 0.26}' fill='${eyeBg}'/>`,
      );
      p.push(
        `<rect x='${x + 2 * m}' y='${y + 2 * m}' width='${3 * m}' height='${3 * m}' rx='${3 * m * 0.32}' fill='${fg}'/>`,
      );
    });
    if (logo) {
      const ls = dim * 0.2;
      const lx = (dim - ls) / 2;
      const ly = (dim - ls) / 2;
      const pad = ls * 0.12;
      p.push(
        `<rect x='${lx - pad}' y='${ly - pad}' width='${ls + 2 * pad}' height='${ls + 2 * pad}' rx='${ls * 0.24}' fill='${eyeBg}'/>`,
      );
      p.push(
        `<clipPath id='lc'><rect x='${lx}' y='${ly}' width='${ls}' height='${ls}' rx='${ls * 0.2}'/></clipPath>`,
      );
      p.push(
        `<image x='${lx}' y='${ly}' width='${ls}' height='${ls}' href='${logo}' clip-path='url(#lc)' preserveAspectRatio='xMidYMid slice'/>`,
      );
    }
    p.push("</svg>");
    return p.join("");
  }

  function downloadPng() {
    const c = canvasRef.current;
    if (!c) return;
    const a = document.createElement("a");
    a.download = "qr-code.png";
    a.href = c.toDataURL("image/png");
    a.click();
  }

  function downloadSvg() {
    const s = buildSvg();
    if (!s) return;
    const url = URL.createObjectURL(new Blob([s], { type: "image/svg+xml" }));
    const a = document.createElement("a");
    a.download = "qr-code.svg";
    a.href = url;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function onLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => {
        logoImgRef.current = img;
        setLogo(fr.result as string);
      };
      img.src = fr.result as string;
    };
    fr.readAsDataURL(file);
  }

  function removeLogo() {
    logoImgRef.current = null;
    setLogo(null);
  }

  const containerDir = layout === "stacked" ? "column" : "row";
  const previewSize = layout === "stacked" ? "300px" : "240px";
  const accentGlow = accent + "55";

  const typeDefs: [QType, string][] = [
    ["url", "Link"],
    ["text", "Text"],
    ["wifi", "Wi-Fi"],
    ["contact", "Contact"],
    ["email", "Email"],
    ["phone", "Phone"],
    ["sms", "SMS"],
  ];

  const pill = (active: boolean): React.CSSProperties => ({
    padding: "8px 15px",
    border: "none",
    borderRadius: 980,
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "all .15s",
    background: active ? accent : "#f5f5f7",
    color: active ? "#fff" : "#1d1d1f",
  });

  const swatch = (c: string, active: boolean): React.CSSProperties => ({
    width: 30,
    height: 30,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    background: c,
    boxShadow: active
      ? `0 0 0 2px #fff, 0 0 0 4px ${accent}`
      : "inset 0 0 0 1px rgba(0,0,0,.1)",
  });

  const fgColors = ["#1d1d1f", "#0071e3", "#5e5ce6", "#248a3d", "#c93400"];
  const bgColors = ["#ffffff", "#f5f5f7", "#1d1d1f", "transparent"];

  return (
    <div
      style={{
        fontFamily: font,
        background: "#ffffff",
        borderRadius: 28,
        boxShadow:
          "0 1px 2px rgba(0,0,0,.04),0 18px 50px rgba(0,0,0,.10)",
        padding: "34px 36px 32px",
        color: "#1d1d1f",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 26 }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 13,
            background: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 4px 12px ${accentGlow}`,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 3h7v7H3V3zm2 2v3h3V5H5zM14 3h7v7h-7V3zm2 2v3h3V5h-3zM3 14h7v7H3v-7zm2 2v3h3v-3H5zM14 14h2.5v2.5H14V14zm4.5 0H21v2.5h-2.5V14zM14 18.5h2.5V21H14v-2.5zm4.5 0H21V21h-2.5v-2.5z"
              fill="#fff"
            />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 21, fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.1 }}>
            {panelTitle}
          </div>
          <div style={{ fontSize: 14, color: "#86868b", marginTop: 2 }}>
            Create a QR code in seconds
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 30, flexDirection: containerDir }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              background: "#fff",
              border: "1px solid #ededf0",
              borderRadius: 24,
              padding: 18,
              boxShadow: "0 8px 24px rgba(0,0,0,.06)",
            }}
          >
            <canvas
              ref={canvasRef}
              style={{
                display: "block",
                width: previewSize,
                height: previewSize,
                imageRendering: "-webkit-optimize-contrast" as React.CSSProperties["imageRendering"],
                borderRadius: 8,
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 10, width: "100%" }}>
            <button
              onClick={downloadPng}
              style={{
                flex: 1,
                padding: "11px 0",
                border: "none",
                borderRadius: 13,
                background: accent,
                color: "#fff",
                fontSize: 15,
                fontWeight: 500,
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              Download PNG
            </button>
            <button
              onClick={downloadSvg}
              style={{
                flex: 1,
                padding: "11px 0",
                border: "1px solid #d2d2d7",
                borderRadius: 13,
                background: "#fff",
                color: "#1d1d1f",
                fontSize: 15,
                fontWeight: 500,
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              SVG
            </button>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {typeDefs.map(([id, label]) => (
              <button key={id} onClick={() => setType(id)} style={pill(type === id)}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            {type === "url" && (
              <div>
                <div style={labelStyle}>Website URL</div>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={fields.url}
                  onChange={(e) => setField("url", e.target.value)}
                  style={inputStyle}
                />
              </div>
            )}

            {type === "text" && (
              <div>
                <div style={labelStyle}>Plain text</div>
                <textarea
                  placeholder="Type anything…"
                  value={fields.text}
                  onChange={(e) => setField("text", e.target.value)}
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>
            )}

            {type === "wifi" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <div style={labelStyle}>Network name (SSID)</div>
                  <input
                    type="text"
                    placeholder="Home Wi-Fi"
                    value={fields.ssid}
                    onChange={(e) => setField("ssid", e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <div style={labelStyle}>Password</div>
                  <input
                    type="text"
                    placeholder="••••••••"
                    value={fields.password}
                    onChange={(e) => setField("password", e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <div style={labelStyle}>Security</div>
                  <select
                    value={fields.enc}
                    onChange={(e) => setField("enc", e.target.value)}
                    style={{ ...inputStyle, appearance: "none" }}
                  >
                    <option value="WPA">WPA / WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None</option>
                  </select>
                </div>
              </div>
            )}

            {type === "contact" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={labelStyle}>First name</div>
                    <input
                      type="text"
                      placeholder="Jan"
                      value={fields.fn}
                      onChange={(e) => setField("fn", e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={labelStyle}>Last name</div>
                    <input
                      type="text"
                      placeholder="Kašpárek"
                      value={fields.ln}
                      onChange={(e) => setField("ln", e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div>
                  <div style={labelStyle}>Phone</div>
                  <input
                    type="text"
                    placeholder="+420 000 000 000"
                    value={fields.tel}
                    onChange={(e) => setField("tel", e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <div style={labelStyle}>Email</div>
                  <input
                    type="text"
                    placeholder="jan@example.com"
                    value={fields.email}
                    onChange={(e) => setField("email", e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <div style={labelStyle}>Company</div>
                  <input
                    type="text"
                    placeholder="Optional"
                    value={fields.org}
                    onChange={(e) => setField("org", e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            {type === "email" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <div style={labelStyle}>To</div>
                  <input
                    type="text"
                    placeholder="hello@example.com"
                    value={fields.email}
                    onChange={(e) => setField("email", e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <div style={labelStyle}>Subject</div>
                  <input
                    type="text"
                    placeholder="Optional"
                    value={fields.subj}
                    onChange={(e) => setField("subj", e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <div style={labelStyle}>Message</div>
                  <textarea
                    placeholder="Optional"
                    value={fields.body}
                    onChange={(e) => setField("body", e.target.value)}
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>
              </div>
            )}

            {type === "phone" && (
              <div>
                <div style={labelStyle}>Phone number</div>
                <input
                  type="text"
                  placeholder="+420 000 000 000"
                  value={fields.tel}
                  onChange={(e) => setField("tel", e.target.value)}
                  style={inputStyle}
                />
              </div>
            )}

            {type === "sms" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <div style={labelStyle}>Phone number</div>
                  <input
                    type="text"
                    placeholder="+420 000 000 000"
                    value={fields.smsNum}
                    onChange={(e) => setField("smsNum", e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <div style={labelStyle}>Message</div>
                  <textarea
                    placeholder="Pre-filled text…"
                    value={fields.smsBody}
                    onChange={(e) => setField("smsBody", e.target.value)}
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>
              </div>
            )}
          </div>

          <div style={{ height: 1, background: "#ededf0", margin: "22px 0" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div style={{ ...labelStyle, marginBottom: 0 }}>Dot color</div>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                {fgColors.map((c) => (
                  <button key={c} onClick={() => setFg(c)} style={swatch(c, fg === c)} />
                ))}
                <label
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "inset 0 0 0 1px rgba(0,0,0,.08)",
                    background:
                      "conic-gradient(from 90deg,#ff3b30,#ff9500,#34c759,#0071e3,#5e5ce6,#ff3b30)",
                  }}
                >
                  <input
                    type="color"
                    value={/^#[0-9a-fA-F]{6}$/.test(fg) ? fg : "#1d1d1f"}
                    onChange={(e) => setFg(e.target.value)}
                    style={{
                      position: "absolute",
                      inset: -6,
                      width: 42,
                      height: 42,
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      opacity: 0,
                    }}
                  />
                </label>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div style={{ ...labelStyle, marginBottom: 0 }}>Background</div>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                {bgColors.map((c) =>
                  c === "transparent" ? (
                    <button
                      key={c}
                      onClick={() => setBg(c)}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        border: "none",
                        cursor: "pointer",
                        background:
                          "linear-gradient(135deg,#fff 45%,#ff3b30 45%,#ff3b30 55%,#fff 55%)",
                        boxShadow:
                          bg === c
                            ? `0 0 0 2px #fff, 0 0 0 4px ${accent}`
                            : "inset 0 0 0 1px rgba(0,0,0,.12)",
                      }}
                    />
                  ) : (
                    <button key={c} onClick={() => setBg(c)} style={swatch(c, bg === c)} />
                  ),
                )}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div style={{ ...labelStyle, marginBottom: 0 }}>Center logo</div>
              {logo ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo}
                    alt="Logo"
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      objectFit: "cover",
                      boxShadow: "inset 0 0 0 1px rgba(0,0,0,.08)",
                    }}
                  />
                  <button
                    onClick={removeLogo}
                    style={{
                      padding: "8px 14px",
                      border: "1px solid #d2d2d7",
                      borderRadius: 980,
                      background: "#fff",
                      color: "#1d1d1f",
                      fontSize: 14,
                      fontFamily: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #d2d2d7",
                    borderRadius: 980,
                    background: "#fff",
                    color: accent,
                    fontSize: 14,
                    fontWeight: 500,
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >
                  Add image
                  <input type="file" accept="image/*" onChange={onLogo} style={{ display: "none" }} />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
