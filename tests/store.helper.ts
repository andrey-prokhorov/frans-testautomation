import {
  test as base,
  expect,
  APIRequestContext,
  request,
  Page,
} from "@playwright/test";
import { LoginPage } from "../pages/loginPage";

type ProductListItem = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
};

// Helper function to create product fixtures
export const createProductFixtures = (productName: string) => {
  return base.extend<{
    apiContext: APIRequestContext;
    productId: number;
    product: Product;
    authenticatedPage: Page;
  }>({
    apiContext: async ({}, use) => {
      const apiContext = await request.newContext();

      await use(apiContext);
      await apiContext.dispose();
    },

    productId: async ({ apiContext }, use) => {
      const productsResponse = await apiContext.get(
        "/store2/api/v1/product/list"
      );
      expect(productsResponse.ok()).toBeTruthy();

      const productsData = await productsResponse.json();
      const products = productsData.products;
      const productItem = products.find((product: ProductListItem) =>
        product.name.toLowerCase().includes(productName.toLowerCase())
      );

      expect(productItem).toBeDefined();
      await use(productItem.id);
    },

    product: async ({ apiContext, productId }, use) => {
      const productResponse = await apiContext.get(
        "/store2/api/v1/price/" + productId
      );
      expect(productResponse.ok()).toBeTruthy();
      const productData = await productResponse.json();

      expect(productData).toBeDefined();
      await use(productData);
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
};

// Create specific test instances for different products
export const bananaTest = createProductFixtures("banana");
export const orangeTest = createProductFixtures("orange");
