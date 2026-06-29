import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { I18nProvider } from "@/lib/i18n-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QRnator — Free QR Code Generator",
  description:
    "Create custom QR codes for free. Logos, gradients, frames, export to SVG, PNG and PDF. No signup.",
  keywords: [
    "QR code",
    "QR code generator",
    "QR scanner",
    "WiFi QR",
    "vCard QR",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        <Script src="/lang-init.js" strategy="beforeInteractive" />
      </head>
      <body className="min-h-full flex flex-col">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
