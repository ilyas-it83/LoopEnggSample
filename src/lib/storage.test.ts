import { beforeEach, describe, expect, it } from "vitest";
import {
  getBookings,
  getComparison,
  getRecentlyViewed,
  toggleComparison,
  trackRecentlyViewed,
  updateBookingExtras,
  updateBookingVehicle,
} from "./storage";
import { findVehicle } from "./fixtures";

describe("recently viewed vehicles", () => {
  beforeEach(() => window.localStorage.clear());

  it("tracks valid vehicles in most-recent-first order without duplicates", () => {
    trackRecentlyViewed("compact-1");
    trackRecentlyViewed("economy-1");
    trackRecentlyViewed("compact-1");

    expect(getRecentlyViewed()).toEqual(["compact-1", "economy-1"]);
  });

  describe("local comparison state", () => {
    beforeEach(() => window.localStorage.clear());

    it("limits valid comparison selections to three vehicles", () => {
      toggleComparison("compact-1");
      toggleComparison("midsize-1");
      toggleComparison("suv-1");
      toggleComparison("van-1");
      toggleComparison("unknown");

      expect(getComparison()).toEqual(["compact-1", "midsize-1", "suv-1"]);
    });

    it("recovers from malformed and stale comparison state", () => {
      window.localStorage.setItem(
        "drivewise.comparison",
        JSON.stringify(["compact-1", "unknown", "compact-1"]),
      );

      expect(getComparison()).toEqual(["compact-1"]);
    });
  });

  describe("booking vehicle modification", () => {
    beforeEach(() => window.localStorage.clear());

    it("changes to an available alternative and recalculates the quote", () => {
      const [booking] = getBookings();
      const nextVehicle = findVehicle("midsize-1")!;
      const updated = updateBookingVehicle(booking, nextVehicle.id);

      expect(updated.vehicleId).toBe(nextVehicle.id);
      expect(updated.quote.lines.find((line) => line.id === "base")?.amount)
        .toBe(nextVehicle.dailyRate * updated.quote.days);
      expect(updated.history.at(-1)).toMatchObject({ action: "Vehicle changed" });
    });

    it("keeps scenario-adjusted pricing across vehicle and extra updates", () => {
      const [booking] = getBookings();
      const vehicleUpdated = updateBookingVehicle(booking, "midsize-1", "price-change");
      const extrasUpdated = updateBookingExtras(
        vehicleUpdated,
        [{ id: "child-seat", quantity: 1 }],
        "price-change",
      );
      const base = extrasUpdated.quote.lines.find((line) => line.id === "base")?.amount;

      expect(base).toBe((findVehicle("midsize-1")!.dailyRate + 800) * extrasUpdated.quote.days);
    });

    it("rejects no-op, unavailable, ineligible, and cancelled changes", () => {
      const [booking] = getBookings();
      expect(() => updateBookingVehicle(booking, booking.vehicleId))
        .toThrow("Choose a different vehicle before saving.");
      expect(() => updateBookingVehicle(booking, "midsize-1", "vehicle-unavailable"))
        .toThrow(/unavailable/i);
      expect(() => updateBookingVehicle(booking, "economy-1"))
        .toThrow(/pickup location/i);
      expect(() => updateBookingVehicle(
        { ...booking, status: "Cancelled" },
        "midsize-1",
      )).toThrow(/only confirmed bookings/i);
    });
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
