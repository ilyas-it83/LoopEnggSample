import type {
  AccessibilityFeature,
  Extra,
  FeeFixture,
  PricingFixtureCatalog,
  PromotionFixture,
  RatePlanFixture,
  RentalLocation,
  SimulatedProfile,
  TaxFixture,
  Vehicle,
  VehicleCategory,
} from "./types";

export const MOCK_CLOCK = "2026-08-10T10:00";
export const DRIVEWISE_FIXTURE_VERSION = "drivewise-fixtures-v1";

export const simulatedProfile: SimulatedProfile = {
  renter: {
    firstName: "Jordan",
    lastName: "Lee",
    email: "jordan.lee@example.test",
    phone: "+1 555 010 2026",
  },
  driver: {
    firstName: "Jordan",
    lastName: "Lee",
    dateOfBirth: "1990-04-18",
    licenseNumber: "DEMO-48291",
    licenseCountry: "United States",
    licenseExpiry: "2029-04-18",
  },
};

export const locations: RentalLocation[] = [
  { id: "harbor-airport", name: "Harbor International Airport", city: "Harbor City", type: "Airport", address: "1 Terminal Way", timezone: "America/New_York" },
  { id: "harbor-downtown", name: "Harbor City Downtown", city: "Harbor City", type: "City", address: "88 Market Street", timezone: "America/New_York" },
  { id: "summit-airport", name: "Summit Regional Airport", city: "Summit", type: "Airport", address: "400 Skyway Drive", timezone: "America/Denver" },
  { id: "summit-center", name: "Summit City Center", city: "Summit", type: "City", address: "17 Alpine Avenue", timezone: "America/Denver" },
  { id: "sunset-airport", name: "Sunset Coast Airport", city: "Sunset Bay", type: "Airport", address: "9 Pacific Loop", timezone: "America/Los_Angeles" },
  { id: "sunset-marina", name: "Sunset Bay Marina", city: "Sunset Bay", type: "City", address: "250 Marina Walk", timezone: "America/Los_Angeles" },
  { id: "lakeside-station", name: "Lakeside Central Station", city: "Lakeside", type: "City", address: "72 Union Plaza", timezone: "America/Chicago" },
  { id: "capital-airport", name: "Capital Gateway Airport", city: "Capital City", type: "Airport", address: "100 Gateway Boulevard", timezone: "America/Chicago" },
];

export const ratePlans: RatePlanFixture[] = [
  { id: "economy-daily", name: "Economy daily", vehicleCategory: "Economy", currency: "USD", billingUnit: "day", baseAmount: 4900, modelIncrement: 500, priceChangeAdjustment: 800 },
  { id: "compact-daily", name: "Compact daily", vehicleCategory: "Compact", currency: "USD", billingUnit: "day", baseAmount: 6200, modelIncrement: 500, priceChangeAdjustment: 800 },
  { id: "midsize-daily", name: "Midsize daily", vehicleCategory: "Midsize", currency: "USD", billingUnit: "day", baseAmount: 7600, modelIncrement: 500, priceChangeAdjustment: 800 },
  { id: "full-size-daily", name: "Full-size daily", vehicleCategory: "Full-size", currency: "USD", billingUnit: "day", baseAmount: 9100, modelIncrement: 500, priceChangeAdjustment: 800 },
  { id: "suv-daily", name: "SUV daily", vehicleCategory: "SUV", currency: "USD", billingUnit: "day", baseAmount: 10900, modelIncrement: 500, priceChangeAdjustment: 800 },
  { id: "luxury-daily", name: "Luxury daily", vehicleCategory: "Luxury", currency: "USD", billingUnit: "day", baseAmount: 16800, modelIncrement: 500, priceChangeAdjustment: 800 },
  { id: "van-daily", name: "Van daily", vehicleCategory: "Van", currency: "USD", billingUnit: "day", baseAmount: 13200, modelIncrement: 500, priceChangeAdjustment: 800 },
  { id: "electric-daily", name: "Electric daily", vehicleCategory: "Electric", currency: "USD", billingUnit: "day", baseAmount: 12400, modelIncrement: 500, priceChangeAdjustment: 800 },
];

