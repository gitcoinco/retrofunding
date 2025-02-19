import { expect, Page } from "@playwright/test";
import { WALLET_ADDRESS } from "@/config";

export const waitForWalletConnection = async (page: Page) => {
  await page.waitForFunction(() => window.ethereum?.selectedAddress);
};

export const getWalletAddress = async (page: Page) => {
  const address = await page.evaluate(() => window.ethereum?.selectedAddress);
  return address ? address.toLowerCase() : address;
};

export const checkWalletAddress = async (page: Page, address: string | null = WALLET_ADDRESS) => {
  const walletAddress = await getWalletAddress(page);
  const addressToCheck = address ? address.toLowerCase() : address;
  expect(walletAddress).toBe(addressToCheck);
};
