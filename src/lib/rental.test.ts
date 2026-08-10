import { describe, expect, it } from "vitest";
import { extras, findVehicle, vehicles } from "./fixtures";
import { buildComparison } from "./comparison";
import {
  buildQuote,
  defaultSearch,
  extraQuantityLimit,
  filterVehicles,
  filterVehiclesByAccessibility,
  filterVehiclesByEstimatedPrice,
  filterVehiclesByPassengerCapacity,
  promotionMessage,
  rentalDays,
  searchVehicles,
  validateSelectedExtras,
  validateEstimatedPriceRange,
  validateSearch,
  vehicleAvailability,
} from "./rental";
import type { SelectedExtra } from "./types";

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

  it("filters vehicles by their estimated total inclusively", () => {
    const available = searchVehicles(defaultSearch);
    const results = filterVehiclesByEstimatedPrice(available, defaultSearch, { max: 20000 });

    expect(results).not.toHaveLength(0);
    expect(results).toHaveLength(2);
    expect(results.every((vehicle) => buildQuote(defaultSearch, vehicle).total <= 20000)).toBe(true);
  });

  it("includes an estimated total at the price range boundary", () => {
    const available = searchVehicles(defaultSearch);
    const boundary = Math.min(...available.map((vehicle) => buildQuote(defaultSearch, vehicle).total));

    expect(filterVehiclesByEstimatedPrice(available, defaultSearch, { min: boundary, max: boundary }))
      .toHaveLength(1);
  });

  it("rejects invalid estimated price ranges", () => {
    expect(validateEstimatedPriceRange({ min: -1, max: -2 })).toEqual([
      "Minimum estimated price must be a non-negative whole amount.",
      "Maximum estimated price must be a non-negative whole amount.",
    ]);
    expect(validateEstimatedPriceRange({ min: 20000, max: 10000 })).toContain("Minimum estimated price cannot be greater than maximum estimated price.");
    expect(filterVehiclesByEstimatedPrice(searchVehicles(defaultSearch), defaultSearch, { min: 20000, max: 10000 })).toEqual([]);
  });

  it("filters deterministic results by transmission type", () => {
    const available = searchVehicles(defaultSearch);

    expect(filterVehicles(available, { transmissions: ["Manual"] })).toEqual(
      expect.arrayContaining([expect.objectContaining({ transmission: "Manual" })]),
    );
    expect(filterVehicles(available, { transmissions: ["Automatic"] })).toEqual(
      expect.arrayContaining([expect.objectContaining({ transmission: "Automatic" })]),
    );
    expect(filterVehicles(available, { transmissions: ["Manual"] }).every((vehicle) => vehicle.transmission === "Manual")).toBe(true);
    expect(filterVehicles(available, { transmissions: ["Automatic"] }).every((vehicle) => vehicle.transmission === "Automatic")).toBe(true);
  });

  it("returns no results for an unavailable transmission and category combination", () => {
    expect(filterVehicles(vehicles, { categories: ["Luxury"], transmissions: ["Manual"] })).toEqual([]);
  });

  it("filters available vehicles to the requested passenger capacity", () => {
    expect(filterVehiclesByPassengerCapacity(searchVehicles(defaultSearch), 7).map((vehicle) => vehicle.id))
      .toEqual(["van-2", "van-3"]);
  });

  it("filters available vehicles for the 5+ passenger option", () => {
    expect(filterVehiclesByPassengerCapacity(searchVehicles(defaultSearch), 5).map((vehicle) => vehicle.id))
      .toEqual([
        "economy-2",
        "economy-3",
        "compact-1",
        "compact-2",
        "compact-4",
        "midsize-1",
        "midsize-3",
        "midsize-4",
        "full-size-2",
        "full-size-3",
        "suv-1",
        "suv-2",
        "suv-4",
        "luxury-1",
        "luxury-3",
        "luxury-4",
        "van-2",
        "van-3",
        "electric-1",
        "electric-2",
      ]);
  });

  it("preserves available vehicles when no passenger capacity is selected", () => {
    const results = searchVehicles(defaultSearch);
    expect(filterVehiclesByPassengerCapacity(results)).toEqual(results);
  });

  it("returns only vehicles with every selected accessibility feature", () => {
    const accessibleVehicles = filterVehiclesByAccessibility(
      vehicles,
      ["Wheelchair-accessible entry"],
    );

    expect(accessibleVehicles).not.toHaveLength(0);
    expect(
      accessibleVehicles.every((vehicle) =>
        vehicle.accessibilityFeatures.includes("Wheelchair-accessible entry")),
    ).toBe(true);
    expect(filterVehiclesByAccessibility(accessibleVehicles, ["Hand controls"])).toEqual([]);
  });
});


