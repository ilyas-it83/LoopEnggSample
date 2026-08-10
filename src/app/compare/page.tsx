"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { buildComparison } from "@/lib/comparison";
import { findLocation, findVehicle } from "@/lib/fixtures";
import { defaultSearch, searchVehicles, validateSearch } from "@/lib/rental";
import { getScenario } from "@/lib/storage";
import type { DemoScenario, SearchCriteria, Vehicle } from "@/lib/types";

function ComparisonPageContent() {
  const params = useSearchParams();
  const [scenario, setScenario] = useState<DemoScenario>("normal");
  useEffect(() => {
    const update = () => setScenario(getScenario());
    update();
    window.addEventListener("drivewise-storage", update);
    return () => window.removeEventListener("drivewise-storage", update);
  }, []);
  const search: SearchCriteria = {
    pickupLocationId: params.get("pickupLocationId") || defaultSearch.pickupLocationId,
    returnLocationId: params.get("returnLocationId") || defaultSearch.returnLocationId,
    pickupAt: params.get("pickupAt") || defaultSearch.pickupAt,
    returnAt: params.get("returnAt") || defaultSearch.returnAt,
    driverAge: Number(params.get("driverAge") || defaultSearch.driverAge),
    promoCode: params.get("promoCode") || undefined,
  };
  const ids: string[] = [...new Set((params.get("ids") || "").split(",").filter(Boolean))];
  const hasRentalCriteria = [
    "pickupLocationId",
    "returnLocationId",
    "pickupAt",
    "returnAt",
    "driverAge",
  ].every((key) => params.has(key));
  const hasValidSearch =
    hasRentalCriteria &&
    Boolean(findLocation(search.pickupLocationId)) &&
    Boolean(findLocation(search.returnLocationId)) &&
    validateSearch(search).length === 0;
  if (!hasValidSearch) {
    return <ComparisonError message="Enter valid rental criteria before comparing vehicles." />;
  }
  if (ids.length < 2 || ids.length > 3) {
    return <ComparisonError message="Select between two and three vehicles to compare." />;
  }

  const selectedVehicles = ids.map(findVehicle);
  if (selectedVehicles.some((vehicle) => !vehicle)) {
    return <ComparisonError message="One or more selected vehicles are no longer available in the demo fixtures." />;
  }
  const vehicles = selectedVehicles as Vehicle[];
  const availableIds = new Set(searchVehicles(search, scenario).map((vehicle) => vehicle.id));
  if (vehicles.some((vehicle) => !availableIds.has(vehicle.id))) {
    return <ComparisonError message="One or more selected vehicles are unavailable for this rental search." />;
  }

  const comparison = buildComparison(search, vehicles, scenario);
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Side-by-side</p>
        <h1>Vehicle comparison</h1>
        <p>Aligned characteristics and deterministic estimates for your active rental search.</p>
      </section>
      <div className="content-wrap">
        <div className="table-wrap" tabIndex={0}>
          <table>
            <caption className="sr-only">Vehicle comparison matrix</caption>
            <thead>
              <tr>
                <th scope="col">Characteristic</th>
                {vehicles.map((vehicle) => <th scope="col" key={vehicle.id}>{vehicle.example}</th>)}
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {row.values.map((value, index) => (
                    <td key={vehicles[index].id}>
                      {row.label === "Estimated total" && vehicles[index].id === comparison.lowestEstimateVehicleId
                        ? <><strong>{value}</strong><br /><span className="status">Lowest estimate</span></>
                        : value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="fine-print">“Lowest estimate” compares these selected mock vehicles for this rental search; it does not identify a best choice.</p>
        <Link className="button button-secondary" href={`/search?${params.toString()}`}>Back to results</Link>
      </div>
    </>
  );
}

function ComparisonError({ message }: { message: string }) {
  return (
    <div className="content-wrap">
      <div className="empty-state">
        <h1>Comparison unavailable</h1>
        <p role="alert">{message}</p>
        <Link className="button button-primary" href="/search">Return to search results</Link>
      </div>
    </div>
  );
}

export default function ComparisonPage() {
  return <Suspense fallback={<div className="content-wrap">Loading comparison…</div>}><ComparisonPageContent /></Suspense>;
}
