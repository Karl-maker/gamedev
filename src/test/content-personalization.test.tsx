import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContentCard } from "@/components/content/content-card";
import { personalizePublicContent, personalizePublicRichText } from "@/lib/integrations/content/personalization";

describe("public Notion content personalization", () => {
  it("shows Reader in place of first_name placeholders", () => {
    expect(personalizePublicContent("Hello {{first_name}} and {{ FIRST_NAME }}")).toBe(
      "Hello Reader and Reader"
    );
  });

  it("replaces placeholders split across Notion rich-text segments", () => {
    expect(personalizePublicRichText([
      { plain_text: "Hi {{first_" },
      { plain_text: "name}}, welcome." }
    ]).map((item) => item.plain_text).join("")).toBe("Hi Reader, welcome.");
  });

  it("never exposes first_name placeholders in content cards", () => {
    render(<ContentCard entry={{
      id: "12345678-1234-1234-1234-1234567890ab",
      slug: "welcome",
      title: "Hi {{first_name}}",
      excerpt: "A useful update for {{ FIRST_NAME }}.",
      publishedAt: "2026-11-23T12:00:00.000Z",
      updatedAt: "2026-11-23T12:00:00.000Z",
      tags: [],
      type: "news"
    }} />);
    expect(screen.getByRole("heading", { name: "Hi Reader" })).toBeInTheDocument();
    expect(screen.getByText("A useful update for Reader.")).toBeInTheDocument();
  });
});
