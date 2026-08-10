import { beforeEach, describe, expect, it } from "vitest";
import { getRecentlyViewed, trackRecentlyViewed } from "./storage";

describe("recently viewed vehicles", () => {
  beforeEach(() => window.localStorage.clear());

  it("tracks valid vehicles in most-recent-first order without duplicates", () => {
    trackRecentlyViewed("compact-1");
    trackRecentlyViewed("economy-1");
    trackRecentlyViewed("compact-1");

    expect(getRecentlyViewed()).toEqual(["compact-1", "economy-1"]);
  });

  it("rejects an unknown vehicle without changing existing history", () => {
    trackRecentlyViewed("compact-1");

    expect(trackRecentlyViewed("not-a-vehicle")).toBe(false);
    expect(getRecentlyViewed()).toEqual(["compact-1"]);
  });

  it("recovers from malformed browser state", () => {
    window.localStorage.setItem("drivewise.recently-viewed", JSON.stringify({ vehicleId: "compact-1" }));

    expect(getRecentlyViewed()).toEqual([]);
  });

  it("limits the deterministic history to six vehicles", () => {
    ["economy-1", "economy-2", "economy-3", "economy-4", "compact-1", "compact-2", "compact-3"].forEach(trackRecentlyViewed);

    expect(getRecentlyViewed()).toEqual(["compact-3", "compact-2", "compact-1", "economy-4", "economy-3", "economy-2"]);
  });
});
