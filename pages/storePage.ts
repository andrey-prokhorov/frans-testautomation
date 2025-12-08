import { Page, Locator, expect } from "@playwright/test";

export class StorePage {
  readonly page: Page;

  readonly selectProduct: Locator;
  readonly amountInput: Locator;
  readonly addToCartButton: Locator;
  readonly buyMessage: Locator;
  readonly buyButton: Locator;

  readonly nameInput: Locator;
  readonly addressInput: Locator;
  readonly confirmButton: Locator;
  readonly summaryItem: Locator;
  readonly thankYouMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.selectProduct = page.getByTestId("select-product");
    this.amountInput = page.getByRole("textbox", { name: "Amount" });
    this.addToCartButton = page.getByTestId("add-to-cart-button");
    this.buyMessage = page.getByTestId("buy-message");
    this.buyButton = page.getByRole("button", { name: "Buy" });

    this.nameInput = page.getByRole("textbox", { name: "Name:" });
    this.addressInput = page.getByRole("textbox", { name: "Address:" });
    this.confirmButton = page.getByRole("button", { name: "Confirm Purchase" });

    this.summaryItem = page.getByRole("listitem");
    this.thankYouMessage = page.locator("#name");
  }
  async goToPage() {
    await this.page.goto("/store2");
  }
  async addProductToCart(
    productId: string,
    amount: string,
    expectedProductName: string
  ) {
    await this.selectProduct.selectOption(productId);

    await this.amountInput.click();
    await this.amountInput.fill(amount);

    await this.addToCartButton.click();

    await expect(this.buyMessage).toContainText(
      `Added ${amount} x ${expectedProductName} to cart.`
    );

    await this.buyButton.click();
  }

  async confirmPurchase(
    name: string,
    address: string,
    expectedSummary: string
  ) {
    await this.nameInput.fill(name);
    await this.addressInput.fill(address);

    await this.confirmButton.click();

    await expect(this.summaryItem).toContainText(expectedSummary);
    await expect(this.thankYouMessage).toContainText(
      `Thank you for your purchase, ${name}`
    );
  }
}
