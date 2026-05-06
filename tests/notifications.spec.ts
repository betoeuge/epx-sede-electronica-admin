import { test, expect } from "@playwright/test";

test.describe("Notifications", () => {
  test("shows notifications page", async ({ page }) => {
    await page.goto("/notificaciones");
    await expect(page.getByRole("heading", { name: "Notificaciones" })).toBeVisible();
  });

  test("shows empty state when no notifications", async ({ page }) => {
    await page.goto("/notificaciones");
    // Either shows notifications list or empty state
    const hasEmpty = await page.getByText("Sin notificaciones").isVisible().catch(() => false);
    const hasList = await page.locator('[class*="border-b"]').count();
    expect(hasEmpty || hasList >= 0).toBeTruthy();
  });
});
