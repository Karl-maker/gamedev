import { describe, expect, it } from "vitest";
import { defaultConfig } from "@/config/default";
import { websiteConfigSchema } from "@/config/schema";

describe("website configuration", () => {
  it("validates the legal and company policy configuration", () => {
    const parsed = websiteConfigSchema.parse(defaultConfig);
    expect(parsed.legal.privacyEmail).toContain("@");
    expect(parsed.legal.retention.enquiriesMonths).toBeGreaterThan(0);
    expect(parsed.legal.processors.length).toBeGreaterThan(0);
    expect(parsed.process.steps.length).toBeGreaterThanOrEqual(3);
    expect(parsed.faq.items.length).toBeGreaterThan(0);
    expect(parsed.testimonials.enabled).toBe(false);
    expect(parsed.seo.areaServed).toContain("Caribbean");
  });

  it("supplies safe legal defaults for older website configurations", () => {
    const legacyConfig: Record<string, unknown> = { ...defaultConfig };
    delete legacyConfig.legal;
    const parsed = websiteConfigSchema.parse(legacyConfig);
    expect(parsed.legal.effectiveDate).toBeTruthy();
    expect(parsed.process.enabled).toBe(true);
    expect(parsed.faq.enabled).toBe(true);
    expect(parsed.seo.keywords.length).toBeGreaterThan(0);
  });
});
