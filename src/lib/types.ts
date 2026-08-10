export type VehicleCategory =
  | "Economy"
  | "Compact"
  | "Midsize"
  | "Full-size"
  | "SUV"
  | "Luxury"
  | "Van"
  | "Electric";

export type FuelType = "Petrol" | "Hybrid" | "Electric";
export type Transmission = "Automatic" | "Manual";
export const ACCESSIBILITY_FEATURES = ["Hand controls", "Wheelchair-accessible entry"] as const;
export type AccessibilityFeature = (typeof ACCESSIBILITY_FEATURES)[number];
export type DemoScenario =
  | "normal"
  | "slow"
  | "no-results"
  | "vehicle-unavailable"
  | "price-change"
  | "payment-decline"
  | "service-error";

export interface MockApiError {
  code: string;
  message: string;
  fields?: string[];
}

export interface MockApiEnvelope<T> {
  data: T | null;
  error: MockApiError | null;
}

export interface MockPaymentAuthorization {
  outcome: "approved" | "declined";
  brand?: string;
  last4?: string;
}

export interface RentalLocation {
  id: string;
  name: string;
  city: string;
  type: "Airport" | "City";
  address: string;
  timezone: string;
}

export interface Vehicle {
  id: string;
  ratePlanId: string;
  category: VehicleCategory;
  name: string;
  example: string;
  passengers: number;
  luggage: number;
  doors: number;
  transmission: Transmission;
  fuelType: FuelType;
  features: string[];
  accessibilityFeatures: AccessibilityFeature[];
  minimumDriverAge: number;
  dailyRate: number;
  locationIds: string[];
  inventory: number;
  accent: string;
}

export interface RatePlanFixture {
  id: string;
  name: string;
  vehicleCategory: VehicleCategory;
  currency: "USD";
  billingUnit: "day";
  baseAmount: number;
  modelIncrement: number;
  priceChangeAdjustment: number;
}

export interface FeeFixture {
  id: "one-way" | "young-driver";
  label: string;
  pricingModel: "per-day" | "per-rental";
  amount: number;
  condition: "different-return-location" | "driver-age-range";
  minimumAge?: number;
  maximumAge?: number;
}

export interface TaxFixture {
  id: string;
  label: string;
  rateBasisPoints: number;
  calculationOrder: "after-discounts";
}

export interface PromotionFixture {
  code: string;
  label: string;
  discountType: "percentage" | "fixed";
  value: number;
  validFrom: string;
  validThrough: string;
  maxRentalDays?: number;
  stackable: false;
}

export interface PricingFixtureCatalog {
  ratePlans: readonly RatePlanFixture[];
  fees: readonly FeeFixture[];
  taxes: readonly TaxFixture[];
  promotions: readonly PromotionFixture[];
}

export interface SearchCriteria {
  pickupLocationId: string;
  returnLocationId: string;
  pickupAt: string;
  returnAt: string;
  driverAge: number;
  promoCode?: string;
}

export interface EstimatedPriceRange {
  min?: number;
  max?: number;
}

export interface Extra {
  id: string;
  name: string;
  description: string;
  pricingModel: "per-day" | "per-rental";
  price: number;
  maxQuantity: number;
  availableQuantity: number;
}

export interface SelectedExtra {
  id: string;
  quantity: number;
}

export interface QuoteLine {
  id: string;
  label: string;
  amount: number;
  kind: "charge" | "discount" | "tax";
}

export interface Quote {
  currency: "USD";
  days: number;
  lines: QuoteLine[];
  subtotal: number;
  total: number;
  generatedAt: string;
}

export interface RenterDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface DriverDetails {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  licenseNumber: string;
  licenseCountry: string;
  licenseExpiry: string;
}

export interface SimulatedProfile {
  renter: RenterDetails;
  driver: DriverDetails;
}

export interface PaymentSummary {
  brand: string;
  last4: string;
}

export type BookingStatus = "Confirmed" | "Active" | "Completed" | "Cancelled";

export interface BookingHistoryEntry {
  id: string;
  action: string;
  at: string;
  detail: string;
}

export interface Booking {
  id: string;
  reference: string;
  status: BookingStatus;
  search: SearchCriteria;
  vehicleId: string;
  extras: SelectedExtra[];
  renter: RenterDetails;
  driver: DriverDetails;
  quote: Quote;
  payment: PaymentSummary;
  createdAt: string;
  updatedAt: string;
  history: BookingHistoryEntry[];
}

export interface CheckoutDraft {
  search: SearchCriteria;
  vehicleId: string;
  extras: SelectedExtra[];
  renter?: RenterDetails;
  driver?: DriverDetails;
  payment?: PaymentSummary;
  quote?: Quote;
  termsAccepted?: boolean;
}
