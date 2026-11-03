import { describe, expect, it } from "vitest";
import { categorySearch, citySlugForName, EVENT_CATEGORIES } from "./event-categories";

describe("City category navigation", () => {
  it("uses the chosen city, including Delhi NCR's existing city page", () => {
    expect(citySlugForName("Indore")).toBe("indore");
    expect(citySlugForName("Mumbai")).toBe("mumbai");
    expect(citySlugForName("Delhi NCR")).toBe("delhi");
  });
  it("filters concerts rather than opening an unrelated city page", () => {
    const concerts = EVENT_CATEGORIES.find(c => c.slug === "concerts");
    if (!concerts) throw new Error("Concerts missing");
    expect(categorySearch(concerts)).toEqual({ category: "Music & Concerts" });
  });
  it("includes at least sixteen unique categories", () => {
    expect(new Set(EVENT_CATEGORIES.map(c => c.slug)).size).toBeGreaterThanOrEqual(16);
  });
});