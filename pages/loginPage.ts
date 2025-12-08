import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly roleSelect: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.username = page.getByRole("textbox", { name: "Username" });
    this.password = page.getByRole("textbox", { name: "Password" });
    this.roleSelect = page.getByLabel("Select Role");
    this.loginButton = page.getByRole("button", { name: "Login" });
  }

  async goToPage() {
    await this.page.goto("/login");
    await expect(this.username).toBeVisible({ timeout: 10000 });
  }

  async login(username: string, password: string, role: string) {
    await this.username.fill(username);
    await this.password.fill(password, { timeout: 10000 });
    await this.roleSelect.selectOption(role, { timeout: 10000 });
    await this.loginButton.click({ timeout: 10000 });
  }
}
