import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";

import {
  mainnet,
  sepolia,
  optimism,
  optimismSepolia,
  celo,
  celoAlfajores,
  polygon,
  arbitrum,
  arbitrumSepolia,
  base,
  avalancheFuji,
  avalanche,
  scroll,
  fantom,
  fantomTestnet,
  zksync,
  zksyncSepoliaTestnet,
  filecoin,
  sei,
  seiDevnet,
  lukso,
  luksoTestnet,
  metis,
  gnosis,
} from "wagmi/chains";

const PRODUCTION_CHAINS = [
  mainnet,
  optimism,
  celo,
  polygon,
  arbitrum,
  avalanche,
  scroll,
  fantom,
  zksync,
  filecoin,
  sei,
  lukso,
  metis,
  gnosis,
  base,
];

const TEST_CHAINS = [
  sepolia,
  optimismSepolia,
  celoAlfajores,
  arbitrumSepolia,
  avalancheFuji,
  fantomTestnet,
  zksyncSepoliaTestnet,
  seiDevnet,
  luksoTestnet,
];

const ALL_CHAINS = [...PRODUCTION_CHAINS, ...TEST_CHAINS];

const NODE_ENV = process.env.NODE_ENV || "development";

export const wagmiConfig = getDefaultConfig({
  appName: "Retrofunding Admin",
  projectId: "YOUR_PROJECT_ID",
  chains:
    NODE_ENV == "development"
      ? (ALL_CHAINS as any)
      : (PRODUCTION_CHAINS as any),
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true,
});
