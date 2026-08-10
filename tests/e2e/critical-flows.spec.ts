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

test("no-results scenario provides recovery guidance", async ({ page }) => {
  await page.goto("/demo-controls");
  await page.getByRole("button", { name: /No search results/ }).click();
  await page.goto("/search");
  await expect(page.getByRole("heading", { name: "No vehicles match this search" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Clear filters" })).toBeVisible();
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
