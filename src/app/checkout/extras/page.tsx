"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckoutProgress } from "@/components/CheckoutProgress";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { extras, findVehicle } from "@/lib/fixtures";
import { buildQuote, formatMoney } from "@/lib/rental";
import { getCheckout, getScenario, saveCheckout } from "@/lib/storage";
import type { CheckoutDraft, SelectedExtra } from "@/lib/types";

export default function ExtrasPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<CheckoutDraft | null>(null);
  useEffect(() => setDraft(getCheckout()), []);

  if (!draft) return <div className="content-wrap"><div className="empty-state"><h1>Start with a vehicle</h1><p>Your checkout draft is empty.</p><Link className="button button-primary" href="/search">Search cars</Link></div></div>;
  const vehicle = findVehicle(draft.vehicleId)!;
  const quote = buildQuote(draft.search, vehicle, draft.extras, getScenario());

  function toggle(extraId: string) {
    const selected = draft!.extras.some((item) => item.id === extraId);
    let next: SelectedExtra[] = selected ? draft!.extras.filter((item) => item.id !== extraId) : [...draft!.extras, { id: extraId, quantity: 1 }];
    if (extraId.startsWith("protection-") && !selected) next = next.filter((item) => !item.id.startsWith("protection-") || item.id === extraId);
    const updated = { ...draft!, extras: next };
    setDraft(updated);
    saveCheckout(updated);
  }

  function continueCheckout() {
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
          <div className="extra-list">
            {extras.map((extra) => (
              <label className="extra-option" key={extra.id}>
                <input type="checkbox" checked={draft.extras.some((item) => item.id === extra.id)} onChange={() => toggle(extra.id)} />
                <span><strong>{extra.name}</strong><p>{extra.description}</p></span>
                <span>{formatMoney(extra.price)}<small> / {extra.pricingModel === "per-day" ? "day" : "rental"}</small></span>
              </label>
            ))}
          </div>
          <div className="form-actions"><Link className="button button-secondary" href={`/vehicles/${vehicle.id}`}>Back</Link><button className="button button-primary" type="button" onClick={continueCheckout}>Driver details</button></div>
        </section>
        <PriceBreakdown quote={quote} />
      </div>
    </div>
  );
}

