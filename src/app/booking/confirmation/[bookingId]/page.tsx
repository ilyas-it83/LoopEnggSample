"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { findLocation, findVehicle } from "@/lib/fixtures";
import { formatDateTime, formatMoney } from "@/lib/rental";
import { clearCheckout, findBooking } from "@/lib/storage";
import type { Booking } from "@/lib/types";

export default function ConfirmationPage() {
  const params = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null | undefined>(undefined);
  useEffect(() => {
    setBooking(findBooking(params.bookingId) || null);
    clearCheckout();
  }, [params.bookingId]);

  if (booking === undefined) return <div className="content-wrap">Loading confirmation…</div>;
  if (!booking) return <div className="content-wrap"><div className="empty-state"><h1>Booking not found</h1><Link className="button button-primary" href="/manage-booking">Look up a booking</Link></div></div>;
  const vehicle = findVehicle(booking.vehicleId)!;

  return (
    <div className="content-wrap">
      <article className="confirmation-card">
        <div className="success-mark">✓</div>
        <p className="eyebrow">Mock booking confirmed</p>
        <h1>You&apos;re ready to drive</h1>
        <p>A simulated notification was recorded. No real email or SMS was sent.</p>
        <div className="booking-reference">{booking.reference}</div>
        <dl className="summary-list" style={{ textAlign: "left", marginTop: 25 }}>
          <dt>Vehicle</dt><dd>{vehicle.example} · {vehicle.category} or similar</dd>
          <dt>Pickup</dt><dd>{findLocation(booking.search.pickupLocationId)?.name}<br />{formatDateTime(booking.search.pickupAt)}</dd>
          <dt>Return</dt><dd>{findLocation(booking.search.returnLocationId)?.name}<br />{formatDateTime(booking.search.returnAt)}</dd>
          <dt>Total</dt><dd>{formatMoney(booking.quote.total)}</dd>
          <dt>Status</dt><dd><span className="status">{booking.status}</span></dd>
        </dl>
        <div className="confirmation-actions">
          <Link className="button button-primary" href={`/manage-booking/${booking.id}`}>Manage booking</Link>
          <button className="button button-secondary" type="button" onClick={() => window.print()}>Print confirmation</button>
          <Link className="button button-secondary" href="/">Return home</Link>
        </div>
      </article>
    </div>
  );
}

