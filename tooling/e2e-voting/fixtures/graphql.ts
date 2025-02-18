import { Page, Route, test as baseTest } from "@playwright/test";

export const test = baseTest.extend<{ interceptGQL: typeof interceptGQL }>({
  interceptGQL: async ({ browser }, use) => {
    await use(interceptGQL);
  },
});
// GQL variables the request was called with.
// Useful to validate the API was called correctly.
type CalledWith = Record<string, unknown>;

// Registers a client-side interception to our BFF (presumes all `graphql`
// requests are to us). Interceptions are per-operation, so multiple can be
// registered for different operations without overwriting one-another.
export async function interceptGQL(
  page: Page,
  operationName: string,
  resp: Record<string, unknown>,
): Promise<CalledWith[]> {
  // A list of GQL variables which the handler has been called with.
  const reqs: CalledWith[] = [];

  // Register a new handler which intercepts all GQL requests.
  await page.route("**/graphql", function (route: Route) {
    const req = route.request().postDataJSON();

    // Pass along to the previous handler in the chain if the request
    // is for a different operation.
    if (req.operationName !== operationName) {
      return route.fallback();
    }

    // Store what variables we called the API with.
    reqs.push(req.variables);

    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: resp }),
    });
  });

  return reqs;
}
