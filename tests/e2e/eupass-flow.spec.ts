import { test, expect } from "@playwright/test";

test.describe("EUPass End-to-End Scan Flow", () => {
  test("scan product -> verify cards -> test checklist persistence -> trigger PDF export", async ({
    page,
  }) => {
    // 1. Visit homepage
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Can I Sell or Ship This Product");

    // Accept consent if banner appears
    const acceptBtn = page.getByRole("button", { name: "Accept All" });
    if (await acceptBtn.isVisible()) {
      await acceptBtn.click();
    }

    // 2. Submit a physical item
    const textarea = page.locator('[data-testid="scanner-description-input"]');
    await textarea.fill("100% cotton crewneck t-shirt with screen printed graphic logo");
    await page.locator('[data-testid="scanner-submit-btn"]').click();

    // 3. Verify results view rendered
    const resultView = page.locator('[data-testid="eupass-result-view"]');
    await expect(resultView).toBeVisible({ timeout: 15000 });

    // Verify Customs card and Safety card are visible
    await expect(page.locator('[data-testid="pillar-customs-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="pillar-product-safety-card"]')).toBeVisible();
    // Verify AI Act card is NOT rendered for cotton t-shirt
    await expect(page.locator('[data-testid="pillar-ai-act-card"]')).toHaveCount(0);

    // Verify copy commercial invoice button works
    await expect(page.locator('[data-testid="copy-invoice-btn"]')).toBeVisible();

    // 4. Test interactive checklist persistence in localStorage
    const firstCheckbox = page.locator('[data-testid="interactive-checklist-section"] input[type="checkbox"]').first();
    await firstCheckbox.check();
    await expect(firstCheckbox).toBeChecked();

    // Reload page to verify persistence
    await page.reload();
    await expect(page.locator('[data-testid="eupass-result-view"]')).toBeVisible();
    const reloadedCheckbox = page.locator('[data-testid="interactive-checklist-section"] input[type="checkbox"]').first();
    await expect(reloadedCheckbox).toBeChecked();

    // 5. Trigger PDF export
    const downloadPromise = page.waitForEvent("download");
    await page.locator('[data-testid="download-pdf-btn"]').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain("EUPass-Compliance-Report");
  });
});
