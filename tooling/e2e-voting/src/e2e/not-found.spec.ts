import { expect } from "@playwright/test";
import { testWithSynpress, metaMaskFixtures } from "@synthetixio/synpress";
import Dotenv from "dotenv";
import BasicSetup from "@/wallet-setup/basic.setup";

Dotenv.config({ path: [".env", ".env.test"], override: true });

const test = testWithSynpress(metaMaskFixtures(BasicSetup));

test("Should go to the not found page in route '/'", async ({ page }) => {
  await page.goto("/");
  const notFoundContainer = page.getByTestId("not-found-container");
  const navbar = page.getByTestId("gc-navbar");
  const connectButton = navbar.getByTestId("rk-connect-button");
  await expect(notFoundContainer).toBeVisible();
  await expect(navbar).toBeVisible();
  await expect(connectButton).toBeVisible();
  await expect(page.getByTestId("rk-connect-button")).toHaveCSS(
    "background-color",
    "rgb(64, 38, 140)",
  );
});

test("Should go to the not found page in unknown route", async ({ page }) => {
  await page.goto("/some-route");
  const notFoundContainer = page.getByTestId("not-found-container");
  const navbar = page.getByTestId("gc-navbar");
  const connectButton = navbar.getByTestId("rk-connect-button");
  await expect(notFoundContainer).toBeVisible();
  await expect(navbar).toBeVisible();
  await expect(connectButton).toBeVisible();
  await expect(page.getByTestId("rk-connect-button")).toHaveCSS(
    "background-color",
    "rgb(64, 38, 140)",
  );
});
