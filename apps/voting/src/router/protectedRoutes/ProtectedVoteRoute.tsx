import React, { PropsWithChildren } from "react";
import { Outlet, useParams } from "react-router";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Hex } from "viem";
import { useAccount } from "wagmi";
import { useGetMetrics } from "@/hooks/useGetMetrics";
import { useGetRoundWithApplications } from "@/hooks/useGetRoundWithApplications";
import { useGetVote } from "@/hooks/useGetVote";
import { useIsVoter } from "@/hooks/useIsVoter";
import { NotFound } from "@/pages";
import { NoVoterDialog } from "@/pages/Vote/components/NoVoterDialog";

interface RouteProps {
  fallback: React.FC<PropsWithChildren<any>>;
  fallbackProps?: any;
}

export const ProtectedVoteRoute = ({ fallback: Fallback }: RouteProps) => {
  const { roundId: roundIdParam, chainId: chainIdParam } = useParams();
  const chainId = parseInt(chainIdParam as string);
  const roundId = roundIdParam as string;

  const { isConnected, isConnecting, address } = useAccount();

  const {
    data: roundData,
    isLoading: isRoundLoading,
    isError: isRoundError,
  } = useGetRoundWithApplications({
    roundId,
    chainId,
    retry: false,
  });

  const { data: isVoterData, isLoading: isVoterLoading } = useIsVoter({
    alloPoolId: roundId,
    chainId,
    address: address as Hex,
  });

  const { isVoter } = isVoterData ?? {};

  const { isLoading: metricsIsLoading } = useGetMetrics({
    identifiers: roundData?.impactMetrics,
    enabled: !!roundData?.impactMetrics,
  });

  const { isLoading: voteIsLoading } = useGetVote({
    alloPoolId: roundId,
    chainId,
    address: address as Hex,
  });

  const fallbackProps = {
    poolName: roundData?.name,
    poolDescription: roundData?.description,
  };

  const isLoading =
    isRoundLoading || isVoterLoading || isConnecting || metricsIsLoading || voteIsLoading;

  if (isRoundError || (chainId !== undefined && isNaN(chainId))) {
    return <NotFound />;
  }

  if (isLoading) {
    return <Fallback isLoading={true} />;
  }

  if (!isConnected) {
    return (
      <Fallback {...fallbackProps}>
        <ConnectButton />
      </Fallback>
    );
  }

  if (!isVoter) {
    return (
      <Fallback {...fallbackProps}>
        <NoVoterDialog isOpen={true} />
      </Fallback>
    );
  }

  return <Outlet />;
};
