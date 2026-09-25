import { test, expect } from "@playwright/test";

test.setTimeout(60000); // Set a timeout of 60 seconds for the entire test

test("dispatcher can create and assign a work order", async ({ page }) => {
    const title = `Playwright Test Work Order ${Date.now()}`;

    // --------------------------------------------------
    // 1. Dispatcher login
    // --------------------------------------------------

    await page.goto("/login");

    await page.getByLabel("Email").fill("dispatch@fieldflow.test");
    await page.locator("#password").fill("Dispatch@12345");

    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page).toHaveURL(/\/dashboard|\/dispatcher/, {
        timeout: 15000,
    });

    if (page.url().endsWith("/dashboard")) {
        await page.goto("/dispatcher");
    }

    await expect(page).toHaveURL(/\/dispatcher/, {
        timeout: 15000,
    });

    // --------------------------------------------------
    // 2. Create Work Order
    // --------------------------------------------------

    await page.goto("/work-orders/new");

    await expect(
        page.locator("h1").filter({ hasText: "Create Work Order" })
    ).toBeVisible();

    await page.locator("#title").fill(title);

    await page
        .locator("#description")
        .fill("Work order created by the Playwright E2E test.");

    await page.locator("#customerId").selectOption({
        label: "Saman Kumara",
    });

    await page.locator("#priority").selectOption("HIGH");

    await page.locator("#scheduledDate").fill("2026-09-25T10:00");

    await page
        .getByRole("button", { name: "Create Work Order" })
        .click();

    // --------------------------------------------------
    // 3. Verify creation
    // --------------------------------------------------

    await expect(page).toHaveURL(/\/work-orders$/, {
        timeout: 15000,
    });

    const workOrderLink = page.getByRole("link", { name: title });

    await expect(workOrderLink).toBeVisible();

    // --------------------------------------------------
    // 4. Open the exact Work Order
    // --------------------------------------------------

    await workOrderLink.click();

    await expect(page).toHaveURL(/\/work-orders\/.+/, {
        timeout: 15000,
    });

    await expect(
        page.locator("h1").filter({ hasText: title })
    ).toBeVisible();

    // --------------------------------------------------
    // 5. Assign an available technician
    // --------------------------------------------------

    const technicianSelect = page.locator("#technicianId");

    await expect(technicianSelect).toBeVisible();

    const technicianOption = technicianSelect
        .locator("option")
        .filter({ hasText: "Technician Two" })
        .first();

    await expect(technicianOption).toBeAttached();

    const technicianId = await technicianOption.getAttribute("value");

    expect(technicianId).toBeTruthy();

    await technicianSelect.selectOption(technicianId!);

    await page.getByRole("button", { name: "Assign Technician" }).click();

    // --------------------------------------------------
    // 6. Verify assignment
    // --------------------------------------------------

    await expect(page).toHaveURL(/\/work-orders\/.+/, {
        timeout: 15000,
    });

    await expect(
        page.locator("#technicianId")
    ).toHaveValue(technicianId!, {
        timeout: 10000,
    });

    await expect(technicianSelect).toHaveValue(technicianId!);

    // --------------------------------------------------
    // 7. Dispatcher logout
    // --------------------------------------------------

    await page.goto("/dispatcher");

    await expect(page).toHaveURL(/\/dispatcher/, {
        timeout: 10000,
    });

    await page.getByRole("button", { name: /Logout/i }).click();

    await expect(page).toHaveURL(/\/login/, {
        timeout: 10000,
    });

    // --------------------------------------------------
    // 8. Technician login
    // --------------------------------------------------

    await page.getByLabel("Email").fill("tech02@fieldflow.test");
    await page.locator("#password").fill("technician123");

    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page).toHaveURL(/\/technician/, {
        timeout: 15000,
    });

    // --------------------------------------------------
    // 9. Technician My Jobs
    // --------------------------------------------------

    await page.goto("/my-jobs");

    await expect(page).toHaveURL(/\/my-jobs/, {
        timeout: 10000,
    });

    await expect(
        page.getByRole("link", { name: title })
    ).toBeVisible({
        timeout: 10000,
    });

    await page.getByRole("link", { name: title }).click();

    await expect(page).toHaveURL(/\/work-orders\/.+/, {
        timeout: 10000,
    });

    await expect(
        page.locator("h1").filter({ hasText: title })
    ).toBeVisible();

    await expect(
        page.getByRole("button", { name: "Start Work" })
    ).toBeVisible();

    await page.getByRole("button", { name: "Start Work" }).click();

    await expect(page).toHaveURL(/\/work-orders\/.+/, {
        timeout: 15000,
    });

    await expect(
        page.getByText("In Progress", { exact: true })
    ).toBeVisible({
        timeout: 10000,
    });

    const progressNote = `Playwright progress note ${Date.now()}`;

    await page.locator("#note").fill(progressNote);

    await page.getByRole("button", {
        name: "Add Progress Note",
    }).click();

    await expect(
        page.getByText("Progress note added successfully.", {
            exact: true,
        })
    ).toBeVisible({
        timeout: 10000,
    });

    const completionNotes =`Playwright completion note ${Date.now()}`;

    await page.locator("#completionNotes").fill(completionNotes);

    await page.getByRole("button", {
        name: "Complete Job",
    }).click();

    await expect(
        page.getByText("Work order completed successfully.", {
            exact: true,
        })
    ).toBeVisible({
        timeout: 10000,
    });

});