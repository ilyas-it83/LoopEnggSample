"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { locations, vehicles } from "@/lib/fixtures";
import { formatMoney } from "@/lib/rental";
import { getBookings } from "@/lib/storage";
import type { Booking } from "@/lib/types";

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => setBookings(getBookings()), []);
  return (
    <>
      <section className="page-hero"><p className="eyebrow">Read-only demo administration</p><h1>Fleet overview</h1><p>Operational-looking data for demonstration only. No authorization or production controls are provided.</p></section>
      <div className="content-wrap">
        <div className="card-grid">
          <article className="simple-card"><h2>Locations</h2><div className="stat">{locations.length}</div><p>Airport and city fixtures.</p></article>
          <article className="simple-card"><h2>Vehicles</h2><div className="stat">{vehicles.length}</div><p>Across eight rental categories.</p></article>
          <article className="simple-card"><h2>Bookings</h2><div className="stat">{bookings.length}</div><p>Mutable local demo records.</p></article>
        </div>
        <div className="section-heading" style={{ marginTop: 55 }}><div><p className="eyebrow">Inventory</p><h2>Vehicle fixtures</h2></div><Link href="/demo-controls">Change scenario →</Link></div>
        <div className="table-wrap">
          <table><thead><tr><th>Vehicle</th><th>Category</th><th>Fuel</th><th>Locations</th><th>Inventory</th><th>Daily rate</th></tr></thead><tbody>
            {vehicles.map((vehicle) => <tr key={vehicle.id}><td>{vehicle.example}</td><td>{vehicle.category}</td><td>{vehicle.fuelType}</td><td>{vehicle.locationIds.length}</td><td>{vehicle.inventory}</td><td>{formatMoney(vehicle.dailyRate)}</td></tr>)}
          </tbody></table>
        </div>
      </div>
    </>
  );
}

