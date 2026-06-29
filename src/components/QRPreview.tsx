"use client";

import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import { buildQRStylingOptions, type QRStyle } from "@/lib/qr-style";

type Props = {
  data: string;
  style: QRStyle;
  frameLabel?: string;
  frameColor?: string;
};

let cachedInstance: QRCodeStyling | null = null;

export function QRPreview({ data, style, frameLabel, frameColor }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const options = buildQRStylingOptions(data, style);

    if (!instanceRef.current) {
      instanceRef.current = new QRCodeStyling(options);
      cachedInstance = instanceRef.current;
      while (ref.current.firstChild) ref.current.removeChild(ref.current.firstChild);
      instanceRef.current.append(ref.current);
    } else {
      instanceRef.current.update(options);
    }
  }, [data, style]);

  const hasFrame = !!frameLabel?.trim();
  const frame = frameColor || "#0f172a";

  return (
    <div className="flex flex-col items-center w-full">
      <div
        className="relative rounded-2xl shadow-sm p-3 w-full"
        style={{
          background: hasFrame ? frame : "transparent",
        }}
      >
        <div
          ref={ref}
          className="rounded-xl overflow-hidden mx-auto qr-preview-shell"
          style={{
            aspectRatio: "1 / 1",
            width: "100%",
            maxWidth: style.size,
            background: style.bgTransparent ? "transparent" : style.bgColor,
          }}
        />
        {hasFrame && (
          <div
            className="text-center pt-3 pb-1 text-sm font-semibold tracking-wide uppercase"
            style={{ color: "#fff" }}
          >
            {frameLabel}
          </div>
        )}
      </div>
    </div>
  );
}

export function getQRInstance() {
  return cachedInstance;
}
