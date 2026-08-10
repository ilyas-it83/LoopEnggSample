import { beforeEach, describe, expect, it } from "vitest";
import {
  findBooking,
  resetDemo,
  reviewBookingDateTimes,
  setScenario,
  updateBookingDateTimes,
} from "./storage";

describe("booking date-time modification", () => {
  beforeEach(() => {
    resetDemo();
  });

  it("updates eligible dates, recalculates the quote, and records one audit entry", () => {
    const booking = findBooking("DW-260820-A1B2")!;
    const result = updateBookingDateTimes(booking, "2026-08-20T09:00", "2026-08-25T09:00");

    expect(result.errors).toEqual([]);
    expect(result.changed).toBe(true);
    expect(result.booking.search.returnAt).toBe("2026-08-25T09:00");
    expect(result.booking.quote.total).toBeGreaterThan(booking.quote.total);
    expect(result.booking.history.at(-1)?.detail).toBe("Rental date-times were updated.");
  });

  it("rejects invalid date-times without changing the booking", () => {
    const booking = findBooking("DW-260820-A1B2")!;
    const result = updateBookingDateTimes(booking, "2026-08-20T09:00", "2026-08-20T09:00");

    expect(result.changed).toBe(false);
    expect(result.errors).toContain("Return must be later than pickup.");
    expect(findBooking(booking.id)?.search.returnAt).toBe("2026-08-23T09:00");
  });

  it("does not create an audit entry when the same date-times are submitted again", () => {
    const booking = findBooking("DW-260820-A1B2")!;
    const updated = updateBookingDateTimes(booking, "2026-08-20T09:00", "2026-08-25T09:00").booking;
    const repeated = updateBookingDateTimes(updated, "2026-08-20T09:00", "2026-08-25T09:00");

    expect(repeated.changed).toBe(false);
    expect(repeated.errors).toEqual([]);
    expect(repeated.booking.history).toHaveLength(updated.history.length);
  });

  it("does not offer a review for a cancelled booking", () => {
    const booking = { ...findBooking("DW-260820-A1B2")!, status: "Cancelled" as const };

    expect(reviewBookingDateTimes(booking, "2026-08-20T09:00", "2026-08-25T09:00").errors)
      .toContain("Only upcoming confirmed bookings can be modified.");
  });

  it("prevents changes when the controlled service-error scenario is active", () => {
    setScenario("service-error");
    const booking = findBooking("DW-260820-A1B2")!;

    expect(updateBookingDateTimes(booking, "2026-08-20T09:00", "2026-08-25T09:00").errors)
      .toContain("We could not update this booking right now. Try again after resetting the demo scenario.");
  });
});
