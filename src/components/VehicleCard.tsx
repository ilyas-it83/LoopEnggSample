"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatMoney } from "@/lib/rental";
import { getComparison, getFavorites, toggleComparison, toggleFavorite } from "@/lib/storage";
import type { SearchCriteria, Vehicle } from "@/lib/types";

export function VehicleCard({ vehicle, search, total }: { vehicle: Vehicle; search: SearchCriteria; total: number }) {
  const [favorite, setFavorite] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState(false);
  const [comparisonMessage, setComparisonMessage] = useState("");

  useEffect(() => {
    setFavorite(getFavorites().includes(vehicle.id));
    setSelectedForComparison(getComparison().includes(vehicle.id));
  }, [vehicle.id]);

  const query = new URLSearchParams({
    pickupLocationId: search.pickupLocationId,
    returnLocationId: search.returnLocationId,
    pickupAt: search.pickupAt,
    returnAt: search.returnAt,
    driverAge: String(search.driverAge),
    ...(search.promoCode ? { promoCode: search.promoCode } : {}),
  });

  return (
    <article className="vehicle-card">
      <div className="vehicle-visual" style={{ background: `linear-gradient(135deg, ${vehicle.accent}, #ffffff)` }}>
        <span>{vehicle.category}</span>
        <div className="car-shape" aria-hidden="true">◆</div>
        <button
          className={`favorite-button ${favorite ? "is-favorite" : ""}`}
          type="button"
          aria-label={`${favorite ? "Remove" : "Add"} ${vehicle.example} ${favorite ? "from" : "to"} favorites`}
          onClick={() => setFavorite(toggleFavorite(vehicle.id).includes(vehicle.id))}
        >
          {favorite ? "♥" : "♡"}
        </button>
      </div>
      <div className="vehicle-content">
        <div>
          <p className="eyebrow">{vehicle.category} or similar</p>
          <h2>{vehicle.example}</h2>
          <div className="vehicle-specs">
            <span>{vehicle.passengers} seats</span>
            <span>{vehicle.luggage} bags</span>
            <span>{vehicle.transmission}</span>
            <span>{vehicle.fuelType}</span>
          </div>
          <ul className="feature-list">
            {vehicle.features.slice(0, 3).map((feature) => <li key={feature}>✓ {feature}</li>)}
          </ul>
          {vehicle.inventory === 1 && <p className="low-stock">Only 1 in this demo fixture</p>}
        </div>
        <div className="vehicle-price">
          <span>Estimated total</span>
          <strong>{formatMoney(total)}</strong>
          <small>Taxes and fees included</small>
          <Link className="button button-primary" href={`/vehicles/${vehicle.id}?${query.toString()}`}>
            View deal
          </Link>
          <button
            className="button button-secondary button-small"
            type="button"
            style={{ marginTop: 10 }}
            onClick={() => {
              const selected = getComparison();
              if (!selectedForComparison && selected.length >= 3) {
                setComparisonMessage("You can compare up to three vehicles. Remove a vehicle before adding another.");
                return;
              }
              setSelectedForComparison(toggleComparison(vehicle.id).includes(vehicle.id));
              setComparisonMessage("");
            }}
          >
            {selectedForComparison ? "Remove from comparison" : "Add to comparison"}
          </button>
          {comparisonMessage && <p className="alert alert-error" role="alert">{comparisonMessage}</p>}
        </div>
      </div>
    </article>
  );
}
