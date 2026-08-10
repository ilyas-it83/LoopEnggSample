"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { extras, findLocation, findVehicle, vehicles } from "@/lib/fixtures";
import {
  buildQuote,
  extraQuantityLimit,
  formatDateTime,
  formatMoney,
  validateSelectedExtras,
  vehicleAvailability,
} from "@/lib/rental";
import {
  cancelBooking,
  findBooking,
  getScenario,
  updateBookingExtras,
  updateBookingVehicle,
} from "@/lib/storage";
import type { Booking, DemoScenario, SelectedExtra } from "@/lib/types";

export default function ManageBookingPage() {
  const params = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null | undefined>(undefined);
  const [editingExtras, setEditingExtras] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<SelectedExtra[]>([]);
  const [editingVehicle, setEditingVehicle] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [vehicleError, setVehicleError] = useState("");
  const [scenario, setCurrentScenario] = useState<DemoScenario>("normal");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const found = findBooking(params.bookingId);
    setBooking(found || null);
    setSelectedExtras(found?.extras || []);
    setSelectedVehicleId(found?.vehicleId || "");
  }, [params.bookingId]);

  useEffect(() => {
    const update = () => setCurrentScenario(getScenario());
    update();
    window.addEventListener("drivewise-storage", update);
    return () => window.removeEventListener("drivewise-storage", update);
  }, []);

  if (booking === undefined) return <div className="content-wrap">Loading booking…</div>;
  if (!booking) return <div className="content-wrap"><div className="empty-state"><h1>Booking not found</h1><Link className="button button-primary" href="/manage-booking">Try another reference</Link></div></div>;
  const vehicle = findVehicle(booking.vehicleId)!;
  const canChange = booking.status === "Confirmed";
  const candidateVehicles = [
    vehicle,
    ...vehicles.filter((item) => item.id !== vehicle.id),
  ];
  const selectedVehicle = findVehicle(selectedVehicleId);
  const selectedVehicleAvailability = selectedVehicle
    ? vehicleAvailability(selectedVehicle, booking.search, scenario)
    : { available: false };
  const canSaveVehicle =
    selectedVehicleId !== booking.vehicleId && selectedVehicleAvailability.available;

  function setQuantity(extraId: string, quantity: number) {
    const extra = extras.find((item) => item.id === extraId)!;
    const limit = extraQuantityLimit(extraId);
    if (quantity > limit) {
      setError(limit === 0
        ? `${extra.name} is unavailable for this rental.`
        : `Only ${limit} ${extra.name}${limit === 1 ? "" : "s"} are available for this rental.`);
      return;
    }
    setSelectedExtras((current) => {
      const selected = current.some((item) => item.id === extraId);
      if (quantity === 0) return current.filter((item) => item.id !== extraId);
      return selected
        ? current.map((item) => item.id === extraId ? { ...item, quantity } : item)
        : [...current, { id: extraId, quantity }];
    });
    setError("");
  }

  function saveExtras() {
    const errors = validateSelectedExtras(selectedExtras);
    if (errors.length > 0) {
      setError(errors[0]);
      return;
    }
    const updated = updateBookingExtras(booking!, selectedExtras, scenario);
    setBooking(updated);
    setEditingExtras(false);
    setError("");
    setMessage("Optional extras updated. The mock total was recalculated.");
  }

  function openVehicleChange() {
    setVehicleError("");
    setSelectedVehicleId(booking!.vehicleId);
    setEditingVehicle(true);
  }

  function saveVehicle() {
    setVehicleError("");
    try {
      const updated = updateBookingVehicle(booking!, selectedVehicleId, scenario);
      setBooking(updated);
      setEditingVehicle(false);
      setMessage(`Vehicle updated to ${findVehicle(updated.vehicleId)?.example ?? "the selected vehicle"}. The mock total was recalculated.`);
    } catch (caught) {
      setVehicleError(caught instanceof Error ? caught.message : "This vehicle could not be selected.");
    }
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
        {error && <div className="alert alert-error" role="alert" style={{ marginBottom: 20 }}>{error}</div>}
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
              <h2>Vehicle</h2>
              {scenario === "vehicle-unavailable" && (
                <div className="alert alert-error" role="alert" style={{ marginBottom: 14 }}>Vehicle changes are unavailable under the active demo scenario.</div>
              )}
              {!editingVehicle ? (
                <>
                  <p>{vehicle.example} · {vehicle.category} or similar</p>
                  <button className="button button-secondary" type="button" disabled={!canChange} onClick={openVehicleChange}>Modify vehicle</button>
                </>
              ) : (
                <div className="extra-list">
                  {vehicleError && <div className="alert alert-error" role="alert" style={{ marginBottom: 14 }}>{vehicleError}</div>}
                  <fieldset>
                    <legend>Available vehicles</legend>
                    {candidateVehicles.map((candidate) => {
                      const availability = vehicleAvailability(candidate, booking.search, scenario);
                      const isCurrent = candidate.id === vehicle.id;
                      const quote = buildQuote(booking.search, candidate, booking.extras, scenario);
                      const base = quote.lines.find((line) => line.id === "base")?.amount ?? 0;
                      const displayedDailyRate = Math.round(base / quote.days);
                      return (
                        <label className="extra-option" key={candidate.id}>
                          <input
                            type="radio"
                            name="vehicle-selection"
                            value={candidate.id}
                            checked={selectedVehicleId === candidate.id}
                            disabled={!availability.available && !isCurrent}
                            onChange={() => setSelectedVehicleId(candidate.id)}
                          />
                          <div>
                            <strong>{candidate.example}</strong>
                            <p>{candidate.category} · {formatMoney(displayedDailyRate)}/day{!availability.available ? ` · ${availability.reason}` : ""}</p>
                          </div>
                        </label>
                      );
                    })}
                  </fieldset>
                  <div className="form-actions">
                    <button className="button button-secondary" type="button" onClick={() => setEditingVehicle(false)}>Discard</button>
                    <button className="button button-primary" type="button" disabled={!canSaveVehicle} onClick={saveVehicle}>Save vehicle change</button>
                  </div>
                </div>
              )}
              <h2>Optional extras</h2>
              {!editingExtras ? (
                <>
                  {booking.extras.length ? <ul>{booking.extras.map((item) => <li key={item.id}>{extras.find((extra) => extra.id === item.id)?.name}</li>)}</ul> : <p>No optional extras selected.</p>}
                  <button className="button button-secondary" type="button" disabled={!canChange} onClick={() => setEditingExtras(true)}>Modify extras</button>
                </>
              ) : (
                <div className="extra-list">
                  {extras.map((extra) => {
                    const quantity = selectedExtras.find((item) => item.id === extra.id)?.quantity ?? 0;
                    const limit = extraQuantityLimit(extra.id);
                    const unavailable = limit === 0;
                    return (
                      <div className="extra-option" key={extra.id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={quantity > 0}
                            disabled={unavailable && quantity === 0}
                            onChange={() => setQuantity(extra.id, quantity > 0 ? 0 : 1)}
                          />
                          <span><strong>{extra.name}</strong><p>{extra.description}</p></span>
                        </label>
                        <span>{formatMoney(extra.price)}</span>
                        {unavailable ? <span className="extra-availability">Unavailable</span> : quantity > 0 ? (
                          <span className="quantity-controls">
                            <button type="button" onClick={() => setQuantity(extra.id, quantity - 1)} aria-label={`Decrease ${extra.name} quantity`}>-</button>
                            <output aria-label={`${extra.name} quantity`}>{quantity}</output>
                            <button type="button" onClick={() => setQuantity(extra.id, quantity + 1)} disabled={quantity >= limit} aria-label={`Increase ${extra.name} quantity`}>+</button>
                            <small>{limit} available</small>
                          </span>
                        ) : (
                          <small className="extra-availability">{limit} available</small>
                        )}
                      </div>
                    );
                  })}
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
