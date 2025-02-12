import { useCallback, useMemo } from "react";
import { useState } from "react";
import { useParams } from "react-router";
import { useToast } from "@gitcoin/ui/hooks/useToast";
import { BallotForm } from "@gitcoin/ui/retrofunding";
import { isEqual } from "lodash";
import { Hex } from "viem";
import { useAccount } from "wagmi";
import { useWalletClient } from "wagmi";
import { useGetRoundWithApplications, useVote } from "@/hooks";
import { useGetMetrics } from "@/hooks/useGetMetrics";
import { useGetVote } from "@/hooks/useGetVote";
import { RetroVoteBody, BallotValues } from "@/types";
import { getDeterministicObjHash } from "@/utils";
import { Home } from "../Home";
import { SumbitBalllotDialog } from "./components/SumbitBalllotDialog";
import { VoteSidebar } from "./components/VoteSidebar";

export const Vote = () => {
  const { toast } = useToast();
  const [currentBallot, setCurrentBallot] = useState<
    { metricIdentifier: string; voteShare: number }[]
  >([]);
  const { roundId: roundIdParam, chainId: chainIdParam } = useParams();
  const chainId = parseInt(chainIdParam as string);
  const roundId = roundIdParam as string;

  const [isSubmitBallotDialogOpen, setIsSubmitBallotDialogOpen] = useState(false);
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { voteMutation } = useVote();

  const { data: round, isLoading: roundIsLoading } = useGetRoundWithApplications({
    roundId,
    chainId,
  });

  const availableMetricsIds = round?.impactMetrics;

  const { data: metrics, isLoading: metricsIsLoading } = useGetMetrics({
    identifiers: availableMetricsIds,
    enabled: !!availableMetricsIds,
  });

  const {
    data: voteResponse,
    isLoading: voteIsLoading,
    refetch: refetchVote,
  } = useGetVote({
    alloPoolId: roundId,
    chainId,
    address: address as Hex,
  });

  const availableMetrics = useMemo(
    () =>
      metrics?.map((metric) => ({
        title: metric?.title,
        description: metric?.description,
        metricId: metric?.identifier,
      })) ?? [],
    [metrics],
  );

  const [ballotToSubmit, setBallotToSubmit] = useState<BallotValues[]>([]);

  const handleFormChange = useCallback((values: BallotValues[]) => {
    const ballot = values.map(({ metricId, amount }) => ({
      metricIdentifier: metricId,
      voteShare: amount ?? 0,
    }));
    if (!isEqual(ballot, currentBallot)) {
      setCurrentBallot(ballot);
    }
  }, []);

  const alredySubmittedBallot = useMemo(() => {
    const ballot = voteResponse?.ballot.map((vote) => ({
      metricId: vote.metricIdentifier,
      amount: vote.voteShare,
      name:
        metrics?.find((metric) => metric.identifier === vote.metricIdentifier)?.title ??
        "Unknown metric name",
    }));
    const submittedAt = voteResponse?.updatedAt?.toString();
    if (ballot && submittedAt) {
      return {
        ballot,
        submittedAt,
      };
    }
  }, [voteResponse, metrics]);

  const handleSubmit = async (values: BallotValues[]) => {
    if (roundId && chainId && walletClient) {
      if (!walletClient) {
        throw new Error("Wallet client not found");
      }

      const alloPoolId = roundId;
      const hash = await getDeterministicObjHash({ alloPoolId, chainId: chainId });
      const signature = await walletClient.signMessage({ message: hash });
      const voter = address as Hex;
      const ballot = values.map(({ metricId, amount }) => ({
        metricIdentifier: metricId,
        voteShare: amount ?? 0,
      }));
      const voteBody: RetroVoteBody = {
        alloPoolId,
        chainId,
        voter,
        signature: signature,
        ballot,
      };
      await voteMutation.mutateAsync(voteBody, {
        onSuccess: () => {
          toast({
            status: "success",
            description: "Vote submitted successfully",
          });
          refetchVote();
        },
        onError: (error) => {
          toast({
            status: "error",
            description: `Failed to submit vote\n${error}`,
          });
        },
      });
    } else {
      toast({
        status: "error",
        description: "Round or chainId is not defined",
      });
    }
  };

  if (voteIsLoading || roundIsLoading || metricsIsLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  if (!address) {
    return <Home />;
  }

  return (
    <div className="flex justify-center gap-12 overflow-x-auto px-20 pt-[52px]">
      <SumbitBalllotDialog
        isOpen={isSubmitBallotDialogOpen}
        onOpenChange={setIsSubmitBallotDialogOpen}
        modalTitle="Submit your ballot"
        modalDescription="Once your ballot is submitted, no further changes can be made. Please review it carefully before submitting."
        buttonText="Submit ballot"
        onSubmit={() => {
          handleSubmit(ballotToSubmit);
          setIsSubmitBallotDialogOpen(false);
        }}
      />
      <BallotForm
        className="max-w-[1000px] overflow-x-auto"
        name={`${address}-${roundId}-${chainId}`}
        availableMetrics={availableMetrics}
        maxAllocation={100}
        onChange={handleFormChange}
        onSubmit={(values) => {
          setBallotToSubmit(values);
          setIsSubmitBallotDialogOpen(true);
        }}
        submittedBallot={alredySubmittedBallot}
      />
      <VoteSidebar
        isLoading={roundIsLoading || metricsIsLoading}
        poolId={roundId}
        chainId={chainId}
        ballot={currentBallot}
      />
    </div>
  );
};
