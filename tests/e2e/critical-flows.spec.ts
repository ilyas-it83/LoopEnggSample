import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/demo-controls");
  await page.getByRole("button", { name: /Reset demo data/ }).click();
});

test("customer searches and selects an available vehicle", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Search cars" }).click();
  await expect(page).toHaveURL(/\/search/);
  await expect(page.getByText(/matching vehicles/)).toBeVisible();
  await page.getByRole("link", { name: "View deal" }).first().click();
  await expect(page.getByRole("button", { name: "Choose this car" })).toBeVisible();
});

test("customer completes an approved mock booking", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Search cars" }).click();
  await page.getByRole("link", { name: "View deal" }).first().click();
  await page.getByRole("button", { name: "Choose this car" }).click();
  await page.getByRole("button", { name: "Driver details" }).click();

  await page.getByLabel("first Name").fill("Casey");
  await page.getByLabel("last Name").fill("Morgan");
  await page.getByLabel("email").fill("casey.morgan@example.test");
  await page.getByLabel("phone").fill("+1 555 010 7777");
  await page.getByLabel("Date of birth").fill("1990-01-12");
  await page.getByLabel("License number").fill("DEMO-7777");
  await page.getByLabel("Issuing country").fill("United States");
  await page.getByLabel("License expiry").fill("2030-01-12");
  await page.getByRole("button", { name: "Mock payment" }).click();

  await page.getByLabel("Cardholder name").fill("Casey Morgan");
  await page.getByRole("button", { name: "Review booking" }).click();
  await page.getByLabel(/I accept the fictional rental terms/).check();
  await page.getByRole("button", { name: "Confirm mock booking" }).click();

  await expect(page.getByRole("heading", { name: "You're ready to drive" })).toBeVisible();
  await expect(page.getByText(/DW-/)).toBeVisible();
  await expect(page.getByRole("article").getByRole("link", { name: "Manage booking" })).toBeVisible();
});

test("simulated profile prefills checkout driver details", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Search cars" }).click();
  await page.getByRole("link", { name: "View deal" }).first().click();
  await page.getByRole("button", { name: "Choose this car" }).click();
  await page.getByRole("button", { name: "Driver details" }).click();

  await page.getByRole("button", { name: "Use simulated profile" }).click();

  await expect(page.getByLabel("first Name").first()).toHaveValue("Jordan");
  await expect(page.getByLabel("last Name").first()).toHaveValue("Lee");
  await expect(page.getByLabel("email")).toHaveValue("jordan.lee@example.test");
  await expect(page.getByLabel("phone")).toHaveValue("+1 555 010 2026");
  await expect(page.getByLabel("Date of birth")).toHaveValue("1990-04-18");
  await expect(page.getByLabel("License number")).toHaveValue("DEMO-48291");
  await expect(
    page.getByRole("status").filter({ hasText: "Simulated profile details were added" }),
  ).toBeVisible();
});

test("unavailable simulated profile does not change checkout details", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Search cars" }).click();
  await page.getByRole("link", { name: "View deal" }).first().click();
  await page.getByRole("button", { name: "Choose this car" }).click();
  await page.getByRole("button", { name: "Driver details" }).click();
  await page.goto("/demo-controls");
  await page.getByRole("button", { name: /Service error/ }).click();
  await page.goto("/checkout/driver");

  await page.getByRole("button", { name: "Use simulated profile" }).click();

  await expect(
    page.getByRole("alert").filter({ hasText: "simulated profile is unavailable" }),
  ).toBeVisible();
  await expect(page.getByLabel("email")).toHaveValue("");
});

test("guest retrieves the seeded booking", async ({ page }) => {
  await page.goto("/manage-booking");
  await page.getByRole("button", { name: "Find booking" }).click();
  await expect(page.getByText("DW-260820-A1B2")).toBeVisible();
  await expect(page.getByText("Rental itinerary")).toBeVisible();
});

