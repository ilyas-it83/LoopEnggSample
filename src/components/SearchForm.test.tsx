import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defaultSearch } from "@/lib/rental";
import { SearchForm } from "./SearchForm";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

describe("SearchForm [BDD-02, BDD-03]", () => {
  beforeEach(() => push.mockClear());
  afterEach(cleanup);

  it("submits the labeled default fixture form with the keyboard", async () => {
    const user = userEvent.setup();
    render(<SearchForm />);

    const controls = [
      screen.getByLabelText("Pickup location"),
      screen.getByLabelText("Return location"),
      screen.getByLabelText("Pickup date & time"),
      screen.getByLabelText("Return date & time"),
      screen.getByLabelText("Driver age"),
      screen.getByRole("button", { name: "Search cars" }),
    ];

    for (const control of controls) {
      await user.tab();
      expect(control).toHaveFocus();
    }
    await user.keyboard("{Enter}");

    expect(push).toHaveBeenCalledWith(
      `/search?${new URLSearchParams({
        pickupLocationId: defaultSearch.pickupLocationId,
        returnLocationId: defaultSearch.returnLocationId,
        pickupAt: defaultSearch.pickupAt,
        returnAt: defaultSearch.returnAt,
        driverAge: String(defaultSearch.driverAge),
      })}`,
    );
  });

  it("prevents an invalid transition and announces how to recover", async () => {
    const user = userEvent.setup();
    render(<SearchForm initial={{ ...defaultSearch, returnAt: defaultSearch.pickupAt }} />);

    await user.click(screen.getByRole("button", { name: "Search cars" }));

    expect(push).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("Check your search");
    expect(screen.getByRole("alert")).toHaveTextContent("Return must be later than pickup.");
  });
});
