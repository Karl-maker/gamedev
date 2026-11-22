import { describe, expect, it } from "vitest";
import { personalizePublicContent } from "@/lib/integrations/content/personalization";

describe("public Notion content personalization", () => {
  it("shows Reader in place of first_name placeholders", () => {
    expect(personalizePublicContent("Hello {{first_name}} and {{ FIRST_NAME }}")).toBe(
      "Hello Reader and Reader"
    );
  });
});
