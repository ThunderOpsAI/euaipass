import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";

describe("Sitemap Generation", () => {
  it("includes root, legal pages, HS chapters, and AI Act URLs", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);

    expect(urls).toContain("https://euaipass.com");
    expect(urls).toContain("https://euaipass.com/about");
    expect(urls).toContain("https://euaipass.com/privacy");
    expect(urls).toContain("https://euaipass.com/terms");
    expect(urls).toContain("https://euaipass.com/contact");
    expect(urls).toContain("https://euaipass.com/hs");
    expect(urls).toContain("https://euaipass.com/hs/61");
    expect(urls).toContain("https://euaipass.com/hs/85");
    expect(urls).toContain("https://euaipass.com/eu-ai-act");
    expect(urls.some((u) => u.includes("annex-iii/employment"))).toBe(true);
    expect(urls.some((u) => u.includes("product-safety/gpsr-guide"))).toBe(true);
    expect(urls.length).toBeGreaterThan(100);
  });
});
