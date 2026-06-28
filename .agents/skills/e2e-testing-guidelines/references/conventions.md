# E2E Test Conventions

_Code examples below use Playwright APIs (`getByTestId`, `storageState`, `test.step`, `page.request`) as the concrete shape. Translate them to `{{E2E_TEST_FRAMEWORK}}`'s equivalents during INIT; the conventions in the prose are framework-neutral._

## Locator Usage

Locator Usage sets the required project default: use the framework's stable test-id locator for locators.

**Guidelines:**

- MUST use the framework's test-id locator for locators.
- MUST use kebab-case for test IDs.
- MUST use chained/scoped locators to narrow down the scope of the locator.
  - For example, scope a header lookup to its page container instead of querying the header globally.
- SHOULD fall back to a generic CSS/structural locator only for cases that cannot be expressed with a test-id locator.
- MUST NOT use text-matching locators (locating by visible text).

**Example:**

```ts
import { expect, type Locator, test } from "{{E2E_TEST_FRAMEWORK}}";

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

Assertions sets the required project default: prefer the framework's native auto-waiting assertions (visibility, focus, attribute, class, text, count) over pulling DOM state back into the test for manual comparison. Native assertions auto-wait and produce clearer failure messages; e.g., assert focus directly on the locator instead of reading `document.activeElement` and comparing it yourself.

- To assert state that no native assertion covers (such as a computed style or a pseudo-element property), read it inside an in-browser evaluation on the host locator and wrap the call in a polling helper so scroll-driven or transition-driven changes have time to settle.

**Guidelines:**

- MUST prefer the framework's native auto-waiting assertions (visibility, focus, attribute, class, text, count) over evaluating DOM state and comparing it manually in the test. Native assertions auto-wait and produce clearer failure messages.
- MUST NOT use fixed sleeps to "let the animation finish" (see [flakiness-tolerance.md](../../quality-assurance-guidelines/references/flakiness-tolerance.md)).
- MUST use a polling / wait-for-condition helper to re-sample state until the expected value is reached when no native assertion covers it, such as scroll position, computed styles, scroll-driven animations, transitions, or intersection-observer-driven classes.

## Hooks Usage

Hooks Usage describes the preferred project default: use a before-each hook for setup that is not dependent on the test case.

**Guidelines:**

- SHOULD use a before-each hook for setup that is not dependent on the test case.
- SHOULD use an after-each hook for cleanup that is not dependent on the test case.

**Example:**

```ts
import { expect, test } from "{{E2E_TEST_FRAMEWORK}}";

test.beforeEach(async ({ page }) => {
	await test.step("Navigate to the index route", async () => {
		await page.goto("/");
	});
});
```

## API Calls

### Authentication

Authentication describes the preferred project default: reuse authenticated storage state when using API call functions, so each test does not re-authenticate.

**Guidelines:**

- SHOULD reuse authenticated storage state when using API call functions.

**Example:**

```ts
import { test } from "{{E2E_TEST_FRAMEWORK}}";
import { authenticatedStorageState } from "@/{{TEST_DIR}}/helpers/api/auth";

test.use({ storageState: authenticatedStorageState });

test.beforeEach(async ({ page }) => {
	await test.step("Navigate to the index route", async () => {
		await page.goto("/");
	});
});
```

### API Call Usage

API Call Usage describes the preferred project default: use API call functions to retrieve data to compare with the UI.

**Guidelines:**

- SHOULD use API call functions to retrieve data to compare with the UI.
- SHOULD use API call functions in each test case.
- SHOULD use API call functions in the before-each hook instead of within the test case if it is not dependent on the test case.

**Example:**

```ts
import { expect, test } from "{{E2E_TEST_FRAMEWORK}}";
import { getExampleItem } from "@/{{TEST_DIR}}/helpers/api/item";
import { authenticatedStorageState } from "@/{{TEST_DIR}}/helpers/api/auth";

test.use({ storageState: authenticatedStorageState });

test("Item header", async ({ page }, testInfo) => {
	let item: Awaited<ReturnType<typeof getExampleItem>>;

	await test.step("Retrieve the example item record", async () => {
		item = await getExampleItem({ page, testInfo });
	});

	const header = page.getByTestId("page").getByTestId("header");

	await test.step("Verify the item title", async () => {
		await expect(header.getByTestId("title")).toHaveText(item.title);
	});

	await test.step("Verify the item owner", async () => {
		await expect(header.getByTestId("owner")).toHaveText(item.owner.name);
	});
});
```

### API Call Function Definitions

**Example:**

```ts
import type { Page, TestInfo } from "{{E2E_TEST_FRAMEWORK}}";
import type z from "zod";
import { ItemSchema } from "@/repositories/schema";

export const exampleItemId = "example-item";

export async function getExampleItem({
	page,
	testInfo,
}: {
	page: Page;
	testInfo: TestInfo;
}): Promise<z.infer<typeof ItemSchema>> {
	const url = new URL("/api/items", testInfo.project.use.baseURL);
	url.searchParams.set("where[id][equals]", exampleItemId);
	url.searchParams.set("limit", "1");

	// use the framework's request fixture for API calls so it shares the test's auth state
	const response = await page.request.get(`${url}`);

	if (!response.ok()) {
		throw new Error(
			"Failed to get the example item due to non-200 response.",
		);
	}

	const json = await response.json();
	const docs = json.docs;

	if (Array.isArray(docs) && docs.length > 0) {
		// parse with the project's schema parser to validate the response shape
		return ItemSchema.parse(docs[0]);
	}

	throw new Error("Failed to get the example item because it was not found.");
}
```

**Guidelines:**

- MUST define API call functions in `@/{{TEST_DIR}}/helpers/api/`.
- SHOULD use kebab-case for file names.
- SHOULD named-export the function.
- SHOULD take `page` and `testInfo` as arguments.
- MUST use the framework's request fixture to make API calls so they share the test's authenticated state.
