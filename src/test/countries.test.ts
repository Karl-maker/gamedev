import { describe, expect, it } from "vitest";
import { callingCodes, countryOptions } from "@/data/options";

describe("worldwide contact options", () => {
  it("includes the complete country and territory dataset with flags", () => {
    expect(countryOptions).toHaveLength(250);
    expect(countryOptions.every((country) => country.flag.length > 0)).toBe(true);
  });

  it("includes international and regional calling prefixes", () => {
    expect(callingCodes.length).toBeGreaterThanOrEqual(243);
    expect(callingCodes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ countryCode: "TT", value: "+1868" }),
        expect.objectContaining({ countryCode: "US", value: "+1" }),
        expect.objectContaining({ countryCode: "GB", value: "+44" }),
        expect.objectContaining({ countryCode: "IN", value: "+91" })
      ])
    );
  });

  it("includes multiple regional prefixes where applicable", () => {
    const dominicanRepublic = callingCodes
      .filter((option) => option.countryCode === "DO")
      .map((option) => option.value);
    expect(dominicanRepublic).toEqual(["+1809", "+1829", "+1849"]);
  });
});
