# E2E Test Conventions

_Code examples below use Playwright APIs (`getByTestId`, `storageState`, `test.step`, `page.request`) as the concrete shape. Translate them to `{{E2E_TEST_FRAMEWORK}}`'s equivalents during INIT; the conventions in the prose are framework-neutral._

## Locator Usage

Elements are targeted by stable test-id hooks scoped through their container, so copy edits and markup reshuffles never break a spec. When a hook is missing, the fallback order goes through accessibility, then copy — never document structure: role-based locators cover accessible controls that cannot carry a test id, and text matching is reserved for assertions about the copy itself.

**Guidelines:**

- MUST use the framework's test-id locator as the default for locating elements.
- MUST use kebab-case for test IDs.
- MUST use chained/scoped locators to narrow down the scope of the locator.
  - For example, scope a header lookup to its page container instead of querying the header globally.
- MUST use role-based locators, matching by accessible name, for accessible controls (buttons, options, menu items) that cannot carry a test id — for example, elements portaled out of the component's own markup.
- MUST NOT use text-matching locators except when the assertion is about the copy itself, such as an empty-state message.
- MUST add a new test id to the component when no stable hook exists rather than reaching for a structural CSS selector.

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
import { expect, test } from "{{E2E_TEST_FRAMEWORK}}";

test.beforeEach(async ({ page }) => {
	await test.step("Navigate to the index route", async () => {
		await page.goto("/");
	});
});
```

## API Calls

<!-- INIT:OPTIONAL key=BACKEND_API — keep if the project has a backend/API surface OR delete this block (client-only projects). -->
*If this project is client-only with no backend or API surface, delete this entire section during INIT.*

### Authentication

Re-authenticating in every test is slow and adds a failure mode unrelated to the behavior under test; a saved authenticated storage state lets each spec and its API helpers share one login.

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

Hard-coded expected values drift as content changes; fetching the same record through the API keeps UI assertions accurate without editing the spec every time the data moves.

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

Centralizing request wiring in named helpers keeps auth state, URL construction, and response validation consistent across specs, so test cases read as behavior instead of HTTP plumbing.

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
