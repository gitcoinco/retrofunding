import { Chain } from "viem/chains";
import { targetNetworks } from "@/services/web3/chains";

export type Config = {
  targetNetworks: readonly [Chain, ...Chain[]];
  pollingInterval: number;
  walletConnectProjectId: string;
  pinataJwt: string;
  alchemyId: string;
  infuraId: string;
  ipfsBaseUrl: string;
  pinataBaseUrl: string;
  pinataUploadUrl: string;
  availableNetworks: number[];
};

export const config = {
  // The networks on which your DApp is live
  targetNetworks,

  // The interval at which your front-end polls the RPC servers for new data
  // it has no effect if you only target the local network (default is 4000)
  pollingInterval: 30000,

  // This is ours WalletConnect's default project ID.
  // You can get your own at https://cloud.walletconnect.com
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "PROJECT_ID",

  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,

  alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID!,

  infuraId: process.env.NEXT_PUBLIC_INFURA_ID!,

  ipfsBaseUrl: process.env.NEXT_PUBLIC_IPFS_BASE_URL!,

  pinataBaseUrl: process.env.NEXT_PUBLIC_PINATA_BASE_URL!,

  pinataUploadUrl: process.env.NEXT_PUBLIC_PINATA_UPLOAD_URL!,

  availableNetworks: [10, 11155111],
} as const satisfies Config;
