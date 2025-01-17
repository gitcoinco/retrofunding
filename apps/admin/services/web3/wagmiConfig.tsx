import { Chain, createClient, fallback, http } from "viem";
import { mainnet } from "viem/chains";
import { createConfig } from "wagmi";
import config from "@/config";
import { wagmiConnectors } from "./wagmiConnectors";

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
