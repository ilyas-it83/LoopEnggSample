import { describe, expect, it } from "vitest";
import { findVehicle } from "./fixtures";
import { buildComparison } from "./comparison";
import {
  buildQuote,
  defaultSearch,
  promotionMessage,
  rentalDays,
  searchVehicles,
  validateSearch,
} from "./rental";

describe("rental search rules", () => {
  it("rejects a return before pickup", () => {
    expect(validateSearch({ ...defaultSearch, returnAt: "2026-08-11T09:00", pickupAt: "2026-08-12T10:00" }))
      .toContain("Return must be later than pickup.");
  });

  it("rejects pickup before the controlled mock clock", () => {
    expect(validateSearch({ ...defaultSearch, pickupAt: "2026-08-09T10:00" }))
      .toContain("Pickup cannot be earlier than the mock clock.");
  });

  it("rounds a partial rental day up", () => {
    expect(rentalDays({ ...defaultSearch, pickupAt: "2026-08-12T10:00", returnAt: "2026-08-13T11:00" })).toBe(2);
  });

  it("returns no vehicles for the no-results scenario", () => {
    expect(searchVehicles(defaultSearch, "no-results")).toEqual([]);
  });

  it("excludes vehicles above the driver's age eligibility", () => {
    const results = searchVehicles({ ...defaultSearch, driverAge: 21 });
    expect(results.every((vehicle) => vehicle.minimumDriverAge <= 21)).toBe(true);
  });
});

describe("rental pricing rules", () => {
  const vehicle = findVehicle("compact-1")!;

  it("calculates base price and tax using integer minor units", () => {
    const quote = buildQuote(defaultSearch, vehicle);
    expect(quote.days).toBe(3);
    expect(quote.lines.find((line) => line.id === "base")?.amount).toBe(vehicle.dailyRate * 3);
    expect(quote.total).toBeGreaterThan(quote.subtotal);
    expect(Number.isInteger(quote.total)).toBe(true);
  });

  describe("vehicle comparison rules", () => {
    it("builds an aligned, deterministic matrix and identifies the lowest estimate", () => {
      const comparison = buildComparison(defaultSearch, [
        findVehicle("compact-1")!,
        findVehicle("midsize-1")!,
      ]);

      expect(comparison.rows.map((row) => row.label)).toEqual([
        "Category",
        "Estimated total",
        "Passengers",
        "Luggage",
        "Doors",
        "Transmission",
        "Fuel or power",
        "Minimum driver age",
        "Included features",
      ]);
      expect(comparison.lowestEstimateVehicleId).toBe("compact-1");
      expect(comparison.rows.every((row) => row.values.length === 2)).toBe(true);
      expect(buildComparison(defaultSearch, [
        findVehicle("compact-1")!,
        findVehicle("midsize-1")!,
      ])).toEqual(comparison);
    });

    it("rejects fewer than two or more than three selected vehicles", () => {
      expect(() => buildComparison(defaultSearch, [findVehicle("compact-1")!]))
        .toThrow("Select between two and three vehicles to compare.");
      expect(() => buildComparison(defaultSearch, [
        findVehicle("compact-1")!,
        findVehicle("midsize-1")!,
        findVehicle("suv-1")!,
        findVehicle("van-1")!,
      ])).toThrow("Select between two and three vehicles to compare.");
    });
  });

  it("adds one-way and young-driver fees", () => {
    const quote = buildQuote({
      ...defaultSearch,
      returnLocationId: "harbor-downtown",
      driverAge: 23,
    }, vehicle);
    expect(quote.lines.map((line) => line.id)).toEqual(expect.arrayContaining(["one-way", "young-driver"]));
  });

  it("prices per-day and per-rental extras correctly", () => {
    const quote = buildQuote(defaultSearch, vehicle, [
      { id: "child-seat", quantity: 2 },
      { id: "roadside", quantity: 1 },
    ]);
    expect(quote.lines.find((line) => line.id === "extra-child-seat")?.amount).toBe(900 * 3 * 2);
    expect(quote.lines.find((line) => line.id === "extra-roadside")?.amount).toBe(2400);
  });

  it("applies DRIVE10 only to pre-tax charges", () => {
    const quote = buildQuote({ ...defaultSearch, promoCode: "DRIVE10" }, vehicle);
    const discount = quote.lines.find((line) => line.id === "promo");
    expect(discount?.amount).toBeLessThan(0);
    expect(quote.subtotal).toBe(vehicle.dailyRate * 3 + discount!.amount);
  });

  it("never allows a promotion to produce a negative subtotal", () => {
    const quote = buildQuote({ ...defaultSearch, promoCode: "WEEKEND25", returnAt: "2026-08-13T10:00" }, vehicle);
    expect(quote.subtotal).toBeGreaterThanOrEqual(0);
  });

  it("describes recognized and rejected promotions distinctly", () => {
    expect(promotionMessage("DRIVE10", 3)).toContain("applied");
    expect(promotionMessage("UNKNOWN", 3)).toContain("not recognized");
  });

  it("makes the price-change scenario deterministic", () => {
    const normal = buildQuote(defaultSearch, vehicle);
    const changed = buildQuote(defaultSearch, vehicle, [], "price-change");
    expect(changed.total).toBeGreaterThan(normal.total);
    expect(buildQuote(defaultSearch, vehicle, [], "price-change")).toEqual(changed);
  });
});
