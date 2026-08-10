"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckoutProgress } from "@/components/CheckoutProgress";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { extras, findVehicle } from "@/lib/fixtures";
import { buildQuote, extraQuantityLimit, formatMoney, validateSelectedExtras } from "@/lib/rental";
import { getCheckout, getScenario, saveCheckout } from "@/lib/storage";
import type { CheckoutDraft, SelectedExtra } from "@/lib/types";

export default function ExtrasPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<CheckoutDraft | null>(null);
  const [error, setError] = useState("");
  useEffect(() => setDraft(getCheckout()), []);

  if (!draft) return <div className="content-wrap"><div className="empty-state"><h1>Start with a vehicle</h1><p>Your checkout draft is empty.</p><Link className="button button-primary" href="/search">Search cars</Link></div></div>;
  const vehicle = findVehicle(draft.vehicleId)!;
  const quote = buildQuote(draft.search, vehicle, draft.extras, getScenario());

  function setQuantity(extraId: string, quantity: number) {
    const extra = extras.find((item) => item.id === extraId)!;
    const limit = extraQuantityLimit(extraId);
    if (quantity > limit) {
      setError(limit === 0
        ? `${extra.name} is unavailable for this rental.`
        : `Only ${limit} ${extra.name}${limit === 1 ? "" : "s"} are available for this rental.`);
      return;
    }
    const selected = draft!.extras.some((item) => item.id === extraId);
    let next: SelectedExtra[] = quantity === 0
      ? draft!.extras.filter((item) => item.id !== extraId)
      : selected
        ? draft!.extras.map((item) => item.id === extraId ? { ...item, quantity } : item)
        : [...draft!.extras, { id: extraId, quantity }];
    if (extraId.startsWith("protection-") && !selected) next = next.filter((item) => !item.id.startsWith("protection-") || item.id === extraId);
    const updated = { ...draft!, extras: next };
    setDraft(updated);
    saveCheckout(updated);
    setError("");
  }

  function continueCheckout() {
    const errors = validateSelectedExtras(draft!.extras);
    if (errors.length > 0) {
      setError(errors[0]);
      return;
    }
    saveCheckout({ ...draft!, quote });
    router.push("/checkout/driver");
  }

  return (
    <div className="content-wrap">
      <CheckoutProgress current="extras" />
      <div className="checkout-grid">
        <section className="form-panel">
          <p className="eyebrow">Step 1 of 4</p><h1>Make the trip your own</h1>
          <p>Select optional protection and equipment. Prices update immediately.</p>
          {error && <p className="alert alert-error" role="alert">{error}</p>}
          <div className="extra-list">
            {extras.map((extra) => {
              const quantity = draft.extras.find((item) => item.id === extra.id)?.quantity ?? 0;
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
                  <span>{formatMoney(extra.price)}<small> / {extra.pricingModel === "per-day" ? "day" : "rental"}</small></span>
                  {unavailable ? <span className="extra-availability">Unavailable</span> : quantity > 0 ? (
                    <span className="quantity-controls">
                      <button type="button" onClick={() => setQuantity(extra.id, quantity - 1)} aria-label={`Decrease ${extra.name} quantity`}>−</button>
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
          </div>
          <div className="form-actions"><Link className="button button-secondary" href={`/vehicles/${vehicle.id}`}>Back</Link><button className="button button-primary" type="button" onClick={continueCheckout}>Driver details</button></div>
        </section>
        <PriceBreakdown quote={quote} />
      </div>
    </div>
  );
}
