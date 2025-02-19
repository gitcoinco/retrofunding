import { expect } from "@playwright/test";
import { MetaMask, testWithSynpress, metaMaskFixtures } from "@synthetixio/synpress";
import { WALLET_ADDRESS } from "@/config";
import { interceptGQL } from "@/fixtures/graphql";
import { mockMetrics } from "@/mocks/metrics";
import { mockRound } from "@/mocks/rounds";
import { mockVoteResponse } from "@/mocks/vote";
import { checkWalletAddress } from "@/utils/walletHelpers";
import BasicSetup from "@/wallet-setup/basic.setup";

const {
  round: {
    id: alloPoolIdResponse,
    roundMetadata: {
      name: roundNameResponse,
      retroFundingConfig: {
        program: { chainId: chainIdResponse },
      },
    },
  },
} = mockRound;

const test = testWithSynpress(metaMaskFixtures(BasicSetup));

const testQL = test.extend<{ interceptGQL: typeof interceptGQL }>({
  interceptGQL: async ({ browser }, use) => {
    await use(interceptGQL);
  },
});

testQL("Should submit ballot", async ({ context, page, extensionId, interceptGQL }) => {
  await page.route("https://api.retrofunding.gitcoin.co/api/vote", async (route) => {
    const request = route.request();

    // Log the request payload for verification
    const postData = JSON.parse(request.postData() || "{}");

    // Verify request headers
    const headers = request.headers();
    expect(headers["content-type"]).toBe("application/json");

    // Verify request body structure
    const { alloPoolId, chainId, voter, signature, ballot } = postData;
    expect(alloPoolId).toBe(alloPoolIdResponse);
    expect(chainId).toBe(chainIdResponse);
    expect(voter.toLowerCase()).toBe(WALLET_ADDRESS?.toLowerCase());
    expect(typeof signature).toBe("string");
    expect(ballot).toEqual([
      { metricIdentifier: "playwright", voteShare: 25 },
      { metricIdentifier: "userEngagement", voteShare: 25 },
      { metricIdentifier: "twitterAge", voteShare: 25 },
      { metricIdentifier: "gasFees", voteShare: 25 },
    ]);

    // Mock the response
    await route.fulfill(mockVoteResponse.success);
  });

  await interceptGQL(page, "getRoundByIdAndChainId", mockRound);
  await interceptGQL(page, "getFilteredMetrics", mockMetrics);

  await page.goto(`/#/${chainIdResponse}/${alloPoolIdResponse}`);
  await page.getByTestId("rk-connect-button").click();
  await page.getByTestId("rk-wallet-option-io.metamask").click();
  const metamask = new MetaMask(context, page, BasicSetup.walletPassword, extensionId);

  await metamask.connectToDapp();
  await metamask.approveSwitchNetwork();

  await checkWalletAddress(page);

  await page.getByText("Submit ballot").click();

  await page.getByTestId("submit-ballot-button").click();
  await metamask.confirmSignature();

  await expect(page.getByText(mockRound.round.roundMetadata.name)).toBeVisible();
});
