import { PropsWithChildren } from "react";
import { LandingPage } from "@gitcoin/ui/retrofunding";

export const Landing = ({
  isLoading,
  children,
}: PropsWithChildren<{ poolName?: string; poolDescription?: string; isLoading?: boolean }>) => {
  return <LandingPage type="admin">{isLoading ? <div>Loading...</div> : children}</LandingPage>;
};