export const fees: FeeFixture[] = [
  { id: "one-way", label: "One-way location fee", pricingModel: "per-rental", amount: 4500, condition: "different-return-location" },
  { id: "young-driver", label: "Young driver fee", pricingModel: "per-day", amount: 2500, condition: "driver-age-range", minimumAge: 21, maximumAge: 24 },
];

export const taxes: TaxFixture[] = [
  { id: "tax", label: "Estimated taxes", rateBasisPoints: 825, calculationOrder: "after-discounts" },
];

export const promotions: PromotionFixture[] = [
  { code: "DRIVE10", label: "DRIVE10 promotion", discountType: "percentage", value: 1000, validFrom: "2026-01-01T00:00", validThrough: "2026-12-31T23:59", stackable: false },
  { code: "WEEKEND25", label: "WEEKEND25 promotion", discountType: "fixed", value: 2500, validFrom: "2026-01-01T00:00", validThrough: "2026-12-31T23:59", maxRentalDays: 4, stackable: false },
  { code: "EXPIRED10", label: "Expired 10% promotion", discountType: "percentage", value: 1000, validFrom: "2026-01-01T00:00", validThrough: "2026-08-01T23:59", stackable: false },
];

export const pricingFixtures: PricingFixtureCatalog = {
  ratePlans,
  fees,
  taxes,
  promotions,
};

const vehicleSeeds: Array<{
  category: VehicleCategory;
  examples: string[];
  passengers: number;
  luggage: number;
  doors: number;
  transmission: "Automatic" | "Manual";
  fuelType: "Petrol" | "Hybrid" | "Electric";
  features: string[];
  accessibilityFeatures: AccessibilityFeature[];
  minimumDriverAge: number;
  accent: string;
}> = [
  { category: "Economy", examples: ["Nissan Versa", "Kia Rio", "Mitsubishi Mirage", "Hyundai Accent"], passengers: 5, luggage: 2, doors: 4, transmission: "Manual", fuelType: "Petrol", features: ["Bluetooth", "Rear camera", "USB charging"], accessibilityFeatures: ["Hand controls"], minimumDriverAge: 21, accent: "#cfe8df" },
  { category: "Compact", examples: ["Toyota Corolla", "Honda Civic", "Volkswagen Jetta", "Mazda 3"], passengers: 5, luggage: 3, doors: 4, transmission: "Automatic", fuelType: "Petrol", features: ["Adaptive cruise", "CarPlay", "Lane assist"], accessibilityFeatures: [], minimumDriverAge: 21, accent: "#d9e8fb" },
  { category: "Midsize", examples: ["Toyota Camry", "Honda Accord", "Hyundai Sonata", "Subaru Legacy"], passengers: 5, luggage: 4, doors: 4, transmission: "Automatic", fuelType: "Hybrid", features: ["Dual-zone climate", "CarPlay", "Blind-spot alert"], accessibilityFeatures: [], minimumDriverAge: 21, accent: "#f4dfc4" },
  { category: "Full-size", examples: ["Chevrolet Malibu", "Nissan Altima", "Chrysler 300", "Volkswagen Arteon"], passengers: 5, luggage: 4, doors: 4, transmission: "Automatic", fuelType: "Petrol", features: ["Premium audio", "Navigation", "Heated seats"], accessibilityFeatures: [], minimumDriverAge: 25, accent: "#eadcf4" },
  { category: "SUV", examples: ["Toyota RAV4", "Ford Explorer", "Jeep Grand Cherokee", "Subaru Forester"], passengers: 5, luggage: 5, doors: 5, transmission: "Automatic", fuelType: "Hybrid", features: ["All-wheel drive", "Power liftgate", "Adaptive cruise"], accessibilityFeatures: ["Wheelchair-accessible entry"], minimumDriverAge: 25, accent: "#d9e0c8" },
  { category: "Luxury", examples: ["BMW 5 Series", "Mercedes E-Class", "Audi A6", "Volvo S90"], passengers: 5, luggage: 4, doors: 4, transmission: "Automatic", fuelType: "Petrol", features: ["Leather interior", "Premium audio", "360 camera"], accessibilityFeatures: [], minimumDriverAge: 25, accent: "#e6d7c5" },
  { category: "Van", examples: ["Chrysler Pacifica", "Toyota Sienna", "Kia Carnival"], passengers: 7, luggage: 6, doors: 5, transmission: "Automatic", fuelType: "Hybrid", features: ["Power doors", "Three rows", "Rear climate"], accessibilityFeatures: ["Wheelchair-accessible entry"], minimumDriverAge: 25, accent: "#d6e4e8" },
  { category: "Electric", examples: ["Tesla Model 3", "Hyundai Ioniq 5", "Kia EV6"], passengers: 5, luggage: 3, doors: 4, transmission: "Automatic", fuelType: "Electric", features: ["300-mile range", "Fast charging", "Navigation"], accessibilityFeatures: [], minimumDriverAge: 25, accent: "#d7d7ef" },
];

