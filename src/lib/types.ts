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
export type DemoScenario =
  | "normal"
  | "slow"
  | "no-results"
  | "vehicle-unavailable"
  | "price-change"
  | "payment-decline"
  | "service-error";

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
  category: VehicleCategory;
  name: string;
  example: string;
  passengers: number;
  luggage: number;
  doors: number;
  transmission: Transmission;
  fuelType: FuelType;
  features: string[];
  minimumDriverAge: number;
  dailyRate: number;
  locationIds: string[];
  inventory: number;
  accent: string;
}

export interface SearchCriteria {
  pickupLocationId: string;
  returnLocationId: string;
  pickupAt: string;
  returnAt: string;
  driverAge: number;
  promoCode?: string;
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
