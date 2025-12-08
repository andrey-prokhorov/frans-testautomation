import {
  test as base,
  expect,
  APIRequestContext,
  request,
  Page,
} from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { StorePage } from "../pages/storePage";

type ProductListItem = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
};

export const test = base.extend<{
  apiContext: APIRequestContext;
  bananaProductId: number;
  bananaProduct: Product;
  authenticatedPage: Page;
}>({
  apiContext: async ({}, use) => {
    const apiContext = await request.newContext();

    await use(apiContext);
    await apiContext.dispose();
  },

  bananaProductId: async ({ apiContext }, use) => {
    const productsResponse = await apiContext.get(
      "/store2/api/v1/product/list"
    );
    expect(productsResponse.ok()).toBeTruthy();

    const productsData = await productsResponse.json();
    const products = productsData.products;
    const bananaListItem = products.find((product: ProductListItem) =>
      product.name.toLowerCase().includes("banana")
    );

    expect(bananaListItem).toBeDefined();
    await use(bananaListItem.id);
  },

  bananaProduct: async ({ apiContext, bananaProductId }, use) => {
    const productResponse = await apiContext.get(
      "https://hoff.is/store2/api/v1/price/" + bananaProductId
    );
    expect(productResponse.ok()).toBeTruthy();
    const bananaProduct = await productResponse.json();

    expect(bananaProduct).toBeDefined();
    await use(bananaProduct);
  },

  authenticatedPage: async ({ page }, use) => {
    const password = process.env.E2E_PASSWORD!;
    const loginPage = new LoginPage(page);

    await loginPage.goToPage();
    await loginPage.login("test", password, "consumer");
    await expect(page).toHaveURL(/\/store2/);

    await use(page);
  },
});

test.describe("Banana Purchase Tests", () => {
  test("Make a purchase for Banana in UI and verify price on receipt against API", async ({
    authenticatedPage: page,
    bananaProduct,
  }) => {
    const storePage = new StorePage(page);
    const purchaseAmount = "2";
    const customerName = "John Doe";
    const customerAddress = "123 Test Street, Test City";

    expect(bananaProduct).toBeDefined();

    // Step 1: Make a purchase for Banana using addProductToCart
    await storePage.addProductToCart(
      bananaProduct.id.toString(),
      purchaseAmount,
      bananaProduct.name
    );

    // Step 2: Confirm purchase and verify price on receipt against API
    const expectedTotalPrice = bananaProduct.price * parseInt(purchaseAmount);
    const expectedSummary = `${purchaseAmount} x ${bananaProduct.name} - $${expectedTotalPrice}`;

    await storePage.confirmPurchase(
      customerName,
      customerAddress,
      expectedSummary
    );

    // Additional verification: Check that the thank you message appears
    await expect(storePage.thankYouMessage).toContainText(
      `Thank you for your purchase, ${customerName}`
    );
  });

  test("Verify individual Banana product price matches API", async ({
    authenticatedPage: page,
    bananaProduct,
  }) => {
    const storePage = new StorePage(page);
    const purchaseAmount = "1";
    const customerName = "Jane Smith";
    const customerAddress = "456 API Test Ave";

    expect(bananaProduct).toBeDefined();

    // Make purchase for single Banana
    await storePage.addProductToCart(
      bananaProduct.id.toString(),
      purchaseAmount,
      bananaProduct.name
    );

    // Verify single item price matches API exactly
    const expectedSummary = `${purchaseAmount} x ${bananaProduct.name} - $${bananaProduct.price}`;

    await storePage.confirmPurchase(
      customerName,
      customerAddress,
      expectedSummary
    );
  });

  test("Verify multiple Banana items price calculation against API", async ({
    authenticatedPage: page,
    bananaProduct,
  }) => {
    const storePage = new StorePage(page);
    const purchaseAmount = "5";
    const customerName = "Bob Johnson";
    const customerAddress = "789 Multiple Items Blvd";

    expect(bananaProduct).toBeDefined();

    // Make purchase for multiple Bananas
    await storePage.addProductToCart(
      bananaProduct.id.toString(),
      purchaseAmount,
      bananaProduct.name
    );

    // Verify total price calculation matches API price * quantity
    const expectedTotalPrice = bananaProduct.price * parseInt(purchaseAmount);
    const expectedSummary = `${purchaseAmount} x ${bananaProduct.name} - $${expectedTotalPrice}`;

    await storePage.confirmPurchase(
      customerName,
      customerAddress,
      expectedSummary
    );
  });
});
