import { test, expect } from "@playwright/test";

test.describe("Editor", () => {
  test("redirects to dashboard when no site param", async ({ page }) => {
    await page.goto("/editor");
    // Without a ?site= param the editor redirects to /dashboard
    await expect(page).toHaveURL(/dashboard/, { timeout: 8_000 });
  });

  test("shows collections sidebar", async ({ page }) => {
    await page.goto("/dashboard");
    // Check if there are any sites to open
    const editButtons = page.locator('[title="Editar sitio"]');
    const count = await editButtons.count();
    if (count === 0) {
      // No sites yet, skip rest of test
      return;
    }
    await editButtons.first().click();
    await expect(page).toHaveURL(/editor/);
    await expect(page.getByText("Colecciones")).toBeVisible();
  });
});
