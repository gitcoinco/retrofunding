"use client";

import { PropsWithChildren } from "react";
import { LandingPage } from "@gitcoin/ui/retrofunding";

export const Home = ({
  poolName,
  poolDescription,
  isLoading,
  children,
}: PropsWithChildren<{ poolName?: string; poolDescription?: string; isLoading?: boolean }>) => {
  return (
    <LandingPage type="vote" roundName={poolName} roundDescription={poolDescription}>
      {isLoading ? <div>Loading...</div> : children}
    </LandingPage>
  );
};
