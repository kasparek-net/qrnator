import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qr.kasparek.net";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, priority: 1, changeFrequency: "weekly" },
    { url: `${base}/scanner`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
  ];
}
