import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { findVehicle } from "@/lib/fixtures";
import { buildQuote, defaultSearch } from "@/lib/rental";
import { getFavorites, toggleComparison } from "@/lib/storage";
import { VehicleCard } from "./VehicleCard";

const vehicle = findVehicle("compact-1")!;

function renderVehicleCard() {
  render(
    <VehicleCard
      vehicle={vehicle}
      search={defaultSearch}
      total={buildQuote(defaultSearch, vehicle).total}
    />,
  );
}

describe("VehicleCard accessible interactions [BDD-02, BDD-03]", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(cleanup);

  it("toggles the clearly named favorite control with the keyboard", async () => {
    const user = userEvent.setup();
    renderVehicleCard();

    const favorite = screen.getByRole("button", { name: "Add Toyota Corolla to favorites" });
    favorite.focus();
    await user.keyboard("{Enter}");

    expect(getFavorites()).toEqual([vehicle.id]);
    expect(favorite).toHaveAccessibleName("Remove Toyota Corolla from favorites");
  });

  it("announces the comparison limit and recovers after a vehicle is removed", async () => {
    const user = userEvent.setup();
    ["economy-1", "midsize-1", "suv-1"].forEach(toggleComparison);
    renderVehicleCard();

    const compare = screen.getByRole("button", { name: "Add to comparison" });
    await user.click(compare);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "You can compare up to three vehicles. Remove a vehicle before adding another.",
    );

    toggleComparison("economy-1");
    await user.click(compare);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(compare).toHaveAccessibleName("Remove from comparison");
  });
});
