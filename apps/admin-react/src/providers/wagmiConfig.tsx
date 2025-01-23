import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { Chain, createClient, fallback, http } from "viem";
import { mainnet } from "viem/chains";
import * as chains from "viem/chains";
import { createConfig } from "wagmi";

export type Config = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  walletConnectProjectId: string;
};

const config = {
  // The networks on which your DApp is live
  targetNetworks: [chains.mainnet],

  // The interval at which your front-end polls the RPC servers for new data
  // it has no effect if you only target the local network (default is 4000)
  pollingInterval: 30000,

  // This is ours WalletConnect's default project ID.
  // You can get your own at https://cloud.walletconnect.com
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  walletConnectProjectId: import.meta.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || "PROJECT_ID",
} as const satisfies Config;

const wallets = [
  metaMaskWallet,
  walletConnectWallet,
  ledgerWallet,
  coinbaseWallet,
  rainbowWallet,
  safeWallet,
];

/**
 * wagmi connectors for the wagmi context
 */
export const wagmiConnectors = connectorsForWallets(
  [
    {
      groupName: "Supported Wallets",
      wallets,
    },
  ],

  {
    appName: "Retrofunding",
    projectId: config.walletConnectProjectId,
  },
);
const { targetNetworks } = config;

// We always want to have mainnet enabled (ENS resolution, ETH price, etc). But only once.
export const enabledChains = targetNetworks.find((network: Chain) => network.id === 1)
  ? targetNetworks
  : ([...targetNetworks, mainnet] as const);

export const wagmiConfig = createConfig({
  chains: enabledChains,
  connectors: wagmiConnectors,
  ssr: true,
  client({ chain }) {
    const rpcFallbacks = [http()];

    return createClient({
      chain,
      transport: fallback(rpcFallbacks),
      pollingInterval: config.pollingInterval,
    });
  },
});
