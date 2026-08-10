import { extras, findExtra, MOCK_CLOCK, vehicles } from "./fixtures";
import type {
  DemoScenario,
  Quote,
  QuoteLine,
  SearchCriteria,
  SelectedExtra,
  Vehicle,
} from "./types";

export const defaultSearch: SearchCriteria = {
  pickupLocationId: "harbor-airport",
  returnLocationId: "harbor-airport",
  pickupAt: "2026-08-12T10:00",
  returnAt: "2026-08-15T10:00",
  driverAge: 30,
};

export function validateSearch(search: SearchCriteria): string[] {
  const errors: string[] = [];
  const pickup = Date.parse(search.pickupAt);
  const dropoff = Date.parse(search.returnAt);
  if (!search.pickupLocationId || !search.returnLocationId) errors.push("Select pickup and return locations.");
  if (Number.isNaN(pickup) || Number.isNaN(dropoff)) errors.push("Enter valid pickup and return dates.");
  if (pickup < Date.parse(MOCK_CLOCK)) errors.push("Pickup cannot be earlier than the mock clock.");
  if (dropoff <= pickup) errors.push("Return must be later than pickup.");
  if (search.driverAge < 18 || search.driverAge > 90) errors.push("Driver age must be between 18 and 90.");
  return errors;
}

export function rentalDays(search: SearchCriteria): number {
  const duration = Date.parse(search.returnAt) - Date.parse(search.pickupAt);
  return Math.max(1, Math.ceil(duration / 86_400_000));
}

export function searchVehicles(
  search: SearchCriteria,
  scenario: DemoScenario = "normal",
): Vehicle[] {
  if (scenario === "no-results" || validateSearch(search).length > 0) return [];
  return vehicles.filter(
    (vehicle) =>
      vehicle.inventory > 0 &&
      vehicle.locationIds.includes(search.pickupLocationId) &&
      search.driverAge >= vehicle.minimumDriverAge,
  );
}

export function extraQuantityLimit(extraId: string): number {
  const extra = findExtra(extraId);
  return extra ? Math.min(extra.maxQuantity, extra.availableQuantity) : 0;
}

function extraSelectionErrors(selectedExtras: SelectedExtra[]): Map<string, string> {
  const quantities = new Map<string, number>();
  selectedExtras.forEach((selection) => {
    quantities.set(selection.id, (quantities.get(selection.id) ?? 0) + selection.quantity);
  });

  const errors = new Map<string, string>();
  quantities.forEach((quantity, extraId) => {
    const extra = findExtra(extraId);
    if (!extra) {
      errors.set(extraId, "This extra is not available.");
    } else if (!Number.isInteger(quantity) || quantity < 1) {
      errors.set(extraId, `Select at least one ${extra.name}.`);
    } else if (quantity > extra.maxQuantity) {
      errors.set(extraId, `${extra.name} has a limit of ${extra.maxQuantity} per rental.`);
    } else if (extra.availableQuantity === 0) {
      errors.set(extraId, `${extra.name} is unavailable for this rental.`);
    } else if (quantity > extra.availableQuantity) {
      errors.set(extraId, `Only ${extra.availableQuantity} ${extra.name}s are available for this rental.`);
    }
  });
  return errors;
}

export function validateSelectedExtras(selectedExtras: SelectedExtra[]): string[] {
  return [...extraSelectionErrors(selectedExtras).values()];
}

function validSelectedExtras(selectedExtras: SelectedExtra[]): SelectedExtra[] {
  const errors = extraSelectionErrors(selectedExtras);
  const quantities = new Map<string, number>();
  selectedExtras.forEach((selection) => {
    if (!errors.has(selection.id)) quantities.set(selection.id, (quantities.get(selection.id) ?? 0) + selection.quantity);
  });
  return [...quantities].map(([id, quantity]) => ({ id, quantity }));
}

export function buildQuote(
  search: SearchCriteria,
  vehicle: Vehicle,
  selectedExtras: SelectedExtra[] = [],
  scenario: DemoScenario = "normal",
): Quote {
  const days = rentalDays(search);
  const lines: QuoteLine[] = [];
  const rate = scenario === "price-change" ? vehicle.dailyRate + 800 : vehicle.dailyRate;
  lines.push({ id: "base", label: `${vehicle.category} rental · ${days} day${days === 1 ? "" : "s"}`, amount: rate * days, kind: "charge" });

  if (search.pickupLocationId !== search.returnLocationId) {
    lines.push({ id: "one-way", label: "One-way location fee", amount: 4500, kind: "charge" });
  }
  if (search.driverAge >= 21 && search.driverAge <= 24) {
    lines.push({ id: "young-driver", label: `Young driver fee · ${days} days`, amount: 2500 * days, kind: "charge" });
  }

  validSelectedExtras(selectedExtras).forEach((selection) => {
    const extra = findExtra(selection.id);
    if (!extra || selection.quantity < 1) return;
    const multiplier = extra.pricingModel === "per-day" ? days : 1;
    lines.push({
      id: `extra-${extra.id}`,
      label: `${extra.name}${selection.quantity > 1 ? ` × ${selection.quantity}` : ""}`,
      amount: extra.price * multiplier * selection.quantity,
      kind: "charge",
    });
  });

  const charges = lines.reduce((sum, line) => sum + line.amount, 0);
  const code = search.promoCode?.trim().toUpperCase();
  if (code === "DRIVE10") {
    lines.push({ id: "promo", label: "DRIVE10 promotion", amount: -Math.round(charges * 0.1), kind: "discount" });
  } else if (code === "WEEKEND25" && days <= 4) {
    lines.push({ id: "promo", label: "WEEKEND25 promotion", amount: -2500, kind: "discount" });
  }

  const subtotal = Math.max(0, lines.reduce((sum, line) => sum + line.amount, 0));
  const tax = Math.round(subtotal * 0.0825);
  lines.push({ id: "tax", label: "Estimated taxes", amount: tax, kind: "tax" });

  return {
    currency: "USD",
    days,
    lines,
    subtotal,
    total: subtotal + tax,
    generatedAt: MOCK_CLOCK,
  };
}

export function promotionMessage(code: string, days: number): string {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return "";
  if (normalized === "DRIVE10") return "10% promotion applied.";
  if (normalized === "WEEKEND25" && days <= 4) return "$25 promotion applied.";
  if (normalized === "WEEKEND25") return "WEEKEND25 is only valid for rentals of four days or fewer.";
  return "Promotion code was not recognized.";
}

export const availableExtraIds = new Set(extras.map((extra) => extra.id));

export function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value / 100);
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
