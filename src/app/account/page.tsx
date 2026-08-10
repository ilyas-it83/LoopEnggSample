"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { findVehicle } from "@/lib/fixtures";
import { formatDateTime, formatMoney } from "@/lib/rental";
import { getBookings } from "@/lib/storage";
import type { Booking } from "@/lib/types";

export default function AccountPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  useEffect(() => setBookings(getBookings()), []);
  return (
    <>
      <section className="page-hero"><p className="eyebrow">Simulated account</p><h1>Welcome, Jordan</h1><p>This profile is fictional and provides no production authentication or authorization.</p></section>
      <div className="content-wrap">
        <div className="card-grid">
          <article className="simple-card"><h2>Demo profile</h2><p>Jordan Lee<br />jordan.lee@example.test<br />+1 555 010 2026</p></article>
          <article className="simple-card"><h2>Bookings</h2><div className="stat">{bookings.length}</div><p>Stored in this browser&apos;s mock repository.</p></article>
          <article className="simple-card"><h2>Account state</h2><p><span className="status">Simulated sign-in</span></p><p>No password, token, or secure session is used.</p></article>
        </div>
        <div className="section-heading" style={{ marginTop: 55 }}><div><p className="eyebrow">Your rentals</p><h2>Booking history</h2></div></div>
        <div className="table-wrap">
          <table><thead><tr><th>Reference</th><th>Vehicle</th><th>Pickup</th><th>Status</th><th>Total</th><th /></tr></thead><tbody>
            {bookings.map((booking) => <tr key={booking.id}><td>{booking.reference}</td><td>{findVehicle(booking.vehicleId)?.example}</td><td>{formatDateTime(booking.search.pickupAt)}</td><td><span className={`status ${booking.status === "Cancelled" ? "status-cancelled" : ""}`}>{booking.status}</span></td><td>{formatMoney(booking.quote.total)}</td><td><Link className="link-button" href={`/manage-booking/${booking.id}`}>View</Link></td></tr>)}
          </tbody></table>
        </div>
      </div>
    </>
  );
}

