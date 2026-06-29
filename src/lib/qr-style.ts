import type { Options as QRStylingOptions } from "qr-code-styling";

export type DotType =
  | "square"
  | "dots"
  | "rounded"
  | "extra-rounded"
  | "classy"
  | "classy-rounded";

export type CornerSquareType = "square" | "dot" | "extra-rounded";
export type CornerDotType = "square" | "dot";

export type ErrorCorrection = "L" | "M" | "Q" | "H";

export type GradientType = "none" | "linear" | "radial";

export type QRStyle = {
  size: number;
  margin: number;
  errorCorrection: ErrorCorrection;
  dotStyle: DotType;
  dotColor: string;
  dotGradient: GradientType;
  dotColor2: string;
  bgColor: string;
  bgTransparent: boolean;
  cornerSquareStyle: CornerSquareType;
  cornerSquareColor: string;
  cornerDotStyle: CornerDotType;
  cornerDotColor: string;
  logo: string | null;
  logoSize: number;
  logoMargin: number;
  hideBgDots: boolean;
};

export const defaultStyle: QRStyle = {
  size: 400,
  margin: 8,
  errorCorrection: "H",
  dotStyle: "rounded",
  dotColor: "#0f172a",
  dotGradient: "none",
  dotColor2: "#0f172a",
  bgColor: "#ffffff",
  bgTransparent: false,
  cornerSquareStyle: "extra-rounded",
  cornerSquareColor: "#0f172a",
  cornerDotStyle: "dot",
  cornerDotColor: "#0f172a",
  logo: null,
  logoSize: 0.25,
  logoMargin: 4,
  hideBgDots: true,
};

export function buildQRStylingOptions(
  data: string,
  s: QRStyle,
): QRStylingOptions {
  const opts: QRStylingOptions = {
    width: s.size,
    height: s.size,
    type: "svg",
    data: data || " ",
    margin: s.margin,
    qrOptions: {
      errorCorrectionLevel: s.errorCorrection,
    },
    dotsOptions: {
      type: s.dotStyle,
      color: s.dotColor,
      ...(s.dotGradient !== "none" && {
        gradient: {
          type: s.dotGradient,
          rotation: s.dotGradient === "linear" ? Math.PI / 4 : 0,
          colorStops: [
            { offset: 0, color: s.dotColor },
            { offset: 1, color: s.dotColor2 },
          ],
        },
      }),
    },
    backgroundOptions: {
      color: s.bgTransparent ? "transparent" : s.bgColor,
    },
    cornersSquareOptions: {
      type: s.cornerSquareStyle,
      color: s.cornerSquareColor,
    },
    cornersDotOptions: {
      type: s.cornerDotStyle,
      color: s.cornerDotColor,
    },
    imageOptions: {
      hideBackgroundDots: s.hideBgDots,
      imageSize: s.logoSize,
      margin: s.logoMargin,
      crossOrigin: "anonymous",
    },
  };

  if (s.logo) opts.image = s.logo;

  return opts;
}
