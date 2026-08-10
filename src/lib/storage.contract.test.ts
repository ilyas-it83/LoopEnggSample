import { beforeEach, describe, expect, it } from "vitest";
import {
  getBookings,
  getFavorites,
  getScenario,
  resetDemo,
  setScenario,
  toggleFavorite,
  updateBookingVehicle,
} from "./storage";

describe("BDD-03 browser repository contract", () => {
  beforeEach(() => window.localStorage.clear());

  it("restores deterministic fixture state after mutable state is reset", () => {
    const defaults = getBookings();
    toggleFavorite("compact-1");
    setScenario("no-results");

    resetDemo();

    expect(getBookings()).toEqual(defaults);
    expect(getFavorites()).toEqual([]);
    expect(getScenario()).toBe("normal");
  });
});

describe("BDD-04 browser repository contract", () => {
  beforeEach(() => window.localStorage.clear());

  it("prevents an invalid state transition without mutating the booking", () => {
    const [booking] = getBookings();

    expect(() => updateBookingVehicle(booking, booking.vehicleId))
      .toThrow("Choose a different vehicle before saving.");
    expect(getBookings()).toEqual([booking]);
  });
});
