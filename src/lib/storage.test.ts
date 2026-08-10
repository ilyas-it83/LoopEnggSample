import { beforeEach, describe, expect, it } from "vitest";
import {
  findBooking,
  getBookings,
  getComparison,
  getRecentlyViewed,
  resetDemo,
  reviewBookingDateTimes,
  setScenario,
  toggleComparison,
  trackRecentlyViewed,
  updateBookingDateTimes,
  updateBookingExtras,
  updateBookingVehicle,
} from "./storage";
import { findRatePlan, findVehicle } from "./fixtures";

describe("recently viewed vehicle ordering", () => {
  beforeEach(() => window.localStorage.clear());

  it("tracks valid vehicles in most-recent-first order without duplicates", () => {
    trackRecentlyViewed("compact-1");
    trackRecentlyViewed("economy-1");
    trackRecentlyViewed("compact-1");

    expect(getRecentlyViewed()).toEqual(["compact-1", "economy-1"]);
  });
});

describe("booking date-time modification", () => {
    beforeEach(() => resetDemo());

    it("updates eligible dates, recalculates the quote, and records one audit entry", () => {
      const booking = findBooking("DW-260820-A1B2")!;
      const result = updateBookingDateTimes(
        booking,
        "2026-08-20T09:00",
        "2026-08-25T09:00",
      );

      expect(result.errors).toEqual([]);
      expect(result.changed).toBe(true);
      expect(result.booking.search.returnAt).toBe("2026-08-25T09:00");
      expect(result.booking.quote.total).toBeGreaterThan(booking.quote.total);
      expect(result.booking.history.at(-1)?.detail).toBe("Rental date-times were updated.");
    });

    it("rejects invalid or repeated date-times without adding history", () => {
      const booking = findBooking("DW-260820-A1B2")!;
      const invalid = updateBookingDateTimes(
        booking,
        "2026-08-20T09:00",
        "2026-08-20T09:00",
      );
      expect(invalid.errors).toContain("Return must be later than pickup.");
      expect(invalid.changed).toBe(false);
      expect(findBooking(booking.id)?.history).toHaveLength(booking.history.length);

      const updated = updateBookingDateTimes(
        booking,
        "2026-08-20T09:00",
        "2026-08-25T09:00",
      ).booking;
      const repeated = updateBookingDateTimes(
        booking,
        "2026-08-20T09:00:00",
        "2026-08-25T09:00:00",
        "service-error",
      );
      expect(repeated.changed).toBe(false);
      expect(repeated.errors).toEqual([]);
      expect(repeated.booking.history).toHaveLength(updated.history.length);
    });

    it("requires the existing booking to remain upcoming and confirmed", () => {
      const booking = findBooking("DW-260820-A1B2")!;
      const revisedPickup = "2026-08-21T09:00";
      const revisedReturn = "2026-08-25T09:00";

      expect(reviewBookingDateTimes(
        { ...booking, search: { ...booking.search, pickupAt: "2026-08-09T09:00" } },
        revisedPickup,
        revisedReturn,
      ).errors).toContain("Only upcoming confirmed bookings can be modified.");
      expect(reviewBookingDateTimes(
        { ...booking, search: { ...booking.search, pickupAt: "not-a-date" } },
        revisedPickup,
        revisedReturn,
      ).errors).toContain("Only upcoming confirmed bookings can be modified.");
      expect(reviewBookingDateTimes(
        { ...booking, status: "Cancelled" },
        revisedPickup,
        revisedReturn,
      ).errors).toContain("Only upcoming confirmed bookings can be modified.");
    });

    it("revalidates vehicle availability for the revised period", () => {
      setScenario("vehicle-unavailable");
      const booking = findBooking("DW-260820-A1B2")!;
      const result = updateBookingDateTimes(
        booking,
        "2026-08-21T09:00",
        "2026-08-25T09:00",
      );

      expect(result.changed).toBe(false);
      expect(result.errors.join(" ")).toMatch(/unavailable/i);
      expect(findBooking(booking.id)?.search).toEqual(booking.search);
    });

    it("uses active scenario pricing and blocks service errors", () => {
      const booking = findBooking("DW-260820-A1B2")!;
      setScenario("price-change");
      const changed = updateBookingDateTimes(
        booking,
        "2026-08-20T09:00",
        "2026-08-25T09:00",
      );
      expect(changed.booking.quote.lines.find((line) => line.id === "base")?.amount)
        .toBe(
          (findVehicle(booking.vehicleId)!.dailyRate +
            findRatePlan(findVehicle(booking.vehicleId)!.ratePlanId)!.priceChangeAdjustment) *
          changed.booking.quote.days,
        );

      resetDemo();
      setScenario("service-error");
      const resetBooking = findBooking("DW-260820-A1B2")!;
      expect(updateBookingDateTimes(
        resetBooking,
        "2026-08-20T09:00",
        "2026-08-25T09:00",
      ).errors).toContain(
        "We could not update this booking right now. Try again after resetting the demo scenario.",
      );
    });
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

      expect(base).toBe(
        (findVehicle("midsize-1")!.dailyRate +
          findRatePlan(findVehicle("midsize-1")!.ratePlanId)!.priceChangeAdjustment) *
        extrasUpdated.quote.days,
      );
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

describe("recently viewed vehicle recovery", () => {
  beforeEach(() => window.localStorage.clear());

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
