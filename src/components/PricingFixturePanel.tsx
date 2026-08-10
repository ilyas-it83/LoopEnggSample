"use client";

import { useEffect, useState } from "react";
import {
  DRIVEWISE_FIXTURE_VERSION,
  fees,
  pricingFixtures,
  promotions,
  ratePlans,
  taxes,
  validatePricingFixtures,
} from "@/lib/fixtures";
import { getScenario } from "@/lib/storage";

type ValidationState = "idle" | "ready" | "blocked";

export function PricingFixturePanel() {
  const [state, setState] = useState<ValidationState>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const resetState = () => {
      setState("idle");
      setError("");
    };
    window.addEventListener("drivewise-storage", resetState);
    return () => window.removeEventListener("drivewise-storage", resetState);
  }, []);

  function validateFixtures() {
    if (getScenario() === "service-error") {
      setError("Pricing fixture validation is unavailable. Switch to Normal in Demo controls and retry.");
      setState("blocked");
      return;
    }
    const errors = validatePricingFixtures(pricingFixtures);
    if (errors.length > 0) {
      setError(`${errors[0]} Correct the fixture catalog and retry.`);
      setState("blocked");
      return;
    }
    setError("");
    setState("ready");
  }

  return (
    <section className="form-panel" aria-labelledby="pricing-fixture-heading" style={{ marginTop: 40 }}>
      <p className="eyebrow">Deterministic pricing</p>
      <h2 id="pricing-fixture-heading">Pricing fixture catalog</h2>
      <p>Versioned mock rate plans, fees, taxes, and promotions drive every displayed quote.</p>
      <dl className="architecture-facts" aria-label="Pricing fixture manifest">
        <div><dt>Rate plans</dt><dd>{ratePlans.length}</dd></div>
        <div><dt>Fees</dt><dd>{fees.length}</dd></div>
        <div><dt>Taxes</dt><dd>{taxes.length}</dd></div>
        <div><dt>Promotions</dt><dd>{promotions.length}</dd></div>
      </dl>
      <p><strong>Promotion fixtures:</strong> {promotions.map((promotion) => promotion.code).join(", ")}</p>
      <button className="button button-primary" type="button" onClick={validateFixtures}>
        Validate pricing fixtures
      </button>
      {state === "ready" && (
        <div className="alert alert-success" role="status" style={{ marginTop: 16 }}>
          Pricing fixtures validated for {DRIVEWISE_FIXTURE_VERSION}. No production service or real data is required.
        </div>
      )}
      {state === "blocked" && (
        <div className="alert alert-error" role="alert" style={{ marginTop: 16 }}>{error}</div>
      )}
    </section>
  );
}
