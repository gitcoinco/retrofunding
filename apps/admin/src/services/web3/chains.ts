import { getChains, TChain } from "@gitcoin/gitcoin-chain-data";
import { Chain } from "@rainbow-me/rainbowkit";
import { zeroAddress } from "viem";
import * as chains from "viem/chains";

const chainData = getChains();

const { alchemyId, infuraId, isDevelopment, availableNetworks } = {
  alchemyId: import.meta.env.VITE_ALCHEMY_ID,
  infuraId: import.meta.env.VITE_INFURA_ID,
  isDevelopment: import.meta.env.VITE_ENV === "development",
  availableNetworks: [10, 11155111],
};

interface RpcConfig {
  [chainId: number]: string | undefined;
}

// Separate RPC configuration
const rpcUrls: RpcConfig = {
  1: "https://eth-mainnet.g.alchemy.com/v2/", // ethereum
  10: "https://opt-mainnet.g.alchemy.com/v2/", // optimism
  100: "https://gnosis-mainnet.g.alchemy.com/v2/", // gnosis
  42: "https://rpc.mainnet.lukso.network", // lukso
  137: "https://polygon-mainnet.g.alchemy.com/v2/", // polygon
  // 250: "", // fantom
  300: "https://zksync-sepolia.g.alchemy.com/v2/", // zksync sepolia
  324: "https://zksync-mainnet.g.alchemy.com/v2/", // zksync mainnet
  // 4201: "", // lukso test
  1088: "https://metis-mainnet.g.alchemy.com/v2/", // metis
  8453: "https://base-mainnet.g.alchemy.com/v2/", // base
  42161: "https://arb-mainnet.g.alchemy.com/v2/", // arbitrum
  42220: "https://celo-mainnet.infura.io/v3/", // celo
  43113: "https://avalanche-fuji.infura.io/v3/", // fuji
  43114: "https://avalanche-mainnet.infura.io/v3/", // avax
  44787: "https://celo-alfajores.infura.io/v3/", // alfajores
  // 534351: "", // scroll sepolia
  // 534352: "", // scroll mainnet
  // 1329: "", // sei
  // 713715: "", // sei devnet
  11155111: "https://eth-sepolia.g.alchemy.com/v2/",
};
// Configuration types
interface ChainConfig {
  availableNetworks: number[];
  isDevelopment: boolean;
}

// RPC URL helper functions
const appendProviderKey = (url: string, provider: "alchemy" | "infura"): string => {
  const envKey = provider === "alchemy" ? alchemyId : infuraId;

  return envKey ? url + envKey : url;
};

export const getRpcUrl = (chain: TChain): string => {
  const baseUrl = rpcUrls[chain.id] ?? chain.rpc;

  if (baseUrl.includes("alchemy")) {
    return appendProviderKey(baseUrl, "alchemy");
  }
  if (baseUrl.includes("infura")) {
    return appendProviderKey(baseUrl, "infura");
  }

  return baseUrl;
};

export function stringToBlobUrl(data: string): string {
  const blob = new Blob([data], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  return url;
}

export const parseRainbowChain = (chain: TChain): Chain => {
  const nativeToken = chain.tokens.find((token) => token.address === zeroAddress);

  const rpc = getRpcUrl(chain);

  // Map the TChain to @rainbow-me/rainbowkit/Chain
  const mappedChain: Chain = {
    id: chain.id,
    name: chain.prettyName,
    iconUrl: stringToBlobUrl(chain.icon),
    iconBackground: "rgba(255, 255, 255, 0)",
    nativeCurrency: {
      name: nativeToken?.code as string,
      symbol: nativeToken?.code as string,
      decimals: nativeToken?.decimals as number,
    },
    rpcUrls: {
      default: {
        http: [rpc],
        webSocket: undefined,
      },
      public: {
        http: [chain.rpc],
        webSocket: undefined,
      },
    },
    contracts: {
      ensUniversalResolver: {
        address: chain.contracts.ensUniversalResolver ?? zeroAddress,
      },
    },
  } as const satisfies Chain;
  return mappedChain;
};

const filterChainsByEnvironment = (isDevelopment: boolean): TChain[] => {
  return isDevelopment ? chainData : chainData.filter((chain) => chain.type === "mainnet");
};

const filterChainsByAvailability = (chains: TChain[], availableNetworks: number[]): TChain[] => {
  return chains.filter((chain) => availableNetworks.includes(chain.id));
};

export const getTargetNetworks = (config: ChainConfig): [Chain, ...Chain[]] => {
  const environmentChains = filterChainsByEnvironment(config.isDevelopment);
  const availableChains = filterChainsByAvailability(environmentChains, config.availableNetworks);

  const parsedChains = availableChains.map(parseRainbowChain) as [Chain, ...Chain[]];

  return parsedChains.length > 0 ? parsedChains : ([chains.mainnet] as [Chain, ...Chain[]]);
};

// Export chain data
export const allNetworks = chainData;
export const mainnetNetworks = chainData.filter((chain) => chain.type === "mainnet");

export const targetNetworks = getTargetNetworks({
  availableNetworks,
  isDevelopment,
});
