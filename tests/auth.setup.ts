import { test as setup, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const AUTH_FILE = path.join(__dirname, ".auth/admin.json");

setup("authenticate as admin", async ({ page, context }) => {
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  // Clear any previously saved cookies so the middleware doesn't redirect away from /login
  await context.clearCookies();
  await page.goto("/login");
  // The email field sends value as "userName" to backend; use "admin" credentials
  await page.getByPlaceholder("Ingresa tu usuario").fill("admin");
  await page.getByPlaceholder("••••••••").fill("Admin123!");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/dashboard/, { timeout: 10_000 });
  await page.context().storageState({ path: AUTH_FILE });
});
