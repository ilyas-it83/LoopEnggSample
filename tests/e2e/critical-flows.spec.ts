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

test("customer modifies eligible rental date-times without duplicate submission", async ({ page }) => {
  await page.goto("/manage-booking");
  await page.getByRole("button", { name: "Find booking" }).click();
  await page.getByRole("button", { name: "Modify rental date-times" }).click();
  await page.getByLabel("Return date and time").fill("2026-08-25T09:00");
  await expect(page.getByText(/Original total:/)).toBeVisible();
  await page.getByRole("button", { name: "Confirm date-time changes" }).click();
  await expect(page.getByRole("status")).toContainText("Rental date-times updated");
  await expect(page.getByText("Aug 25, 2026, 9:00 AM")).toBeVisible();
  await expect(page.getByText("Rental date-times were updated.")).toHaveCount(1);
  await page.getByRole("button", { name: "Modify rental date-times" }).click();
  await page.getByRole("button", { name: "Confirm date-time changes" }).click();
  await expect(page.getByRole("alert")).toContainText("Choose a different pickup or return date-time");
  await expect(page.getByText("Rental date-times were updated.")).toHaveCount(1);
});

test("customer is shown an accessible validation message for invalid rental date-times", async ({ page }) => {
  await page.goto("/manage-booking");
  await page.getByRole("button", { name: "Find booking" }).click();
  await page.getByRole("button", { name: "Modify rental date-times" }).click();
  await page.getByLabel("Return date and time").fill("2026-08-20T09:00");
  await page.getByRole("button", { name: "Confirm date-time changes" }).click();
  await expect(page.getByRole("alert")).toContainText("Return must be later than pickup.");
  await expect(page.getByText("Aug 23, 2026, 9:00 AM")).toBeVisible();
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
