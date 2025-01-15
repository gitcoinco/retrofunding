"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { LandingPage } from "gitcoin-ui/retrofunding";
import { useAccount } from "wagmi";

export default function Home(): React.ReactNode {
  const account = useAccount();
  const actionButton = account.isConnected ? (
    <div>Connected</div>
  ) : (
    <ConnectButton />
  );
  return <LandingPage type="admin" actionButton={actionButton} />;
}
