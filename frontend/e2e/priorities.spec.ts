import { test, expect } from "@playwright/test";

test("priority is acknowledged and persists after refresh", async ({ page }) => {
  // 1. Ouvre le dashboard
  await page.goto("/dashboard");

  // 2. Une priorité est visible
  const priority = page.locator("[data-testid='priority-item']").first();
  await expect(priority).toBeVisible();

  // 3. Clic ✓ Traité
  await priority.locator("[data-testid='priority-ack']").click();

  // 4. Disparition immédiate (optimistic UI)
  await expect(priority).toBeHidden();

  // 5. Refresh page
  await page.reload();

  // 6. Toujours absente (persistée en DB)
  await expect(
    page.locator("[data-testid='priority-item']")
  ).toHaveCount(0);

  // 7. État explicite "aucune priorité"
  await expect(
    page.getByText("Aucune priorité active")
  ).toBeVisible();
});
