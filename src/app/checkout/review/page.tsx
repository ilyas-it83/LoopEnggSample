"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckoutProgress } from "@/components/CheckoutProgress";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { findExtra, findLocation, findVehicle } from "@/lib/fixtures";
import { buildQuote, formatDateTime, validateSelectedExtras } from "@/lib/rental";
import { createBooking, getCheckout, getScenario, saveCheckout } from "@/lib/storage";
import type { CheckoutDraft } from "@/lib/types";

export default function ReviewPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<CheckoutDraft | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [priceAccepted, setPriceAccepted] = useState(false);
  useEffect(() => setDraft(getCheckout()), []);

  if (!draft?.quote || !draft.renter || !draft.driver || !draft.payment) return <div className="content-wrap"><div className="empty-state"><h1>Checkout is incomplete</h1><Link className="button button-primary" href="/checkout/payment">Return to payment</Link></div></div>;
  const vehicle = findVehicle(draft.vehicleId)!;
  const scenario = getScenario();
  const latestQuote = buildQuote(draft.search, vehicle, draft.extras, scenario);

  function confirm() {
    if (!accepted) { setError("Accept the fictional rental terms before confirming."); return; }
    const extraErrors = validateSelectedExtras(draft!.extras);
    if (extraErrors.length > 0) {
      setError(`${extraErrors[0]} Return to extras and update the selection before confirming.`);
      return;
    }
    if (scenario === "service-error") { setError("The mock booking service is unavailable. No booking was created."); return; }
    if (scenario === "vehicle-unavailable") { setError("The selected vehicle became unavailable. Return to search and choose another vehicle."); return; }
    if (latestQuote.total !== draft!.quote!.total && !priceAccepted) {
      const updated = { ...draft!, quote: latestQuote };
      saveCheckout(updated);
      setDraft(updated);
      setPriceAccepted(true);
      setError("The mock price changed. Review the new total and confirm again to accept it.");
      return;
    }
    const booking = createBooking({ ...draft!, quote: latestQuote, termsAccepted: true });
    router.push(`/booking/confirmation/${booking.id}`);
  }

  return (
    <div className="content-wrap">
      <CheckoutProgress current="review" />
      <div className="checkout-grid">
        <section className="form-panel">
          <p className="eyebrow">Step 4 of 4</p><h1>Review and confirm</h1>
          {error && <div className="alert alert-error" role="alert">{error}</div>}
          <div className="review-block">
            <h2>Trip</h2>
            <dl className="summary-list">
              <dt>Pickup</dt><dd>{findLocation(draft.search.pickupLocationId)?.name}<br />{formatDateTime(draft.search.pickupAt)}</dd>
              <dt>Return</dt><dd>{findLocation(draft.search.returnLocationId)?.name}<br />{formatDateTime(draft.search.returnAt)}</dd>
              <dt>Vehicle</dt><dd>{vehicle.example} · {vehicle.category} or similar</dd>
            </dl>
          </div>
          <div className="review-block">
            <h2>Driver and renter</h2>
            <dl className="summary-list">
              <dt>Renter</dt><dd>{draft.renter.firstName} {draft.renter.lastName}<br />{draft.renter.email}</dd>
              <dt>Driver</dt><dd>{draft.driver.firstName} {draft.driver.lastName}<br />License ending {draft.driver.licenseNumber.slice(-4)}</dd>
              <dt>Payment</dt><dd>{draft.payment.brand} ending {draft.payment.last4}</dd>
            </dl>
          </div>
          <div className="review-block">
            <h2>Selected extras</h2>
            {draft.extras.length ? <ul>{draft.extras.map((item) => <li key={item.id}>{findExtra(item.id)?.name}</li>)}</ul> : <p>No optional extras selected.</p>}
          </div>
          <label className="checkbox-row"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} /> I accept the fictional rental terms and understand that no real vehicle, payment, insurance, or notification is provided.</label>
          <div className="form-actions"><Link className="button button-secondary" href="/checkout/payment">Back</Link><button className="button button-primary" type="button" onClick={confirm}>Confirm mock booking</button></div>
        </section>
        <PriceBreakdown quote={draft.quote} title={priceAccepted ? "Updated price" : "Final estimate"} />
      </div>
    </div>
  );
}
