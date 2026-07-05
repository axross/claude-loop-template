import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("App boots and shows the todo page", async ({ page }) => {
  await expect(page.getByTestId("page-title")).toBeVisible();
  await expect(page.getByTestId("todo-app")).toBeVisible();
  await expect(page.getByTestId("empty-state")).toBeVisible();
});

test("Core loop: a new todo appears in the list", async ({ page }) => {
  const app = page.getByTestId("todo-app");

  await app.getByTestId("new-todo-input").fill("Buy milk");
  await app.getByTestId("add-todo").click();

  const items = app.getByTestId("todo-item");
  await expect(items).toHaveCount(1);
  await expect(items.getByTestId("text")).toHaveText("Buy milk");
});
