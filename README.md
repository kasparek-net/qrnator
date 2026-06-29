# QRnator

A free, privacy-friendly QR code generator and scanner. Create fully customizable QR codes — custom shapes, colors, gradients, logos and frames — then export to PNG, SVG or PDF. No signup, no tracking; everything runs in your browser.

**Live:** https://qr.kasparek.net

## Features

- **Many content types** — Link, Text, Email, Phone, SMS, WhatsApp, Skype, Zoom, WiFi, vCard, Bitcoin, PayPal
- **Custom appearance** — dot/frame/center shapes with live visual previews, colors, gradients, embedded logo, labeled frames, and ready-made style presets
- **Built-in scanner** — scan QR codes with your camera (`html5-qrcode`)
- **History** — recently generated codes saved locally in the browser
- **Export** — PNG, JPG, SVG and PDF
- **Internationalization** — English (default) and Czech, with an in-app switcher
- **Light & dark mode**

## Tech stack

- [Next.js](https://nextjs.org) (App Router, static export) + React + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) for rendering
- [html5-qrcode](https://github.com/mebjas/html5-qrcode) for scanning
- [jsPDF](https://github.com/parallax/jsPDF) for PDF export

## Development

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Build

The app is configured for static export (`output: "export"` in `next.config.ts`):

```bash
pnpm build      # generates the static site into ./out
```

## Deployment

The production site is hosted on shared Apache hosting (blueboard) and deployed via Git push. The static `out/` is published into the `qr/` folder of the hosting repository and pushed to the `production` branch:

```bash
pnpm build
cp -a out/. <hosting-repo>/qr/
cd <hosting-repo> && git add qr && git commit -m "Deploy" && git push origin production
```

Security headers and caching are configured in `public/.htaccess` (Next.js `headers()` does not apply to static exports).

## License

Personal project. QR Code is a registered trademark of DENSO WAVE INCORPORATED.
