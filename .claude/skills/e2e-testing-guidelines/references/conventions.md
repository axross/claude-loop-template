# E2E Test Conventions

## Locator Usage

Elements are targeted by stable test-id hooks scoped through their container, so copy edits and markup reshuffles never break a spec. When a hook is missing, the fallback order goes through accessibility, then copy: role-based locators cover accessible controls that cannot carry a test id, and text matching is reserved for assertions about the copy itself. Document structure is a last resort reserved for DOM the project cannot instrument.

**Guidelines:**

- MUST use the framework's test-id locator as the default for locating elements.
- MUST use kebab-case for test IDs.
- MUST use chained/scoped locators to narrow down the scope of the locator.
  - For example, scope a header lookup to its page container instead of querying the header globally.
- MUST use role-based locators, matching by accessible name, for accessible controls (buttons, options, menu items) that cannot carry a test id — for example, elements portaled out of the component's own markup.
- MUST NOT use text-matching locators except when the assertion is about the copy itself, such as an empty-state message.
- MUST add a new test id to the component when no stable hook exists rather than reaching for a structural CSS selector.
- MAY scope a structural locator inside a test-id-anchored container as a last resort for third-party-rendered DOM the project cannot instrument, when no role applies and the assertion is not about copy; leave a comment naming why no stable hook was possible.

**Example:**

```ts
import { expect, type Locator, test } from "@playwright/test";

test("Item summary section", async ({ page }) => {
  const itemPage = page.getByTestId("page");
  let summary: Locator;

  await test.step("Verify the title", async () => {
    summary = itemPage.getByTestId("summary");

    await expect(summary.getByTestId("title")).toBeVisible();
  });

  await test.step("Verify the action links", async () => {
    const actions = summary.getByTestId("actions");

    await test.step("Verify the primary action", async () => {
      await expect(actions.getByTestId("primary")).toBeVisible();
    });

    await test.step("Verify the secondary action", async () => {
      await expect(actions.getByTestId("secondary")).toBeVisible();
    });
  });
});
```

## Assertions

Prefer the framework's native auto-waiting assertions (visibility, focus, attribute, class, text, count) over pulling DOM state back into the test for manual comparison. Native assertions auto-wait and produce clearer failure messages; e.g., assert focus directly on the locator instead of reading `document.activeElement` and comparing it yourself.

To assert state that no native assertion covers (such as a computed style or a pseudo-element property), read it inside an in-browser evaluation on the host locator and wrap the call in a polling helper so scroll-driven or transition-driven changes have time to settle.

**Guidelines:**

- MUST prefer the framework's native auto-waiting assertions (visibility, focus, attribute, class, text, count) over evaluating DOM state and comparing it manually in the test. Native assertions auto-wait and produce clearer failure messages.
- MUST NOT use fixed sleeps to "let the animation finish" (see [flakiness-tolerance.md](../../quality-assurance-guidelines/references/flakiness-tolerance.md)).
- MUST use a polling / wait-for-condition helper to re-sample state until the expected value is reached when no native assertion covers it, such as scroll position, computed styles, scroll-driven animations, transitions, or intersection-observer-driven classes.

## Hooks Usage

Case-independent setup and cleanup belong in hooks so every spec starts from the same state and test bodies show only the behavior under test.

**Guidelines:**

- SHOULD use a before-each hook for setup that is not dependent on the test case.
- SHOULD use an after-each hook for cleanup that is not dependent on the test case.

**Example:**

```ts
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await test.step("Navigate to the index route", async () => {
    await page.goto("/");
  });
});
```
