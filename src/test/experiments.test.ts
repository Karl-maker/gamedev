import { describe, expect, it } from "vitest";
import { chooseVariant } from "@/lib/experiments";
import { defaultConfig } from "@/config/default";

describe("A/B assignment", () => {
  const experiment = defaultConfig.experiments[0];

  it("is deterministic for the same visitor", () => {
    expect(chooseVariant(experiment, "visitor-123")).toBe(chooseVariant(experiment, "visitor-123"));
  });

  it("always returns a configured variant", () => {
    const ids = experiment.variants.map((variant) => variant.id);
    for (let index = 0; index < 100; index++) {
      expect(ids).toContain(chooseVariant(experiment, `visitor-${index}`));
    }
  });
});
