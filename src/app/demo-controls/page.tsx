"use client";

import { useEffect, useState } from "react";
import { MOCK_CLOCK } from "@/lib/fixtures";
import { getScenario, resetDemo, setScenario } from "@/lib/storage";
import type { DemoScenario } from "@/lib/types";

const scenarios: Array<{ id: DemoScenario; name: string; description: string }> = [
  { id: "normal", name: "Normal", description: "Available vehicles, stable prices, and approved test payments." },
  { id: "slow", name: "Slow response", description: "Reserved for demonstrating route-level loading behavior." },
  { id: "no-results", name: "No search results", description: "Vehicle searches return a designed empty state." },
  { id: "vehicle-unavailable", name: "Vehicle unavailable", description: "Selection becomes unavailable before checkout confirmation." },
  { id: "price-change", name: "Price change", description: "Rates increase at final review and require explicit acceptance." },
  { id: "payment-decline", name: "Payment decline", description: "Every mock card authorization is declined." },
  { id: "service-error", name: "Service error", description: "Search and booking services show recoverable failures." },
];

export default function DemoControlsPage() {
  const [active, setActive] = useState<DemoScenario>("normal");
  const [message, setMessage] = useState("");
  useEffect(() => setActive(getScenario()), []);

  function choose(id: DemoScenario) {
    setScenario(id);
    setActive(id);
    setMessage(`${scenarios.find((scenario) => scenario.id === id)?.name} scenario enabled.`);
  }

  function reset() {
    resetDemo();
    setActive("normal");
    setMessage("Local demo state reset. Default booking and fixtures will be restored when next requested.");
  }

  return (
    <>
      <section className="page-hero"><p className="eyebrow">Developer and presenter tools</p><h1>Demo controls</h1><p>Switch deterministic outcomes without changing source data or connecting to an external service.</p></section>
      <div className="content-wrap">
        {message && <div className="alert alert-success" role="status" style={{ marginBottom: 20 }}>{message}</div>}
        <div className="form-panel">
          <h2>Active mock clock</h2><p><strong>{MOCK_CLOCK}</strong> local fixture time. Automated tests inject and control time independently.</p>
          <h2>Behavior scenario</h2>
          <div className="scenario-grid">
            {scenarios.map((scenario) => <button className={`scenario-card ${active === scenario.id ? "active" : ""}`} type="button" key={scenario.id} onClick={() => choose(scenario.id)}><strong>{scenario.name}</strong><span>{scenario.description}</span></button>)}
          </div>
          <div className="form-actions"><span className="fine-print">Reset clears bookings, checkout, favorites, and scenario state from this browser.</span><button className="button button-danger" type="button" onClick={reset}>Reset demo data</button></div>
        </div>
      </div>
    </>
  );
}

