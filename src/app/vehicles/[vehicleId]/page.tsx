"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { findLocation, findVehicle } from "@/lib/fixtures";
import { buildQuote, defaultSearch, formatMoney } from "@/lib/rental";
import { getScenario, saveCheckout } from "@/lib/storage";
import type { DemoScenario, SearchCriteria } from "@/lib/types";

function VehicleDetails() {
  const params = useParams<{ vehicleId: string }>();
  const query = useSearchParams();
  const router = useRouter();
  const [scenario, setScenario] = useState<DemoScenario>("normal");
  useEffect(() => setScenario(getScenario()), []);

  const vehicle = findVehicle(params.vehicleId);
  const search: SearchCriteria = {
    pickupLocationId: query.get("pickupLocationId") || defaultSearch.pickupLocationId,
    returnLocationId: query.get("returnLocationId") || defaultSearch.returnLocationId,
    pickupAt: query.get("pickupAt") || defaultSearch.pickupAt,
    returnAt: query.get("returnAt") || defaultSearch.returnAt,
    driverAge: Number(query.get("driverAge") || defaultSearch.driverAge),
    promoCode: query.get("promoCode") || undefined,
  };
  if (!vehicle) return <div className="content-wrap"><div className="empty-state"><h1>Vehicle not found</h1><Link className="button button-primary" href="/search">Return to search</Link></div></div>;

  const quote = buildQuote(search, vehicle, [], scenario);
  const unavailable = scenario === "vehicle-unavailable";

  function startCheckout() {
    saveCheckout({ search, vehicleId: vehicle!.id, extras: [], quote });
    router.push("/checkout/extras");
  }

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">{vehicle.category} or similar</p>
        <h1>{vehicle.example}</h1>
        <p>Representative model. Your mock booking guarantees the category and listed capabilities, not a production vehicle.</p>
      </section>
      <div className="content-wrap detail-grid">
        <div className="detail-copy">
          <div className="detail-visual" style={{ background: `linear-gradient(135deg, ${vehicle.accent}, #fff)` }}>
            <div className="car-shape" aria-hidden="true">◆</div>
          </div>
          <div className="vehicle-specs" style={{ marginTop: 18 }}>
            <span>{vehicle.passengers} passengers</span><span>{vehicle.luggage} bags</span><span>{vehicle.doors} doors</span><span>{vehicle.transmission}</span><span>{vehicle.fuelType}</span>
          </div>
          <section className="detail-section">
            <h2>Included features</h2>
            <div className="feature-grid">{vehicle.features.map((feature) => <div className="feature-item" key={feature}>✓ {feature}</div>)}</div>
          </section>
          <section className="detail-section">
            <h2>Your rental</h2>
            <dl className="summary-list">
              <dt>Pickup</dt><dd>{findLocation(search.pickupLocationId)?.name}</dd>
              <dt>Return</dt><dd>{findLocation(search.returnLocationId)?.name}</dd>
              <dt>Minimum age</dt><dd>{vehicle.minimumDriverAge} years</dd>
              <dt>Daily rate</dt><dd>{formatMoney(vehicle.dailyRate)}</dd>
              <dt>Mileage</dt><dd>Unlimited mock mileage</dd>
              <dt>Cancellation</dt><dd>Free before the fixture cutoff</dd>
            </dl>
          </section>
        </div>
        <div>
          {unavailable && <div className="alert alert-error" role="alert" style={{ marginBottom: 14 }}>This vehicle became unavailable under the active demo scenario.</div>}
          <PriceBreakdown quote={quote} />
          <button className="button button-primary" style={{ width: "100%", marginTop: 14 }} type="button" onClick={startCheckout} disabled={unavailable}>Choose this car</button>
          <Link className="button button-secondary" style={{ width: "100%", marginTop: 10 }} href={`/search?${query.toString()}`}>Back to results</Link>
        </div>
      </div>
    </>
  );
}

export default function VehiclePage() {
  return <Suspense fallback={<div className="content-wrap">Loading vehicle…</div>}><VehicleDetails /></Suspense>;
}

