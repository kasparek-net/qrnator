import QRCodeStyling from "qr-code-styling";
import jsPDF from "jspdf";
import { buildQRStylingOptions, type QRStyle } from "./qr-style";

export type ExportFormat = "svg" | "png" | "jpg" | "webp" | "pdf";

async function renderToBlob(
  data: string,
  style: QRStyle,
  format: "svg" | "png" | "jpg" | "webp",
): Promise<Blob> {
  const exportSize = Math.max(style.size, 1024);
  const opts = buildQRStylingOptions(data, { ...style, size: exportSize });
  if (format !== "svg") {
    opts.type = "canvas";
  }
  const qr = new QRCodeStyling(opts);
  const ext = format === "jpg" ? "jpeg" : format;
  const blob = await qr.getRawData(ext as "svg" | "png" | "jpeg" | "webp");
  if (!blob) throw new Error("Export selhal");
  return blob as Blob;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportQR(
  data: string,
  style: QRStyle,
  format: ExportFormat,
  baseName = "qrkod",
) {
  if (format === "pdf") {
    const pngBlob = await renderToBlob(data, style, "png");
    const dataUrl = await blobToDataURL(pngBlob);
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const size = 120;
    const x = (pageW - size) / 2;
    pdf.addImage(dataUrl, "PNG", x, 30, size, size);
    pdf.setFontSize(10);
    pdf.text("Vygenerováno na qr.kasparek.net", pageW / 2, 30 + size + 12, {
      align: "center",
    });
    pdf.save(`${baseName}.pdf`);
    return;
  }
  const blob = await renderToBlob(data, style, format);
  downloadBlob(blob, `${baseName}.${format}`);
}

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function getThumbnail(
  data: string,
  style: QRStyle,
): Promise<string> {
  const opts = buildQRStylingOptions(data, {
    ...style,
    size: 200,
    margin: 4,
    logo: style.logo,
  });
  opts.type = "canvas";
  const qr = new QRCodeStyling(opts);
  const blob = await qr.getRawData("png");
  if (!blob) return "";
  return blobToDataURL(blob as Blob);
}
