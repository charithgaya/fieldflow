import { test, expect } from "@playwright/test";

test("technician can sign in and reach technician dashboard", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("Email").fill("tech02@fieldflow.test");
    await page.locator("#password").fill("technician123");

    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page).toHaveURL(/\/technician/, {
        timeout: 15000,
    });

    await expect(
        page.locator("h1").filter({ hasText: "Technician Dashboard" })
    ).toBeVisible();
});