export const vehicles: Vehicle[] = vehicleSeeds.flatMap((seed, seedIndex) =>
  seed.examples.map((example, modelIndex) => {
    const ratePlan = ratePlans.find((plan) => plan.vehicleCategory === seed.category);
    if (!ratePlan) throw new Error(`Rate plan for ${seed.category} was not found.`);
    return {
      id: `${seed.category.toLowerCase().replaceAll(" ", "-")}-${modelIndex + 1}`,
      ratePlanId: ratePlan.id,
      category: seed.category,
      name: `${seed.category} ${modelIndex + 1}`,
      example,
      passengers: seed.passengers,
      luggage: seed.luggage,
      doors: seed.doors,
      transmission: seed.transmission,
      fuelType: seed.fuelType,
      features: seed.features,
      accessibilityFeatures: seed.accessibilityFeatures,
      minimumDriverAge: seed.minimumDriverAge,
      dailyRate: ratePlan.baseAmount + modelIndex * ratePlan.modelIncrement,
      locationIds: locations
        .filter((_, locationIndex) => (locationIndex + modelIndex + seedIndex) % 3 !== 0)
        .map((location) => location.id),
      inventory: (modelIndex + seedIndex) % 4 === 0 ? 1 : 4,
      accent: seed.accent,
    };
  }),
);

export const extras: Extra[] = [
  { id: "protection-basic", name: "Essential protection", description: "Reduced damage responsibility for this demo rental.", pricingModel: "per-day", price: 1800, maxQuantity: 1, availableQuantity: 1 },
  { id: "protection-premium", name: "Premium protection", description: "Lowest mock responsibility plus tire and glass cover.", pricingModel: "per-day", price: 3200, maxQuantity: 1, availableQuantity: 1 },
  { id: "additional-driver", name: "Additional driver", description: "Add one additional eligible driver.", pricingModel: "per-day", price: 1200, maxQuantity: 2, availableQuantity: 1 },
  { id: "child-seat", name: "Child safety seat", description: "Age-appropriate child seat, subject to mock availability.", pricingModel: "per-day", price: 900, maxQuantity: 3, availableQuantity: 2 },
  { id: "gps", name: "Portable navigation", description: "A dedicated navigation device.", pricingModel: "per-day", price: 700, maxQuantity: 1, availableQuantity: 0 },
  { id: "roadside", name: "Roadside assistance", description: "Expanded roadside support for the rental period.", pricingModel: "per-rental", price: 2400, maxQuantity: 1, availableQuantity: 1 },
  { id: "prepaid-fuel", name: "Prepaid fuel", description: "Return without refilling the tank.", pricingModel: "per-rental", price: 6500, maxQuantity: 1, availableQuantity: 1 },
];

export const findLocation = (id: string) => locations.find((location) => location.id === id);
export const findVehicle = (id: string) => vehicles.find((vehicle) => vehicle.id === id);
export const findExtra = (id: string) => extras.find((extra) => extra.id === id);
export const findRatePlan = (id: string) => ratePlans.find((ratePlan) => ratePlan.id === id);
export const findFee = (id: FeeFixture["id"]) => fees.find((fee) => fee.id === id);
export const findPromotion = (code: string) => promotions.find((promotion) => promotion.code === code.trim().toUpperCase());

