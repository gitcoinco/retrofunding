import { expect } from "@playwright/test";
import { MetaMask, testWithSynpress, metaMaskFixtures } from "@synthetixio/synpress";
import Dotenv from "dotenv";
import BasicSetup from "@/wallet-setup/basic.setup";

Dotenv.config({ path: [".env", ".env.test"], override: true });

const test = testWithSynpress(metaMaskFixtures(BasicSetup));

test("should connect wallet to the MetaMask Dapp", async ({ context, page, extensionId }) => {
  const metamask = new MetaMask(context, page, BasicSetup.walletPassword, extensionId);

  await page.goto("/");

  const addressBefore: string = await page.evaluate(() => window.ethereum.selectedAddress);

  expect(addressBefore).toBe(null);

  await page.getByTestId("rk-connect-button").click();
  await page.getByTestId("rk-wallet-option-io.metamask").click();
  await metamask.connectToDapp();

  const addressAfter: string = await page.evaluate(() => window.ethereum.selectedAddress);

  expect(addressAfter).toBe(process.env.TEST_WALLET_ADDRESS);
});
