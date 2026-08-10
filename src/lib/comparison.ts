import { buildQuote, formatMoney } from "./rental";
import type { SearchCriteria, Vehicle } from "./types";

export const MAX_COMPARISON_VEHICLES = 3;

export interface ComparisonRow {
  label: string;
  values: string[];
}

export interface VehicleComparison {
  rows: ComparisonRow[];
  lowestEstimateVehicleId: string;
}

export function buildComparison(search: SearchCriteria, selectedVehicles: Vehicle[]): VehicleComparison {
  if (selectedVehicles.length < 2 || selectedVehicles.length > MAX_COMPARISON_VEHICLES) {
    throw new Error("Select between two and three vehicles to compare.");
  }

  const estimates = selectedVehicles.map((vehicle) => buildQuote(search, vehicle).total);
  const lowestEstimate = Math.min(...estimates);
  return {
    lowestEstimateVehicleId: selectedVehicles[estimates.indexOf(lowestEstimate)].id,
    rows: [
      { label: "Category", values: selectedVehicles.map((vehicle) => vehicle.category) },
      { label: "Estimated total", values: estimates.map(formatMoney) },
      { label: "Passengers", values: selectedVehicles.map((vehicle) => String(vehicle.passengers)) },
      { label: "Luggage", values: selectedVehicles.map((vehicle) => `${vehicle.luggage} bags`) },
      { label: "Doors", values: selectedVehicles.map((vehicle) => String(vehicle.doors)) },
      { label: "Transmission", values: selectedVehicles.map((vehicle) => vehicle.transmission) },
      { label: "Fuel or power", values: selectedVehicles.map((vehicle) => vehicle.fuelType) },
      { label: "Minimum driver age", values: selectedVehicles.map((vehicle) => `${vehicle.minimumDriverAge} years`) },
      { label: "Included features", values: selectedVehicles.map((vehicle) => vehicle.features.join(", ")) },
    ],
  };
}
