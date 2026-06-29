"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Upload, Copy, ExternalLink, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

type Status = "idle" | "scanning" | "done" | "error";

export function Scanner() {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const scannerRef = useRef<unknown>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  async function startScanner() {
    setError("");
    setResult("");
    setStatus("scanning");
    try {
      const mod = await import("html5-qrcode");
      const { Html5Qrcode } = mod;
      if (!containerRef.current) return;
      const id = "qr-reader-region";
      containerRef.current.id = id;
      const h5 = new Html5Qrcode(id);
      scannerRef.current = h5;
      await h5.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decoded: string) => {
          setResult(decoded);
          setStatus("done");
          stopScanner();
        },
        () => {},
      );
    } catch (e) {
      console.error(e);
      setError(t("scanner.error.camera"));
      setStatus("error");
    }
  }

  function stopScanner() {
    const ref = scannerRef.current as
      | { stop: () => Promise<void>; clear: () => void; getState: () => number }
      | null;
    if (ref) {
      try {
        if (ref.getState() === 2) {
          ref.stop().then(() => ref.clear()).catch(() => {});
        } else {
          ref.clear();
        }
      } catch {}
      scannerRef.current = null;
    }
  }

  async function handleFile(file: File) {
    setError("");
    setResult("");
    try {
      const mod = await import("html5-qrcode");
      const { Html5Qrcode } = mod;
      const h5 = new Html5Qrcode("file-scan-tmp", false);
      const text = await h5.scanFile(file, true);
      setResult(text);
      setStatus("done");
    } catch (e) {
      console.error(e);
      setError(t("scanner.error.image"));
      setStatus("error");
    }
  }

  function copyResult() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  const looksLikeUrl = /^(https?:\/\/|mailto:|tel:|sms:|bitcoin:|skype:|WIFI:)/i.test(result);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="aspect-square w-full max-w-md mx-auto rounded-xl overflow-hidden bg-black/90 flex items-center justify-center relative">
          <div ref={containerRef} className="w-full h-full" />
          {status !== "scanning" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/70">
              <Camera className="w-10 h-10" />
              <p className="text-sm">{t("scanner.notActive")}</p>
            </div>
          )}
        </div>
        <div id="file-scan-tmp" className="hidden" />

        <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
          {status !== "scanning" ? (
            <button
              onClick={startScanner}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--foreground)] text-[var(--background)] text-sm font-semibold px-4 py-2.5 hover:opacity-90 transition cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              {t("scanner.start")}
            </button>
          ) : (
            <button
              onClick={() => {
                stopScanner();
                setStatus("idle");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm font-semibold px-4 py-2.5 hover:bg-[var(--accent)] transition cursor-pointer"
            >
              <CameraOff className="w-4 h-4" />
              {t("scanner.stop")}
            </button>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm font-semibold px-4 py-2.5 hover:bg-[var(--accent)] transition cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            {t("scanner.upload")}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 p-4 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3">
          <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
            {t("scanner.result")}
          </div>
          <pre className="whitespace-pre-wrap break-words text-sm font-mono bg-[var(--accent)] rounded-lg p-3">
            {result}
          </pre>
          <div className="flex gap-2">
            <button
              onClick={copyResult}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm px-3 py-2 hover:bg-[var(--accent)] cursor-pointer transition"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? t("scanner.copied") : t("scanner.copy")}
            </button>
            {looksLikeUrl && (
              <a
                href={result}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--foreground)] text-[var(--background)] text-sm px-3 py-2 hover:opacity-90 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {t("scanner.open")}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
