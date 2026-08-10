"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckoutProgress } from "@/components/CheckoutProgress";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { getCheckout, getScenario, saveCheckout } from "@/lib/storage";
import type { CheckoutDraft } from "@/lib/types";

export default function PaymentPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<CheckoutDraft | null>(null);
  const [cardholder, setCardholder] = useState("");
  const [cardNumber, setCardNumber] = useState("4242424242424242");
  const [expiry, setExpiry] = useState("12/30");
  const [securityCode, setSecurityCode] = useState("123");
  const [postalCode, setPostalCode] = useState("10001");
  const [error, setError] = useState("");
  useEffect(() => setDraft(getCheckout()), []);

  if (!draft?.quote || !draft.renter || !draft.driver) return <div className="content-wrap"><div className="empty-state"><h1>Driver details are missing</h1><Link className="button button-primary" href="/checkout/driver">Enter driver details</Link></div></div>;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const digits = cardNumber.replace(/\D/g, "");
    if (!cardholder || digits.length < 15 || !expiry || securityCode.length < 3 || !postalCode) { setError("Complete all mock payment fields."); return; }
    if (digits === "4000000000000002" || getScenario() === "payment-decline") { setError("Mock payment declined. Use test card 4242 4242 4242 4242 or change the demo scenario."); return; }
    if (digits === "5000000000000009") { setError("A mock processing error occurred. No booking was created; retry with the approved test card."); return; }
    saveCheckout({ ...draft!, payment: { brand: digits.startsWith("4") ? "Visa" : "Demo card", last4: digits.slice(-4) } });
    router.push("/checkout/review");
  }

  return (
    <div className="content-wrap">
      <CheckoutProgress current="payment" />
      <div className="checkout-grid">
        <form className="form-panel" onSubmit={submit}>
          <p className="eyebrow">Step 3 of 4</p><h1>Mock payment</h1>
          <div className="alert alert-info">Approved: 4242 4242 4242 4242 · Declined: 4000 0000 0000 0002 · Error: 5000 0000 0000 0009. Never enter a real card.</div>
          {error && <div className="alert alert-error" role="alert" style={{ marginTop: 14 }}>{error}</div>}
          <div className="form-grid" style={{ marginTop: 24 }}>
            <div className="field span-2"><label htmlFor="cardholder">Cardholder name</label><input id="cardholder" autoComplete="off" value={cardholder} onChange={(event) => setCardholder(event.target.value)} /></div>
            <div className="field span-2"><label htmlFor="card-number">Test card number</label><input id="card-number" inputMode="numeric" autoComplete="off" value={cardNumber} onChange={(event) => setCardNumber(event.target.value)} /></div>
            <div className="field"><label htmlFor="expiry">Expiry</label><input id="expiry" autoComplete="off" value={expiry} onChange={(event) => setExpiry(event.target.value)} /></div>
            <div className="field"><label htmlFor="security-code">Security code</label><input id="security-code" type="password" autoComplete="off" value={securityCode} onChange={(event) => setSecurityCode(event.target.value)} /></div>
            <div className="field"><label htmlFor="postal-code">Postal code</label><input id="postal-code" autoComplete="off" value={postalCode} onChange={(event) => setPostalCode(event.target.value)} /></div>
          </div>
          <div className="form-actions"><Link className="button button-secondary" href="/checkout/driver">Back</Link><button className="button button-primary" type="submit">Review booking</button></div>
        </form>
        <PriceBreakdown quote={draft.quote} />
      </div>
    </div>
  );
}
