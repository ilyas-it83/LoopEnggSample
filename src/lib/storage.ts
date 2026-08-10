"use client";

import { buildQuote, defaultSearch, vehicleAvailability } from "./rental";
import { findVehicle } from "./fixtures";
import type {
  Booking,
  CheckoutDraft,
  DemoScenario,
  DriverDetails,
  RenterDetails,
  SelectedExtra,
} from "./types";

const KEYS = {
  checkout: "drivewise.checkout",
  bookings: "drivewise.bookings",
  favorites: "drivewise.favorites",
  scenario: "drivewise.scenario",
};

const demoRenter: RenterDetails = {
  firstName: "Jordan",
  lastName: "Lee",
  email: "jordan.lee@example.test",
  phone: "+1 555 010 2026",
};

const demoDriver: DriverDetails = {
  firstName: "Jordan",
  lastName: "Lee",
  dateOfBirth: "1990-04-18",
  licenseNumber: "DEMO-48291",
  licenseCountry: "United States",
  licenseExpiry: "2029-04-18",
};

function seedBooking(): Booking {
  const vehicle = findVehicle("compact-1")!;
  const search = {
    ...defaultSearch,
    pickupAt: "2026-08-20T09:00",
    returnAt: "2026-08-23T09:00",
  };
  return {
    id: "booking-seed-1",
    reference: "DW-260820-A1B2",
    status: "Confirmed",
    search,
    vehicleId: vehicle.id,
    extras: [{ id: "protection-basic", quantity: 1 }],
    renter: demoRenter,
    driver: demoDriver,
    quote: buildQuote(search, vehicle, [{ id: "protection-basic", quantity: 1 }]),
    payment: { brand: "Visa", last4: "4242" },
    createdAt: "2026-08-01T12:00:00.000Z",
    updatedAt: "2026-08-01T12:00:00.000Z",
    history: [{ id: "history-seed-1", action: "Booked", at: "2026-08-01T12:00:00.000Z", detail: "Demo booking created." }],
  };
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const value = window.localStorage.getItem(key);
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("drivewise-storage"));
}

export function getCheckout(): CheckoutDraft | null {
  return read<CheckoutDraft | null>(KEYS.checkout, null);
}

export function saveCheckout(draft: CheckoutDraft): void {
  write(KEYS.checkout, draft);
}

export function clearCheckout(): void {
  window.localStorage.removeItem(KEYS.checkout);
}

export function getBookings(): Booking[] {
  const bookings = read<Booking[] | null>(KEYS.bookings, null);
  if (bookings) return bookings;
  const seeded = [seedBooking()];
  write(KEYS.bookings, seeded);
  return seeded;
}

export function saveBooking(booking: Booking): void {
  const existing = getBookings();
  const index = existing.findIndex((item) => item.id === booking.id);
  const next = index >= 0 ? existing.map((item) => (item.id === booking.id ? booking : item)) : [booking, ...existing];
  write(KEYS.bookings, next);
}

export function findBooking(idOrReference: string): Booking | undefined {
  const normalized = idOrReference.trim().toUpperCase();
  return getBookings().find(
    (booking) => booking.id === idOrReference || booking.reference.toUpperCase() === normalized,
  );
}

export function createBooking(draft: CheckoutDraft): Booking {
  const existing = getBookings().find(
    (booking) =>
      booking.vehicleId === draft.vehicleId &&
      booking.search.pickupAt === draft.search.pickupAt &&
      booking.renter.email === draft.renter?.email,
  );
  if (existing) return existing;

  const now = new Date().toISOString();
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  const booking: Booking = {
    id: `booking-${Date.now()}`,
    reference: `DW-${draft.search.pickupAt.slice(2, 10).replaceAll("-", "")}-${suffix}`,
    status: "Confirmed",
    search: draft.search,
    vehicleId: draft.vehicleId,
    extras: draft.extras,
    renter: draft.renter!,
    driver: draft.driver!,
    quote: draft.quote!,
    payment: draft.payment!,
    createdAt: now,
    updatedAt: now,
    history: [{ id: `history-${Date.now()}`, action: "Booked", at: now, detail: "Booking confirmed using mock payment." }],
  };
  saveBooking(booking);
  return booking;
}

export function updateBookingExtras(booking: Booking, selectedExtras: SelectedExtra[]): Booking {
  const vehicle = findVehicle(booking.vehicleId)!;
  const now = new Date().toISOString();
  const updated: Booking = {
    ...booking,
    extras: selectedExtras,
    quote: buildQuote(booking.search, vehicle, selectedExtras),
    updatedAt: now,
    history: [
      ...booking.history,
      { id: `history-${Date.now()}`, action: "Modified", at: now, detail: "Optional extras were updated." },
    ],
  };
  saveBooking(updated);
  return updated;
}

export function updateBookingVehicle(booking: Booking, vehicleId: string, scenario: DemoScenario = "normal"): Booking {
  if (booking.status !== "Confirmed") {
    throw new Error("Cancelled, active, and completed bookings cannot be modified.");
  }
  const vehicle = findVehicle(vehicleId);
  if (!vehicle) {
    throw new Error("Selected vehicle could not be found.");
  }
  const availability = vehicleAvailability(vehicle, booking.search, scenario);
  if (!availability.available) {
    throw new Error(availability.reason || "This vehicle is not available for this booking.");
  }
  const now = new Date().toISOString();
  const updated: Booking = {
    ...booking,
    vehicleId,
    quote: buildQuote(booking.search, vehicle, booking.extras, scenario),
    updatedAt: now,
    history: [
      ...booking.history,
      { id: `history-${Date.now()}`, action: "Vehicle changed", at: now, detail: `Vehicle updated to ${vehicle.example}.` },
    ],
  };
  saveBooking(updated);
  return updated;
}

export function cancelBooking(booking: Booking): Booking {
  if (booking.status === "Cancelled") return booking;
  const now = new Date().toISOString();
  const cancelled: Booking = {
    ...booking,
    status: "Cancelled",
    updatedAt: now,
    history: [
      ...booking.history,
      { id: `history-${Date.now()}`, action: "Cancelled", at: now, detail: "Booking cancelled with no mock fee." },
    ],
  };
  saveBooking(cancelled);
  return cancelled;
}

export function getFavorites(): string[] {
  return read<string[]>(KEYS.favorites, []);
}

export function toggleFavorite(vehicleId: string): string[] {
  const favorites = getFavorites();
  const next = favorites.includes(vehicleId)
    ? favorites.filter((id) => id !== vehicleId)
    : [...favorites, vehicleId];
  write(KEYS.favorites, next);
  return next;
}

export function getScenario(): DemoScenario {
  return read<DemoScenario>(KEYS.scenario, "normal");
}

export function setScenario(scenario: DemoScenario): void {
  write(KEYS.scenario, scenario);
}

export function resetDemo(): void {
  Object.values(KEYS).forEach((key) => window.localStorage.removeItem(key));
  window.dispatchEvent(new Event("drivewise-storage"));
}

