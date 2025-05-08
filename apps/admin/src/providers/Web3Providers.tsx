"use client";

import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import SafeProvider from "@safe-global/safe-apps-react-sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { BlockieAvatar } from "@/components/BlockieAvatar";
import { wagmiConfig } from "@/services/web3/wagmiConfig";
import { SafeAutoConnect } from "./SafeAutoConnect";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const Web3Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={{
            ...lightTheme(),
            colors: { ...lightTheme().colors, accentColor: "#22635a" },
          }}
          avatar={BlockieAvatar}
        >
          <SafeProvider>
            <SafeAutoConnect>{children}</SafeAutoConnect>
          </SafeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
