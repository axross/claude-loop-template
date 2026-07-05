import { expect, test, type Locator } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Manage a todo end to end: add, complete, persist, delete", async ({
  page,
}) => {
  const app = page.getByTestId("todo-app");
  let item: Locator;

  await test.step("Add a todo", async () => {
    await app.getByTestId("new-todo-input").fill("Walk the dog");
    await app.getByTestId("add-todo").click();

    item = app.getByTestId("todo-item");
    await expect(item).toHaveCount(1);
  });

  await test.step("Complete the todo", async () => {
    await item.getByTestId("toggle").check();

    await expect(item.getByTestId("toggle")).toBeChecked();
  });

  await test.step("Reload and verify the todo persisted", async () => {
    await page.reload();

    item = app.getByTestId("todo-item");
    await expect(item).toHaveCount(1);
    await expect(item.getByTestId("text")).toHaveText("Walk the dog");
    await expect(item.getByTestId("toggle")).toBeChecked();
  });

  await test.step("Delete the todo and verify the empty state", async () => {
    await item.getByTestId("delete").click();

    await expect(app.getByTestId("todo-item")).toHaveCount(0);
    await expect(app.getByTestId("empty-state")).toBeVisible();
  });
});

test("Blank input is not added as a todo", async ({ page }) => {
  const app = page.getByTestId("todo-app");

  await app.getByTestId("new-todo-input").fill("   ");
  await app.getByTestId("add-todo").click();

  await expect(app.getByTestId("todo-item")).toHaveCount(0);
  await expect(app.getByTestId("empty-state")).toBeVisible();
});
