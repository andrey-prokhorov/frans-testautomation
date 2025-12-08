# Introduktion

Detta projekt är en lösning för webbaserad testning byggd med **Playwright** och **TypeScript** inom kursen:

[“Testautomation och AI inom it-test”](https://schartau.stockholm/program-och-kurser/datait/testautomation-och-ai-inom-it-test/) på Frans Schartaus Handelsinstitut

Period: 23 oktober - 8 januari 2025
10 veckor, 25 YH-poäng

Kursen innehåller följande moment:

- Automatiserad webbtestning
- Ramverk och metodik
- Automatiseringsregler
- Automatisk testmetodik
- AI programmering
- AI för att optimera testskript, testautomatisering samt analysera användardokumentation och krav
- Identifiera potentiella användarscenarion
- Prestandatester
- Säkerhetstestning
- Hållbarhet

---

**Assignment**

Your repository should contain:

- A pipeline which is running the tests.
- Five tests for [hoff.is/login](https://hoff.is/login) page (and the store page when you logged in)
- At least one test needs to be using the API
- At least one test needs to be accessibility testing.
- You need to use PageObject models for the tests.
- Use the API's to fetch data for assertions (expects).

---

The following API's can be used to fetch product data for the store:

- https://hoff.is/store2/api/v1/product/list - to fetch a list of products in the store.
- https://hoff.is/store2/api/v1/price/1 - to fetch a product by id

Here is an example:

- Get price for Apple from API
- Make a purchase for Apple in UI.
- Verify price is correct on receipt according to API.
