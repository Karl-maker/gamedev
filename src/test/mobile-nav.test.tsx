import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MobileNav } from "@/components/layout/mobile-nav";
import { defaultConfig } from "@/config/default";

describe("mobile navigation", () => {
  it("exposes expanded state, navigation links, and Escape close behavior", () => {
    render(<MobileNav config={defaultConfig} />);
    const toggle = screen.getByRole("button", { name: "Open navigation menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(toggle);
    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Services" })).toHaveFocus();
    expect(screen.getByRole("button", { name: "Close navigation menu" })).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open navigation menu" })).toHaveFocus();
  });
});
