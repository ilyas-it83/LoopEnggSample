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

test("customer modifies the vehicle on an eligible booking", async ({ page }) => {
  await page.goto("/manage-booking");
  await page.getByRole("button", { name: "Find booking" }).click();
  await expect(page.getByText("Rental itinerary")).toBeVisible();

  await page.getByRole("button", { name: "Modify vehicle" }).click();
  const alternative = page.locator("label.extra-option").filter({ hasNot: page.getByRole("radio", { checked: true }) }).first();
  const alternativeName = await alternative.locator("strong").innerText();
  await alternative.getByRole("radio").check();
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page.getByRole("status")).toContainText(`Vehicle updated to ${alternativeName}`);
  await expect(page.getByRole("heading", { name: alternativeName })).toBeVisible();
});

test("vehicle modification is blocked when the vehicle-unavailable scenario is active", async ({ page }) => {
  await page.goto("/demo-controls");
  await page.getByRole("button", { name: /Vehicle unavailable/ }).click();

  await page.goto("/manage-booking");
  await page.getByRole("button", { name: "Find booking" }).click();
  await page.getByRole("button", { name: "Modify vehicle" }).click();
  await expect(page.locator(".alert-error").first()).toContainText(/unavailable/i);

  const alternative = page.locator("label.extra-option").filter({ hasNot: page.getByRole("radio", { checked: true }) }).first();
  await expect(alternative.getByRole("radio")).toBeDisabled();
});
