"use client";

import { useState } from "react";
import Link from "next/link";
import { DRIVEWISE_FIXTURE_VERSION, MOCK_CLOCK, locations, vehicles } from "@/lib/fixtures";
import { getScenario } from "@/lib/storage";

type InitializationState = "idle" | "ready" | "blocked";

export function ArchitectureInitializer() {
  const [state, setState] = useState<InitializationState>("idle");

  function initialize() {
    if (getScenario() === "service-error") {
      setState("blocked");
      return;
    }
    setState("ready");
  }

  return (
    <section className="architecture-panel" aria-labelledby="architecture-heading">
      <div>
        <p className="eyebrow">Developer foundation</p>
        <h2 id="architecture-heading">App Router architecture is ready to extend</h2>
        <p>
          Initialize the typed Next.js shell against deterministic Drivewise fixtures before adding customer journeys.
        </p>
      </div>
      <dl className="architecture-facts" aria-label="Drivewise fixture manifest">
        <div><dt>Fixture version</dt><dd>{DRIVEWISE_FIXTURE_VERSION}</dd></div>
        <div><dt>Mock clock</dt><dd>{MOCK_CLOCK}</dd></div>
        <div><dt>Mock inventory</dt><dd>{vehicles.length} vehicles across {locations.length} locations</dd></div>
      </dl>
      <div className="architecture-actions">
        <button className="button button-primary" type="button" onClick={initialize}>
          Initialize architecture
        </button>
        <Link href="/demo-controls">Scenario controls</Link>
      </div>
      {state === "ready" && (
        <div className="alert alert-success" role="status">
          Next.js App Router architecture initialized with {DRIVEWISE_FIXTURE_VERSION}; no production service or real data is required.
        </div>
      )}
      {state === "blocked" && (
        <div className="alert alert-error" role="alert">
          Architecture initialization is unavailable while the Service error scenario is active. Switch to Normal in Demo controls and retry.
        </div>
      )}
    </section>
  );
}
