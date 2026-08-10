"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchForm } from "@/components/SearchForm";
import { VehicleCard } from "@/components/VehicleCard";
import {
  buildQuote,
  defaultSearch,
  filterVehiclesByEstimatedPrice,
  searchVehicles,
  validateEstimatedPriceRange,
} from "@/lib/rental";
import { getScenario } from "@/lib/storage";
import type { DemoScenario, EstimatedPriceRange, SearchCriteria, VehicleCategory } from "@/lib/types";

function SearchResults() {
  const params = useSearchParams();
  const search: SearchCriteria = {
    pickupLocationId: params.get("pickupLocationId") || defaultSearch.pickupLocationId,
    returnLocationId: params.get("returnLocationId") || defaultSearch.returnLocationId,
    pickupAt: params.get("pickupAt") || defaultSearch.pickupAt,
    returnAt: params.get("returnAt") || defaultSearch.returnAt,
    driverAge: Number(params.get("driverAge") || defaultSearch.driverAge),
    promoCode: params.get("promoCode") || undefined,
  };
  const [scenario, setCurrentScenario] = useState<DemoScenario>("normal");
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [fuel, setFuel] = useState<string[]>([]);
  const [sort, setSort] = useState("recommended");
  const [minimumPrice, setMinimumPrice] = useState("");
  const [maximumPrice, setMaximumPrice] = useState("");
  const [priceRange, setPriceRange] = useState<EstimatedPriceRange>({});
  const [priceRangeError, setPriceRangeError] = useState("");

  useEffect(() => {
    const update = () => setCurrentScenario(getScenario());
    update();
    window.addEventListener("drivewise-storage", update);
    return () => window.removeEventListener("drivewise-storage", update);
  }, []);

  const baseResults = searchVehicles(search, scenario)
    .filter(
      (vehicle) =>
        (categories.length === 0 || categories.includes(vehicle.category)) &&
        (fuel.length === 0 || fuel.includes(vehicle.fuelType)),
    );
  const results = filterVehiclesByEstimatedPrice(baseResults, search, priceRange, scenario)
    .sort((a, b) => {
      if (sort === "price-asc") return a.dailyRate - b.dailyRate;
      if (sort === "price-desc") return b.dailyRate - a.dailyRate;
      if (sort === "capacity") return b.passengers - a.passengers;
      if (sort === "name") return a.example.localeCompare(b.example);
      return b.inventory - a.inventory;
    });

  function toggleCategory(category: VehicleCategory) {
    setCategories((current) => current.includes(category) ? current.filter((item) => item !== category) : [...current, category]);
  }

  function toggleFuel(value: string) {
    setFuel((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  function applyPriceRange() {
    const nextRange: EstimatedPriceRange = {
      ...(minimumPrice ? { min: Number(minimumPrice) * 100 } : {}),
      ...(maximumPrice ? { max: Number(maximumPrice) * 100 } : {}),
    };
    const [error] = validateEstimatedPriceRange(nextRange);
    if (error) {
      setPriceRangeError(error);
      return;
    }
    setPriceRange(nextRange);
    setPriceRangeError("");
  }

  function clearFilters() {
    setCategories([]);
    setFuel([]);
    setMinimumPrice("");
    setMaximumPrice("");
    setPriceRange({});
    setPriceRangeError("");
  }

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Available cars</p>
        <h1>Choose your drive</h1>
        <p>Every result uses deterministic mock availability and an itemized estimate.</p>
      </section>
      <div className="content-wrap">
        <SearchForm initial={search} compact />
        {scenario === "service-error" && <div className="alert alert-error" role="alert" style={{ marginTop: 20 }}>The mock vehicle service is unavailable. Change the scenario in Demo controls and retry.</div>}
        <div className="results-layout" style={{ marginTop: 30 }}>
          <aside className="filter-panel" aria-label="Vehicle filters">
            <h2>Filter results</h2>
            <div className="filter-group">
              <strong>Category</strong>
              {(["Economy", "Compact", "Midsize", "SUV", "Luxury", "Van", "Electric"] as VehicleCategory[]).map((category) => (
                <label key={category}><input type="checkbox" checked={categories.includes(category)} onChange={() => toggleCategory(category)} /> {category}</label>
              ))}
            </div>
            <div className="filter-group">
              <strong>Fuel or power</strong>
              {["Petrol", "Hybrid", "Electric"].map((value) => (
                <label key={value}><input type="checkbox" checked={fuel.includes(value)} onChange={() => toggleFuel(value)} /> {value}</label>
              ))}
            </div>
            <form className="filter-group" onSubmit={(event) => { event.preventDefault(); applyPriceRange(); }}>
              <strong>Estimated total (USD)</strong>
              <label htmlFor="minimum-price">Minimum
                <input id="minimum-price" type="number" min="0" step="1" inputMode="numeric" value={minimumPrice} onChange={(event) => setMinimumPrice(event.target.value)} aria-describedby={priceRangeError ? "price-range-error" : undefined} />
              </label>
              <label htmlFor="maximum-price">Maximum
                <input id="maximum-price" type="number" min="0" step="1" inputMode="numeric" value={maximumPrice} onChange={(event) => setMaximumPrice(event.target.value)} aria-describedby={priceRangeError ? "price-range-error" : undefined} />
              </label>
              {priceRangeError && <p id="price-range-error" className="filter-error" role="alert">{priceRangeError} Correct the range and apply it again.</p>}
              <button className="button button-secondary button-small" type="submit">Apply price range</button>
            </form>
            <button className="link-button" type="button" onClick={clearFilters}>Clear all filters</button>
          </aside>
          <section aria-live="polite">
            <div className="result-toolbar">
              <strong>{results.length} matching vehicles</strong>
              <label>Sort by{" "}
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="capacity">Passenger capacity</option>
                  <option value="name">Vehicle name</option>
                </select>
              </label>
            </div>
            {results.length === 0 ? (
              <div className="empty-state">
                <h2>No vehicles match this search</h2>
                <p>Change the dates, location, driver age, or active filters. The no-results demo scenario may also be enabled.</p>
                <button className="button button-secondary" type="button" onClick={clearFilters}>Clear filters</button>
              </div>
            ) : (
              <div className="vehicle-list">
                {results.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} search={search} total={buildQuote(search, vehicle, [], scenario).total} />)}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default function SearchPage() {
  return <Suspense fallback={<div className="content-wrap">Loading mock inventory…</div>}><SearchResults /></Suspense>;
}