describe("rental pricing rules", () => {
  describe("vehicle availability for modification", () => {
    it("is available when inventory, location, and driver age are eligible", () => {
      expect(vehicleAvailability(findVehicle("compact-1")!, defaultSearch)).toEqual({ available: true });
    });

    it("is unavailable under the vehicle-unavailable scenario", () => {
      const result = vehicleAvailability(
        findVehicle("compact-1")!,
        defaultSearch,
        "vehicle-unavailable",
      );
      expect(result.available).toBe(false);
      expect(result.reason).toMatch(/unavailable/i);
    });

    it("explains pickup-location and driver-age ineligibility", () => {
      expect(vehicleAvailability(findVehicle("economy-1")!, defaultSearch).reason)
        .toMatch(/pickup location/i);
      expect(vehicleAvailability(
        findVehicle("suv-1")!,
        { ...defaultSearch, driverAge: 22 },
      ).reason).toMatch(/must be at least/i);
    });
  });

  const vehicle = findVehicle("compact-1")!;

  it("calculates base price and tax using integer minor units", () => {
    const quote = buildQuote(defaultSearch, vehicle);
    expect(quote.days).toBe(3);
    expect(quote.lines.find((line) => line.id === "base")?.amount).toBe(vehicle.dailyRate * 3);
    expect(quote.total).toBeGreaterThan(quote.subtotal);
    expect(Number.isInteger(quote.total)).toBe(true);
  });

  describe("extra quantity rules", () => {
    const validationCases: Array<[SelectedExtra[], string[]]> = [
      [[{ id: "child-seat", quantity: 2 }], []],
      [[{ id: "child-seat", quantity: 3 }], ["Only 2 Child safety seats are available for this rental."]],
      [[{ id: "additional-driver", quantity: 3 }], ["Additional driver has a limit of 2 per rental."]],
      [[{ id: "additional-driver", quantity: 2 }], ["Only 1 Additional driver is available for this rental."]],
      [[{ id: "gps", quantity: 1 }], ["Portable navigation is unavailable for this rental."]],
      [[{ id: "roadside", quantity: 0 }], ["Select at least one Roadside assistance."]],
      [[{ id: "unknown", quantity: 1 }], ["This extra is not available."]],
    ];

    it.each(extras.map((extra) => [extra.id, extra.maxQuantity, extra.availableQuantity] as const))(
      "limits %s to the lower of its rental limit and available stock",
      (id, maxQuantity, availableQuantity) => {
        expect(extraQuantityLimit(id)).toBe(Math.min(maxQuantity, availableQuantity));
      },
    );

    it.each(validationCases)("validates selected extras %#", (selectedExtras, errors) => {
      expect(validateSelectedExtras(selectedExtras)).toEqual(errors);
    });

    describe("vehicle comparison rules", () => {
      const selectedVehicles = [
        findVehicle("compact-1")!,
        findVehicle("midsize-1")!,
      ];

      it("builds an aligned deterministic matrix and identifies the lowest estimate", () => {
        const comparison = buildComparison(defaultSearch, selectedVehicles);

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
        expect(buildComparison(defaultSearch, selectedVehicles)).toEqual(comparison);
      });

      it("uses the active pricing scenario", () => {
        const normal = buildComparison(defaultSearch, selectedVehicles);
        const changed = buildComparison(defaultSearch, selectedVehicles, "price-change");

        expect(changed.rows.find((row) => row.label === "Estimated total")?.values)
          .not.toEqual(normal.rows.find((row) => row.label === "Estimated total")?.values);
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

    it("excludes invalid extra selections from the quote", () => {
      const quote = buildQuote(defaultSearch, findVehicle("compact-1")!, [
        { id: "child-seat", quantity: 3 },
        { id: "gps", quantity: 1 },
      ]);

      expect(quote.lines.map((line) => line.id)).not.toEqual(
        expect.arrayContaining(["extra-child-seat", "extra-gps"]),
      );
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
