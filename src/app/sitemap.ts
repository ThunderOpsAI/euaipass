import type { MetadataRoute } from "next";
import {
  getAllHsChapters,
  getAllHsHeadings,
  getAllHsCodes,
} from "@/data/hs-taxonomy";
import { getAllAiActPages } from "@/data/ai-act-data";
import { getAllProductSafetyGuides } from "@/data/product-safety-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://euaipass.com";
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/hs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/eu-ai-act`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/product-safety`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // 1. Product Safety Guides
  for (const g of getAllProductSafetyGuides()) {
    entries.push({
      url: `${baseUrl}/product-safety/${g.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // 2. EU AI Act Pages
  for (const a of getAllAiActPages()) {
    entries.push({
      url: `${baseUrl}/eu-ai-act/${a.section}/${a.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // 3. HS Chapters (96 Chapters)
  for (const ch of getAllHsChapters()) {
    entries.push({
      url: `${baseUrl}/hs/${ch.chapter}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // 4. HS Headings
  for (const h of getAllHsHeadings()) {
    entries.push({
      url: `${baseUrl}/hs/${h.chapter}/${h.heading}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // 5. HS 6-Digit Codes (Corpus)
  for (const c of getAllHsCodes()) {
    entries.push({
      url: `${baseUrl}/hs/code/${c.code}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
