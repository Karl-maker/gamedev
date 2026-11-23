import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FaqSection } from "@/components/sections/faq";
import { ProcessSection } from "@/components/sections/process";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { defaultConfig } from "@/config/default";

describe("professional homepage sections", () => {
  it("renders the configured process as an ordered sequence", () => {
    const { container } = render(<ProcessSection config={defaultConfig.process} />);
    expect(screen.getByRole("heading", { name: defaultConfig.process.title })).toBeInTheDocument();
    expect(container.querySelectorAll(".process-grid > li")).toHaveLength(defaultConfig.process.steps.length);
    expect(screen.getByRole("link", { name: /discuss your workflow/i })).toHaveAttribute("href", "/contact");
  });

  it("renders accessible FAQ disclosures and FAQ structured data", () => {
    const { container } = render(<FaqSection config={defaultConfig.faq} />);
    expect(container.querySelectorAll("details")).toHaveLength(defaultConfig.faq.items.length);
    const jsonLd = container.querySelector('script[type="application/ld+json"]');
    expect(jsonLd?.textContent).toContain('"@type":"FAQPage"');
    expect(jsonLd?.textContent).toContain(defaultConfig.faq.items[0].question);
  });

  it("does not invent or show testimonials until verified entries are configured", () => {
    const { container } = render(<TestimonialsSection config={defaultConfig.testimonials} />);
    expect(container).toBeEmptyDOMElement();
  });
});
