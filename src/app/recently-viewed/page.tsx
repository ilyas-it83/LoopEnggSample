"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { VehicleCard } from "@/components/VehicleCard";
import { vehicles as fixtureVehicles } from "@/lib/fixtures";
import { buildQuote, defaultSearch } from "@/lib/rental";
import { getRecentlyViewed } from "@/lib/storage";

const vehiclesById = new Map(fixtureVehicles.map((vehicle) => [vehicle.id, vehicle]));

export default function RecentlyViewedPage() {
  const [vehicleIds, setVehicleIds] = useState<string[] | null>(null);

  useEffect(() => {
    const update = () => setVehicleIds(getRecentlyViewed());
    update();
    window.addEventListener("drivewise-storage", update);
    return () => window.removeEventListener("drivewise-storage", update);
  }, []);

  const vehicles = (vehicleIds ?? []).flatMap((id) => {
    const vehicle = vehiclesById.get(id);
    return vehicle ? [vehicle] : [];
  });

  return (
    <>
      <section className="page-hero"><p className="eyebrow">Saved locally</p><h1>Recently viewed</h1><p>Vehicle details you view are saved in this browser profile until the demo is reset.</p></section>
      <div className="content-wrap">
        {vehicleIds === null ? <p role="status">Loading recently viewed vehicles…</p> :
          vehicles.length === 0 ? <div className="empty-state"><h2>No recently viewed vehicles</h2><p>View a vehicle’s details to add it here.</p><Link className="button button-primary" href="/search">Browse vehicles</Link></div> :
            <div className="vehicle-list">{vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} search={defaultSearch} total={buildQuote(defaultSearch, vehicle).total} />)}</div>}
      </div>
    </>
  );
}
