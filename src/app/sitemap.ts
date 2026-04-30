import type { MetadataRoute } from "next";
import { CITIES } from "@/lib/cities";
import { env } from "@/lib/env";
import { SAMPLE_VEHICLES } from "@/lib/sample-inventory";

/**
 * Sitemap. Phase 1 will swap SAMPLE_VEHICLES for live Supabase rows;
 * everything else (static pages, intent landing, programmatic SEO city
 * pages) stays as-is.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/inventory`, lastModified, changeFrequency: "hourly", priority: 0.95 },
    { url: `${base}/financing`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    {
      url: `${base}/financing/calculator`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${base}/sell-trade`, lastModified, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/services`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/staff`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/directions`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/referral`, lastModified, changeFrequency: "monthly", priority: 0.4 },
  ];

  const intentRoutes: MetadataRoute.Sitemap = [
    "/bad-credit-car-loans",
    "/no-credit-car-loans",
    "/work-permit-car-loans",
    "/student-car-loans",
    "/newcomer-car-loans",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const cityRoutes: MetadataRoute.Sitemap = CITIES.map((c) => ({
    url: `${base}/${c.slug}/used-cars`,
    lastModified,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const vdpRoutes: MetadataRoute.Sitemap = SAMPLE_VEHICLES.map((v) => ({
    url: `${base}/inventory/${v.slug}`,
    lastModified,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticRoutes, ...intentRoutes, ...cityRoutes, ...vdpRoutes];
}
