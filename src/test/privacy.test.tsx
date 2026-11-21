import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Analytics, consentKey } from "@/components/analytics/analytics";
import { CookieBanner } from "@/components/privacy/cookie-banner";

vi.mock("next/script", () => ({
  default: (props: Record<string, string>) => <script data-testid="analytics-script" {...props} />
}));

describe("privacy controls", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_UMAMI_WEBSITE_ID", "test-site");
    Object.defineProperty(navigator, "doNotTrack", { configurable: true, value: "0" });
  });

  it("shows a choice when no consent is stored", async () => {
    render(<CookieBanner />);
    expect(await screen.findByRole("region", { name: "Your privacy, your choice" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Essential only" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Allow analytics" })).toBeInTheDocument();
  });

  it("reopens choices from the persistent footer control", async () => {
    localStorage.setItem(consentKey, JSON.stringify({ necessary: true, analytics: false }));
    render(<CookieBanner />);
    await act(async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 0));
      window.dispatchEvent(new Event("privacy-choices-open"));
    });
    expect(await screen.findByRole("region", { name: "Your privacy, your choice" })).toBeInTheDocument();
  });

  it("does not load analytics without affirmative consent", () => {
    render(<Analytics />);
    expect(screen.queryByTestId("analytics-script")).not.toBeInTheDocument();
  });

  it("loads analytics after affirmative consent", async () => {
    localStorage.setItem(consentKey, JSON.stringify({ necessary: true, analytics: true }));
    render(<Analytics />);
    expect(await screen.findByTestId("analytics-script")).toBeInTheDocument();
  });

  it("respects Do Not Track even after consent", async () => {
    Object.defineProperty(navigator, "doNotTrack", { configurable: true, value: "1" });
    localStorage.setItem(consentKey, JSON.stringify({ necessary: true, analytics: true }));
    await act(async () => render(<Analytics />));
    expect(screen.queryByTestId("analytics-script")).not.toBeInTheDocument();
  });
});
