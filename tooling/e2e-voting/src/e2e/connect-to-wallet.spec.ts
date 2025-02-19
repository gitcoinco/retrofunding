import { MetaMask, testWithSynpress, metaMaskFixtures } from "@synthetixio/synpress";
import { checkWalletAddress } from "@/utils/walletHelpers";
import BasicSetup from "@/wallet-setup/basic.setup";

const test = testWithSynpress(metaMaskFixtures(BasicSetup));

test("should connect wallet to the MetaMask Dapp", async ({ context, page, extensionId }) => {
  const metamask = new MetaMask(context, page, BasicSetup.walletPassword, extensionId);

  await page.goto("/");

  await checkWalletAddress(page, null);

  await page.getByTestId("rk-connect-button").click();
  await page.getByTestId("rk-wallet-option-io.metamask").click();
  await metamask.connectToDapp();

  await checkWalletAddress(page);
});
