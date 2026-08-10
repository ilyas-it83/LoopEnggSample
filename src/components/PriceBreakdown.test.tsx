import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { findVehicle } from "@/lib/fixtures";
import { buildQuote, defaultSearch } from "@/lib/rental";
import { PriceBreakdown } from "./PriceBreakdown";

describe("PriceBreakdown", () => {
  it("shows every line and the estimated total", () => {
    const quote = buildQuote(defaultSearch, findVehicle("compact-1")!);
    render(<PriceBreakdown quote={quote} />);
    expect(screen.getByRole("heading", { name: "Price breakdown" })).toBeInTheDocument();
    expect(screen.getByText(/Compact rental/)).toBeInTheDocument();
    expect(screen.getByText("Estimated taxes")).toBeInTheDocument();
    expect(screen.getByText("Estimated total")).toBeInTheDocument();
  });
});

