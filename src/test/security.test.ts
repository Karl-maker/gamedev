import { beforeEach, describe, expect, it } from "vitest";
import { clearRateLimitsForTests, rateLimit } from "@/lib/security/rate-limit";
import { isAllowedOrigin } from "@/lib/security/request";

describe("lead endpoint guards", () => {
  beforeEach(() => {
    clearRateLimitsForTests();
  });

  it("limits repeated requests", () => {
    expect(rateLimit("same-client", 2).allowed).toBe(true);
    expect(rateLimit("same-client", 2).allowed).toBe(true);
    expect(rateLimit("same-client", 2).allowed).toBe(false);
  });

  it("rejects cross-origin browser requests", () => {
    const foreign = new Request("https://example.com/api/leads", { headers: { origin: "https://attacker.example" } });
    const local = new Request("https://example.com/api/leads", { headers: { origin: "https://example.com" } });
    expect(isAllowedOrigin(foreign, "https://example.com")).toBe(false);
    expect(isAllowedOrigin(local, "https://example.com")).toBe(true);
  });
});
