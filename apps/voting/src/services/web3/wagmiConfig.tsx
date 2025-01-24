import { createClient, fallback, http } from "viem";
import { createConfig } from "wagmi";
import { config } from "@/config";
import { wagmiConnectors } from "./wagmiConnectors";

const { targetNetworks } = config;

export const wagmiConfig = createConfig({
  chains: targetNetworks,
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
