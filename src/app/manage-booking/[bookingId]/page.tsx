"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { extras, findLocation, findVehicle } from "@/lib/fixtures";
import { formatDateTime, formatMoney } from "@/lib/rental";
import { cancelBooking, findBooking, updateBookingExtras } from "@/lib/storage";
import type { Booking, SelectedExtra } from "@/lib/types";

export default function ManageBookingPage() {
  const params = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null | undefined>(undefined);
  const [editingExtras, setEditingExtras] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<SelectedExtra[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const found = findBooking(params.bookingId);
    setBooking(found || null);
    setSelectedExtras(found?.extras || []);
  }, [params.bookingId]);

  if (booking === undefined) return <div className="content-wrap">Loading booking…</div>;
  if (!booking) return <div className="content-wrap"><div className="empty-state"><h1>Booking not found</h1><Link className="button button-primary" href="/manage-booking">Try another reference</Link></div></div>;
  const vehicle = findVehicle(booking.vehicleId)!;
  const canChange = booking.status === "Confirmed";

  function toggle(extraId: string) {
    setSelectedExtras((current) => current.some((item) => item.id === extraId) ? current.filter((item) => item.id !== extraId) : [...current, { id: extraId, quantity: 1 }]);
  }

  function saveExtras() {
    const updated = updateBookingExtras(booking!, selectedExtras);
    setBooking(updated);
    setEditingExtras(false);
    setMessage("Optional extras updated. The mock total was recalculated.");
  }

  function cancel() {
    if (!window.confirm("Cancel this fictional booking? This action changes local demo state.")) return;
    const updated = cancelBooking(booking!);
    setBooking(updated);
    setMessage("Booking cancelled. Mock refund estimate: " + formatMoney(updated.quote.total));
  }

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Booking {booking.reference}</p>
        <h1>{vehicle.example}</h1>
        <p><span className={`status ${booking.status === "Cancelled" ? "status-cancelled" : ""}`}>{booking.status}</span></p>
      </section>
      <div className="content-wrap">
        {message && <div className="alert alert-success" role="status" style={{ marginBottom: 20 }}>{message}</div>}
        <div className="checkout-grid">
          <div>
            <section className="form-panel">
              <h2>Rental itinerary</h2>
              <dl className="summary-list">
                <dt>Pickup</dt><dd>{findLocation(booking.search.pickupLocationId)?.name}<br />{formatDateTime(booking.search.pickupAt)}</dd>
                <dt>Return</dt><dd>{findLocation(booking.search.returnLocationId)?.name}<br />{formatDateTime(booking.search.returnAt)}</dd>
                <dt>Vehicle</dt><dd>{vehicle.example} · {vehicle.category} or similar</dd>
                <dt>Driver</dt><dd>{booking.driver.firstName} {booking.driver.lastName}</dd>
                <dt>Payment</dt><dd>{booking.payment.brand} ending {booking.payment.last4}</dd>
              </dl>
              <h2>Optional extras</h2>
              {!editingExtras ? (
                <>
                  {booking.extras.length ? <ul>{booking.extras.map((item) => <li key={item.id}>{extras.find((extra) => extra.id === item.id)?.name}</li>)}</ul> : <p>No optional extras selected.</p>}
                  <button className="button button-secondary" type="button" disabled={!canChange} onClick={() => setEditingExtras(true)}>Modify extras</button>
                </>
              ) : (
                <div className="extra-list">
                  {extras.map((extra) => <label className="extra-option" key={extra.id}><input type="checkbox" checked={selectedExtras.some((item) => item.id === extra.id)} onChange={() => toggle(extra.id)} /><span><strong>{extra.name}</strong><p>{extra.description}</p></span><span>{formatMoney(extra.price)}</span></label>)}
                  <div className="form-actions"><button className="button button-secondary" type="button" onClick={() => setEditingExtras(false)}>Discard</button><button className="button button-primary" type="button" onClick={saveExtras}>Save changes</button></div>
                </div>
              )}
              <h2>Booking history</h2>
              <div className="table-wrap">
                <table><thead><tr><th>Action</th><th>Date</th><th>Detail</th></tr></thead><tbody>{booking.history.map((entry) => <tr key={entry.id}><td>{entry.action}</td><td>{formatDateTime(entry.at)}</td><td>{entry.detail}</td></tr>)}</tbody></table>
              </div>
              <div className="form-actions"><Link className="button button-secondary" href="/manage-booking">Another booking</Link><button className="button button-danger" type="button" disabled={!canChange} onClick={cancel}>Cancel booking</button></div>
              {!canChange && <p className="fine-print">Cancelled, active, and completed bookings cannot be modified or cancelled again.</p>}
            </section>
          </div>
          <PriceBreakdown quote={booking.quote} title="Booking total" />
        </div>
      </div>
    </>
  );
}

