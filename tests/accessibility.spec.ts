import { test, expect, Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function scanAccessibility(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(results.violations).not.toEqual([]);
}

test.describe("Accessibility checks", () => {
  test("login page", async ({ page }) => {
    await page.goto("/login");
    await scanAccessibility(page);
  });

  test("store page", async ({ page }) => {
    await page.goto("/store2");
    await scanAccessibility(page);
  });
});
