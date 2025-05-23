import { PropsWithChildren } from "react";
import { Spinner } from "@gitcoin/ui";
import { LandingPage } from "@gitcoin/ui/retrofunding";

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center gap-4">
    <p className="font-ui-sans text-xl font-medium">Loading...</p>
    <Spinner />
  </div>
);

export const Landing = ({
  isLoading,
  children,
}: PropsWithChildren<{ poolName?: string; poolDescription?: string; isLoading?: boolean }>) => {
  return <LandingPage type="admin">{isLoading ? <LoadingSpinner /> : children}</LandingPage>;
};
