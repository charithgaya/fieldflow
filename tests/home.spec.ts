import { test, expect } from "@playwright/test";

test("FieldFlow home page loads", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/FieldFlow/i);
});