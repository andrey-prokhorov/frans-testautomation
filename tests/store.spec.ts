import { expect } from "@playwright/test";

import { StorePage } from "../pages/storePage";
import { bananaTest, orangeTest } from "./store.helper";

bananaTest.describe("Banana Purchase Tests", () => {
  bananaTest(
    "Make a purchase for Banana in UI and verify price on receipt against API",
    async ({ authenticatedPage: page, product }) => {
      const storePage = new StorePage(page);
      const purchaseAmount = "2";
      const customerName = "John Doe";
      const customerAddress = "123 Test Street, Test City";

      expect(product).toBeDefined();

      // Step 1: Make a purchase for Banana using addProductToCart
      await storePage.addProductToCart(
        product.id.toString(),
        purchaseAmount,
        product.name
      );

      // Step 2: Confirm purchase and verify price on receipt against API
      const expectedTotalPrice = product.price * parseInt(purchaseAmount);
      const expectedSummary = `${purchaseAmount} x ${product.name} - $${expectedTotalPrice}`;

      await storePage.confirmPurchase(
        customerName,
        customerAddress,
        expectedSummary
      );
    }
  );

  bananaTest(
    "Verify individual Banana product price matches API",
    async ({ authenticatedPage: page, product }) => {
      const storePage = new StorePage(page);
      const purchaseAmount = "1";
      const customerName = "Jane Smith";
      const customerAddress = "456 API Test Ave";

      expect(product).toBeDefined();

      // Make purchase for single Banana
      await storePage.addProductToCart(
        product.id.toString(),
        purchaseAmount,
        product.name
      );

      // Verify single item price matches API exactly
      const expectedSummary = `${purchaseAmount} x ${product.name} - $${product.price}`;

      await storePage.confirmPurchase(
        customerName,
        customerAddress,
        expectedSummary
      );
    }
  );
});

orangeTest.describe("Orange Purchase Tests", () => {
  orangeTest(
    "Make a purchase for Orange in UI and verify price on receipt against API",
    async ({ authenticatedPage: page, product }) => {
      const storePage = new StorePage(page);
      const purchaseAmount = "3";
      const customerName = "Orange Buyer";
      const customerAddress = "Orange Street 123";

      expect(product).toBeDefined();

      // Step 1: Make a purchase for Orange using addProductToCart
      await storePage.addProductToCart(
        product.id.toString(),
        purchaseAmount,
        product.name
      );

      // Step 2: Confirm purchase and verify price on receipt against API
      const expectedTotalPrice = product.price * parseInt(purchaseAmount);
      const expectedSummary = `${purchaseAmount} x ${product.name} - $${expectedTotalPrice}`;

      await storePage.confirmPurchase(
        customerName,
        customerAddress,
        expectedSummary
      );
    }
  );
});
