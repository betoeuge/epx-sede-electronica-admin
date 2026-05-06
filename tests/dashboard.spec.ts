import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test("shows projects page with header", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { name: "Proyectos" })).toBeVisible();
  });

  test("can open create site modal", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("button", { name: /Nuevo Proyecto/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText(/nombre/i).first()).toBeVisible();
  });

  test("can open create group modal", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("button", { name: /Crear Grupo/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("navigates to archivados", async ({ page }) => {
    await page.goto("/archivados");
    await expect(page.getByRole("heading", { name: "Archivados" })).toBeVisible();
  });

  test("navigates to draft", async ({ page }) => {
    await page.goto("/draft");
    await expect(page.getByRole("heading", { name: "Borradores" })).toBeVisible();
  });

  test("navigates to templates", async ({ page }) => {
    await page.goto("/templates");
    await expect(page.getByText("Da vida a tu visión")).toBeVisible();
  });
});
