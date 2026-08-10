import { beforeEach, describe, expect, it } from "vitest";
import { findVehicle } from "./fixtures";
import { getBookings, resetDemo, updateBookingVehicle } from "./storage";

describe("updateBookingVehicle", () => {
  beforeEach(() => {
    resetDemo();
  });

  it("changes the vehicle and recalculates the quote when the new vehicle is available", () => {
    const [booking] = getBookings();
    const nextVehicle = findVehicle("midsize-1")!;
    const updated = updateBookingVehicle(booking, nextVehicle.id);

    expect(updated.vehicleId).toBe(nextVehicle.id);
    expect(updated.quote.lines.find((line) => line.id === "base")?.amount).toBe(
      nextVehicle.dailyRate * updated.quote.days,
    );
    expect(updated.history.at(-1)).toMatchObject({ action: "Vehicle changed" });

    const [persisted] = getBookings();
    expect(persisted.vehicleId).toBe(nextVehicle.id);
  });

  it("rejects the change and leaves the booking untouched when the vehicle-unavailable scenario is active", () => {
    const [booking] = getBookings();
    const nextVehicle = findVehicle("midsize-1")!;

    expect(() => updateBookingVehicle(booking, nextVehicle.id, "vehicle-unavailable")).toThrow(/unavailable/i);

    const [persisted] = getBookings();
    expect(persisted.vehicleId).toBe(booking.vehicleId);
  });

  it("rejects the change when the vehicle does not serve the booking's pickup location", () => {
    const [booking] = getBookings();
    const ineligibleVehicle = findVehicle("economy-1")!;
    expect(ineligibleVehicle.locationIds).not.toContain(booking.search.pickupLocationId);

    expect(() => updateBookingVehicle(booking, ineligibleVehicle.id)).toThrow(/pickup location/i);
  });

  it("rejects a vehicle change for a cancelled booking", () => {
    const [booking] = getBookings();
    const nextVehicle = findVehicle("midsize-1")!;
    const cancelled = { ...booking, status: "Cancelled" as const };

    expect(() => updateBookingVehicle(cancelled, nextVehicle.id)).toThrow(/cannot be modified/i);
  });
});
