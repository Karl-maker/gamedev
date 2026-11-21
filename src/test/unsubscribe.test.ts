import { describe, expect, it, vi } from "vitest";
import { createUnsubscribeToken, maskEmail, readUnsubscribeToken } from "@/lib/unsubscribe/token";

describe("unsubscribe tokens", () => {
  it("round-trips a normalized email", () => {
    vi.stubEnv("UNSUBSCRIBE_SECRET", "a-test-secret-that-is-long-enough");
    const token = createUnsubscribeToken(" Person@Example.com ");
    expect(readUnsubscribeToken(token)).toBe("person@example.com");
    vi.unstubAllEnvs();
  });

  it("rejects a modified token", () => {
    vi.stubEnv("UNSUBSCRIBE_SECRET", "a-test-secret-that-is-long-enough");
    const token = createUnsubscribeToken("person@example.com");
    expect(readUnsubscribeToken(`${token}changed`)).toBeNull();
    vi.unstubAllEnvs();
  });

  it("masks addresses for confirmation pages", () => {
    expect(maskEmail("person@example.com")).toBe("pe•••@example.com");
  });
});
