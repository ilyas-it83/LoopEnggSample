"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { VehicleCard } from "@/components/VehicleCard";
import { vehicles } from "@/lib/fixtures";
import { buildQuote, defaultSearch } from "@/lib/rental";
import { getFavorites } from "@/lib/storage";

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  useEffect(() => {
    const update = () => setFavoriteIds(getFavorites());
    update();
    window.addEventListener("drivewise-storage", update);
    return () => window.removeEventListener("drivewise-storage", update);
  }, []);
  const favorites = vehicles.filter((vehicle) => favoriteIds.includes(vehicle.id));

  return (
    <>
      <section className="page-hero"><p className="eyebrow">Saved locally</p><h1>Your favorites</h1><p>Favorite identifiers stay in this browser profile until the demo is reset.</p></section>
      <div className="content-wrap">
        {favorites.length === 0 ? <div className="empty-state"><h2>No saved vehicles yet</h2><p>Use the heart control on any search result.</p><Link className="button button-primary" href="/search">Browse vehicles</Link></div> :
          <div className="vehicle-list">{favorites.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} search={defaultSearch} total={buildQuote(defaultSearch, vehicle).total} />)}</div>}
      </div>
    </>
  );
}

