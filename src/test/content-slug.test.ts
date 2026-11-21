import { describe, expect, it } from "vitest";
import { normalizeContentSlug } from "@/lib/integrations/content/slug";

describe("content slugs", () => {
  it("normalizes titles and explicit slugs consistently", () => {
    expect(normalizeContentSlug("", "A Firm’s Guide to Legal AI")).toBe("a-firms-guide-to-legal-ai");
    expect(normalizeContentSlug("  Client Intake Guide  ")).toBe("client-intake-guide");
  });

  it("accepts full Notion slug URLs and route paths", () => {
    expect(normalizeContentSlug("https://legal.syncpoly.com/blog/Automated-Intake/?draft=1")).toBe("automated-intake");
    expect(normalizeContentSlug("/blog/immigration%20intake/")).toBe("immigration-intake");
  });
});
