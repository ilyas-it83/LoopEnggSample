import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { fees, promotions, ratePlans, taxes } from "@/lib/fixtures";
import { resetDemo, setScenario } from "@/lib/storage";
import { PricingFixturePanel } from "./PricingFixturePanel";

describe("PricingFixturePanel", () => {
  beforeEach(() => resetDemo());
  afterEach(cleanup);

  it("shows and validates the deterministic pricing fixture manifest", async () => {
    render(<PricingFixturePanel />);

    expect(screen.getByText(String(ratePlans.length))).toBeInTheDocument();
    expect(screen.getByText(String(fees.length))).toBeInTheDocument();
    expect(screen.getByText(String(taxes.length))).toBeInTheDocument();
    expect(screen.getByText(String(promotions.length))).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Validate pricing fixtures" }));

    expect(screen.getByRole("status")).toHaveTextContent("Pricing fixtures validated");
    expect(screen.getByRole("status")).toHaveTextContent("No production service or real data is required");
  });

  it("prevents validation and provides recovery guidance during a service error", async () => {
    setScenario("service-error");
    render(<PricingFixturePanel />);

    await userEvent.click(screen.getByRole("button", { name: "Validate pricing fixtures" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Pricing fixture validation is unavailable");
    expect(screen.getByRole("alert")).toHaveTextContent("Switch to Normal in Demo controls and retry");
  });
});
