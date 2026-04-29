import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

/**
 * Phase 0 sitemap — only static routes that exist today.
 * Phase 1 will expand this with inventory VDPs, and Phase 7 will add
 * programmatic SEO routes (/[city]/used-cars, etc.).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const lastModified = new Date();

  return [{ url: `${base}/`, lastModified, changeFrequency: "daily", priority: 1.0 }];
}