export function validatePricingFixtures(
  catalog: PricingFixtureCatalog = pricingFixtures,
): string[] {
  const errors: string[] = [];
  const duplicate = (values: readonly string[]) =>
    values.find((value, index) => values.indexOf(value) !== index);

  const duplicateRatePlan = duplicate(catalog.ratePlans.map((plan) => plan.id));
  const duplicatePromotion = duplicate(catalog.promotions.map((promotion) => promotion.code));
  if (duplicateRatePlan) errors.push(`Rate plan ID ${duplicateRatePlan} is duplicated.`);
  if (duplicatePromotion) errors.push(`Promotion code ${duplicatePromotion} is duplicated.`);

  const missingCategories = vehicleSeeds
    .map((seed) => seed.category)
    .filter((category) => !catalog.ratePlans.some((plan) => plan.vehicleCategory === category));
  if (missingCategories.length > 0) {
    errors.push(`Missing rate plans for: ${[...new Set(missingCategories)].join(", ")}.`);
  }
  (["one-way", "young-driver"] as const).forEach((feeId) => {
    if (!catalog.fees.some((fee) => fee.id === feeId)) {
      errors.push(`Missing required fee fixture: ${feeId}.`);
    }
  });
  if (catalog.taxes.length === 0) errors.push("At least one tax fixture is required.");

  catalog.ratePlans.forEach((plan) => {
    if (!Number.isSafeInteger(plan.baseAmount) || plan.baseAmount <= 0) {
      errors.push(`${plan.id} must define a positive integer base amount.`);
    }
    if (!Number.isSafeInteger(plan.modelIncrement) || plan.modelIncrement < 0) {
      errors.push(`${plan.id} must define a non-negative integer model increment.`);
    }
    if (!Number.isSafeInteger(plan.priceChangeAdjustment) || plan.priceChangeAdjustment < 0) {
      errors.push(`${plan.id} must define a non-negative integer price-change adjustment.`);
    }
  });
  catalog.fees.forEach((fee) => {
    if (!Number.isSafeInteger(fee.amount) || fee.amount < 0) {
      errors.push(`${fee.id} must define a non-negative integer amount.`);
    }
    if (fee.condition === "driver-age-range") {
      const minimumAge = fee.minimumAge;
      const maximumAge = fee.maximumAge;
      if (
        minimumAge === undefined ||
        maximumAge === undefined ||
        !Number.isSafeInteger(minimumAge) ||
        !Number.isSafeInteger(maximumAge) ||
        minimumAge > maximumAge
      ) {
        errors.push(`${fee.id} must define a valid driver age range.`);
      }
    }
  });
  catalog.taxes.forEach((tax) => {
    if (!Number.isSafeInteger(tax.rateBasisPoints) || tax.rateBasisPoints < 0 || tax.rateBasisPoints > 10_000) {
      errors.push(`${tax.id} must define a tax rate from 0 to 10000 basis points.`);
    }
  });
  catalog.promotions.forEach((promotion) => {
    if (promotion.code !== promotion.code.toUpperCase()) {
      errors.push(`Promotion code ${promotion.code} must be uppercase.`);
    }
    if (!Number.isSafeInteger(promotion.value) || promotion.value <= 0) {
      errors.push(`${promotion.code} must define a positive integer discount value.`);
    }
    if (
      promotion.maxRentalDays !== undefined &&
      (!Number.isSafeInteger(promotion.maxRentalDays) || promotion.maxRentalDays <= 0)
    ) {
      errors.push(`${promotion.code} must define a positive maximum rental duration.`);
    }
    if (
      !Number.isFinite(Date.parse(promotion.validFrom)) ||
      !Number.isFinite(Date.parse(promotion.validThrough)) ||
      Date.parse(promotion.validFrom) > Date.parse(promotion.validThrough)
    ) {
      errors.push(`${promotion.code} must define a valid promotion window.`);
    }
  });
  return errors;
}
