import { expect, test, Locator } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";

const password = process.env.E2E_PASSWORD!;

test("should show error when username is missing", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goToPage();
  await loginPage.login("", "password", "consumer");
  await expect(page.locator("text=Please fill in all fields")).toBeVisible();
});

test("should show error when password is missing", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goToPage();
  await loginPage.login("test", "", "consumer");
  await expect(page.locator("text=Please fill in all fields")).toBeVisible();
});

test("should show error with incorrect password", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goToPage();
  await loginPage.login("test", "wrongpassword", "consumer");
  await expect(page.locator("text=Incorrect password")).toBeVisible();
});

test("should redirect to /store2 after successful login", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goToPage();
  await loginPage.login("test", password, "consumer");
  await expect(page).toHaveURL(/\/store2/);
});

test("desc", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goToPage();
  await loginPage.login("test", password, "consumer");
});
