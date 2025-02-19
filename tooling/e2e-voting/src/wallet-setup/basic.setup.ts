import { MetaMask, defineWalletSetup, getExtensionId } from "@synthetixio/synpress";
import { SEED_PHRASE, PRIVATE_KEY, PASSWORD } from "@/config";

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const extensionId = await getExtensionId(context, "MetaMask");

  const metamask = new MetaMask(context, walletPage, PASSWORD, extensionId);

  await metamask.importWallet(SEED_PHRASE);
  await metamask.importWalletFromPrivateKey(PRIVATE_KEY);
  // await metamask.switchNetwork("optimism");
  // await metamask.confirmSignature();
});
