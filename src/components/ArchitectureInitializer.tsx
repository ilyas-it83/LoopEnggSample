"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { locations, vehicles } from "@/lib/fixtures";
import {
  demoApplicationConfig,
  type DemoApplicationConfig,
  validateDemoApplicationConfig,
} from "@/lib/demo-config";
import { getScenario } from "@/lib/storage";

type InitializationState = "idle" | "ready" | "blocked";

interface ArchitectureInitializerProps {
  config?: DemoApplicationConfig;
}

export function ArchitectureInitializer({
  config = demoApplicationConfig,
}: ArchitectureInitializerProps) {
  const [state, setState] = useState<InitializationState>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const resetState = () => {
      setState("idle");
      setError("");
    };
    window.addEventListener("drivewise-storage", resetState);
    return () => window.removeEventListener("drivewise-storage", resetState);
  }, []);

  function initialize() {
    if (getScenario() === "service-error") {
      setError("Architecture initialization is unavailable while the Service error scenario is active. Switch to Normal in Demo controls and retry.");
      setState("blocked");
      return;
    }
    const errors = validateDemoApplicationConfig(config);
    if (errors.length > 0) {
      setError(`${errors[0]} Correct the demo configuration and retry.`);
      setState("blocked");
      return;
    }
    setError("");
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
        <div><dt>Fixture version</dt><dd>{config.fixtureVersion}</dd></div>
        <div><dt>Mock clock</dt><dd>{config.mockClock}</dd></div>
        <div><dt>Mock inventory</dt><dd>{vehicles.length} vehicles across {locations.length} locations</dd></div>
        <div><dt>Data source</dt><dd>{config.dataSource}</dd></div>
        <div><dt>State store</dt><dd>{config.stateStore}</dd></div>
        <div><dt>Service mode</dt><dd>{config.serviceMode}</dd></div>
        <div><dt>Demo controls</dt><dd>{config.demoControlsEnabled ? "Enabled" : "Disabled"}</dd></div>
      </dl>
      <div className="architecture-actions">
        <button className="button button-primary" type="button" onClick={initialize}>
          Initialize architecture
        </button>
        <Link href="/demo-controls">Scenario controls</Link>
      </div>
      {state === "ready" && (
        <div className="alert alert-success" role="status">
          Next.js App Router architecture initialized with {config.fixtureVersion}; no production service or real data is required.
        </div>
      )}
      {state === "blocked" && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}
    </section>
  );
}
