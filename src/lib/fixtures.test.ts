import { describe, expect, it } from "vitest";
import {
  fees,
  pricingFixtures,
  promotions,
  ratePlans,
  taxes,
  validatePricingFixtures,
  vehicles,
} from "./fixtures";

describe("DW-023 pricing fixtures", () => {
  it("defines a valid deterministic catalog linked to every vehicle", () => {
    expect(validatePricingFixtures()).toEqual([]);
    expect(ratePlans).toHaveLength(8);
    expect(vehicles.every((vehicle) => ratePlans.some((plan) => plan.id === vehicle.ratePlanId)))
      .toBe(true);
    expect([...ratePlans, ...fees].every((fixture) =>
      Number.isSafeInteger("baseAmount" in fixture ? fixture.baseAmount : fixture.amount)))
      .toBe(true);
    expect(taxes).toEqual([
      expect.objectContaining({ rateBasisPoints: 825, calculationOrder: "after-discounts" }),
    ]);
    expect(promotions.map((promotion) => promotion.code))
      .toEqual(expect.arrayContaining(["DRIVE10", "WEEKEND25", "EXPIRED10"]));
  });

  it("rejects duplicate, missing, and numerically invalid fixture definitions", () => {
    const errors = validatePricingFixtures({
      ...pricingFixtures,
      ratePlans: [
        ...ratePlans.filter((plan) => plan.vehicleCategory !== "Electric"),
        { ...ratePlans[0] },
      ],
      taxes: [{ ...taxes[0], rateBasisPoints: 10_001 }],
      promotions: [...promotions, { ...promotions[0] }],
    });

    expect(errors).toEqual(expect.arrayContaining([
      `Rate plan ID ${ratePlans[0].id} is duplicated.`,
      "Promotion code DRIVE10 is duplicated.",
      "Missing rate plans for: Electric.",
      "tax must define a tax rate from 0 to 10000 basis points.",
    ]));
  });
});