test("customer modifies eligible rental date-times without duplicate submission", async ({ page }) => {
  await page.goto("/manage-booking");
  await page.getByRole("button", { name: "Find booking" }).click();
  await page.getByRole("button", { name: "Modify rental date-times" }).click();
  await page.getByLabel("Return date and time").fill("2026-08-25T09:00");
  await expect(page.getByText(/Original total:/)).toBeVisible();
  await page.getByRole("button", { name: "Confirm date-time changes" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Rental date-times updated" }),
  ).toBeVisible();
  await expect(page.getByText(/Aug 25, 2026.*9:00.*AM/)).toBeVisible();
  await expect(page.getByText("Rental date-times were updated.")).toHaveCount(1);
  await page.getByRole("button", { name: "Modify rental date-times" }).click();
  await page.getByRole("button", { name: "Confirm date-time changes" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Choose a different pickup or return date-time" }),
  ).toBeVisible();
  await expect(page.getByText("Rental date-times were updated.")).toHaveCount(1);
});

test("customer is shown an accessible validation message for invalid rental date-times", async ({ page }) => {
  await page.goto("/manage-booking");
  await page.getByRole("button", { name: "Find booking" }).click();
  await page.getByRole("button", { name: "Modify rental date-times" }).click();
  await page.getByLabel("Return date and time").fill("2026-08-20T09:00");
  await page.getByRole("button", { name: "Confirm date-time changes" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Return must be later than pickup." }),
  ).toBeVisible();
  await expect(page.getByText(/Aug 23, 2026.*9:00.*AM/)).toBeVisible();
});

test("date-time modification rechecks vehicle availability", async ({ page }) => {
  await page.goto("/demo-controls");
  await page.getByRole("button", { name: /Vehicle unavailable/ }).click();
  await page.goto("/manage-booking");
  await page.getByRole("button", { name: "Find booking" }).click();
  await page.getByRole("button", { name: "Modify rental date-times" }).click();
  await page.getByLabel("Return date and time").fill("2026-08-25T09:00");
  await page.getByRole("button", { name: "Confirm date-time changes" }).click();

  await expect(
    page.getByRole("alert").filter({ hasText: "became unavailable" }),
  ).toBeVisible();
  await expect(page.getByText(/Aug 23, 2026.*9:00.*AM/)).toBeVisible();
});

test("customer cancels a confirmed booking", async ({ page }) => {
  await page.goto("/manage-booking");
  await page.getByRole("button", { name: "Find booking" }).click();
  page.on("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Cancel booking" }).click();
  await expect(page.getByRole("status")).toContainText("Booking cancelled");
  await expect(page.getByRole("button", { name: "Cancel booking" })).toBeDisabled();
});

test("no-results scenario provides recovery guidance", async ({ page }) => {
  await page.goto("/demo-controls");
  await page.getByRole("button", { name: /No search results/ }).click();
  await page.goto("/search");
  await expect(page.getByRole("heading", { name: "No vehicles match this search" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Clear filters" })).toBeVisible();
});

test("customer compares selected vehicles and direct links require valid rental criteria", async ({ page }) => {
  await page.goto("/search");
  await page.getByRole("button", { name: "Add to comparison" }).nth(0).click();
  await page.getByRole("button", { name: "Add to comparison" }).nth(1).click();
  await page.getByRole("link", { name: "Compare selected vehicles" }).click();
  await expect(page.getByRole("heading", { name: "Vehicle comparison" })).toBeVisible();
  await expect(page.getByRole("table", { name: "Vehicle comparison matrix" })).toBeVisible();
  await expect(page.getByText("Lowest estimate", { exact: true })).toBeVisible();

  await page.goto("/vehicles/compact-1");
  await expect(page.getByRole("heading", { name: "Start a rental search" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Enter rental details" })).toBeVisible();
});

test("customer modifies the vehicle on an eligible booking", async ({ page }) => {
  await page.goto("/manage-booking");
  await page.getByRole("button", { name: "Find booking" }).click();
  await page.getByRole("button", { name: "Modify vehicle" }).click();

  const vehicleGroup = page.getByRole("group", { name: "Available vehicles" });
  const alternative = vehicleGroup.locator(
    'input[name="vehicle-selection"]:not(:checked):not([disabled])',
  ).first();
  const alternativeLabel = alternative.locator("xpath=ancestor::label");
  const alternativeName = await alternativeLabel.locator("strong").innerText();
  await alternative.check();
  await page.getByRole("button", { name: "Save vehicle change" }).click();

  await expect(
    page.getByRole("status").filter({ hasText: `Vehicle updated to ${alternativeName}` }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: alternativeName })).toBeVisible();
});

test("vehicle modification blocks no-op and unavailable selections", async ({ page }) => {
  await page.goto("/manage-booking");
  await page.getByRole("button", { name: "Find booking" }).click();
  await page.getByRole("button", { name: "Modify vehicle" }).click();
  await expect(page.getByRole("button", { name: "Save vehicle change" })).toBeDisabled();

  await page.goto("/demo-controls");
  await page.getByRole("button", { name: /Vehicle unavailable/ }).click();
  await page.goto("/manage-booking");
  await page.getByRole("button", { name: "Find booking" }).click();
  await page.getByRole("button", { name: "Modify vehicle" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Vehicle changes are unavailable" }),
  ).toBeVisible();
  await expect(
    page.getByRole("group", { name: "Available vehicles" })
      .locator('input[name="vehicle-selection"]')
      .nth(1),
  ).toBeDisabled();
});

test("comparison selection is limited and favorites persist after a refresh", async ({ page }) => {
  await page.goto("/search");
  const comparisonButtons = page.getByRole("button", { name: "Add to comparison" });
  await comparisonButtons.nth(0).click();
  await comparisonButtons.nth(1).click();
  await comparisonButtons.nth(2).click();
  await comparisonButtons.nth(3).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "up to three vehicles" }),
  ).toBeVisible();

  await page.getByRole("button", { name: /Add .* to favorites/ }).first().click();
  await page.goto("/favorites");
  await page.reload();
  await expect(page.getByRole("heading", { name: "Your favorites" })).toBeVisible();
  await expect(page.getByRole("article")).toBeVisible();
});

test("customer filters results by an accessibility-related feature", async ({ page }) => {
  await page.goto("/search");
  await page.getByLabel("Wheelchair-accessible entry").check();

  await expect(
    page.getByRole("status").filter({ hasText: "matching vehicles" }),
  ).toBeVisible();
  await expect(page.getByText("Toyota Sienna")).toBeVisible();
  await expect(page.getByText("Toyota RAV4")).toBeVisible();
  await expect(page.getByText("Toyota Corolla")).not.toBeVisible();

  await page.getByLabel("Hand controls").check();
  await expect(page.getByRole("heading", { name: "No vehicles match this search" })).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByText("Toyota Sienna")).toBeVisible();
});

test("customer filters vehicles by estimated price range", async ({ page }) => {
  await page.goto("/search");
  await page.getByLabel("Maximum", { exact: true }).fill("200");
  await page.getByRole("button", { name: "Apply price range" }).click();

  await expect(page.getByText("2 matching vehicles")).toBeVisible();
});

test("customer receives recovery guidance for an invalid estimated price range", async ({ page }) => {
  await page.goto("/search");
  const count = page.getByText(/matching vehicles/);
  const baseline = await count.textContent();
  expect(baseline).toBeTruthy();

  await page.getByLabel("Minimum", { exact: true }).fill("200");
  await page.getByLabel("Maximum", { exact: true }).fill("100");
  await page.getByRole("button", { name: "Apply price range" }).click();

  await expect(
    page.getByRole("alert").filter({ hasText: "Minimum estimated price cannot be greater than maximum estimated price." }),
  ).toBeVisible();
  await expect(count).toHaveText(baseline!);
});

test("customer filters available vehicles by transmission type", async ({ page }) => {
  await page.goto("/search");
  await page.getByRole("checkbox", { name: "Manual" }).check();

  await expect(page.getByText(/matching vehicles/)).toBeVisible();
  const cards = page.locator(".vehicle-card");
  await expect(cards).toHaveCount(2);
  for (const card of await cards.all()) {
    await expect(card).toContainText("Manual");
    await expect(card).not.toContainText("Automatic");
  }
});

test("unavailable transmission filter combination offers recovery", async ({ page }) => {
  await page.goto("/search");
  await page.getByRole("checkbox", { name: "Luxury" }).check();
  await page.getByRole("checkbox", { name: "Manual" }).check();

  await expect(page.getByRole("heading", { name: "No vehicles match this search" })).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByText(/matching vehicles/)).toBeVisible();
});

test("customer filters results by passenger capacity", async ({ page }) => {
  await page.goto("/search");
  await page.getByLabel("Minimum passenger capacity").selectOption("5");
  await expect(page.getByText("20 matching vehicles")).toBeVisible();
  await page.getByLabel("Minimum passenger capacity").selectOption("7");
  await expect(page.getByText("2 matching vehicles")).toBeVisible();
  await expect(page.getByRole("article")).toContainText(["7 seats", "7 seats"]);
});

test("service errors prevent unavailable vehicle results", async ({ page }) => {
  await page.goto("/demo-controls");
  await page.getByRole("button", { name: /Service error/ }).click();
  await page.goto("/search");
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Vehicle results are unavailable" })).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(0);
});
