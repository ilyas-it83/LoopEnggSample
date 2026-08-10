import { beforeEach, describe, expect, it } from "vitest";
import { getComparison, recordRecentlyViewed, resetDemo, toggleComparison } from "./storage";

describe("local comparison state", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("limits comparison selections to three vehicles", () => {
    toggleComparison("compact-1");
    toggleComparison("midsize-1");
    toggleComparison("suv-1");
    toggleComparison("van-1");

    expect(getComparison()).toEqual(["compact-1", "midsize-1", "suv-1"]);
  });

  it("keeps recently viewed vehicles in most-recent-first order and resets them", () => {
    recordRecentlyViewed("compact-1");
    recordRecentlyViewed("midsize-1");
    recordRecentlyViewed("compact-1");

    expect(window.localStorage.getItem("drivewise.recently-viewed")).toBe(JSON.stringify(["compact-1", "midsize-1"]));
    resetDemo();
    expect(window.localStorage.getItem("drivewise.recently-viewed")).toBeNull();
  });
});
