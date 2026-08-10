import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DRIVEWISE_FIXTURE_VERSION, MOCK_CLOCK, locations, vehicles } from "@/lib/fixtures";
import { resetDemo, setScenario } from "@/lib/storage";
import { ArchitectureInitializer } from "./ArchitectureInitializer";

describe("ArchitectureInitializer", () => {
  beforeEach(() => {
    resetDemo();
  });

  afterEach(() => {
    cleanup();
  });

  it("initializes the App Router architecture with deterministic fixture metadata", async () => {
    render(<ArchitectureInitializer />);

    expect(screen.getByText(DRIVEWISE_FIXTURE_VERSION)).toBeInTheDocument();
    expect(screen.getByText(MOCK_CLOCK)).toBeInTheDocument();
    expect(screen.getByText(`${vehicles.length} vehicles across ${locations.length} locations`)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Initialize architecture" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      `Next.js App Router architecture initialized with ${DRIVEWISE_FIXTURE_VERSION}`,
    );
    expect(screen.getByRole("status")).toHaveTextContent("no production service or real data is required");
  });

  it("prevents initialization and gives recovery guidance when the active scenario is unavailable", async () => {
    setScenario("service-error");
    render(<ArchitectureInitializer />);

    await userEvent.click(screen.getByRole("button", { name: "Initialize architecture" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Architecture initialization is unavailable");
    expect(screen.getByRole("alert")).toHaveTextContent("Switch to Normal in Demo controls and retry");

    resetDemo();

    await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
  });
});
