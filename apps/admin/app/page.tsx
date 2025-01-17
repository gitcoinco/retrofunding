"use client";

import type { NextPage } from "next";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { LandingPage } from "gitcoin-ui/retrofunding";
import { useAccount } from "wagmi";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const actionButton = connectedAddress ? <>{connectedAddress}</> : <ConnectButton />;
  return <LandingPage type="admin" actionButton={actionButton} />;
};

export default Home;
