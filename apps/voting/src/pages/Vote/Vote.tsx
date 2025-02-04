import { useCallback, useMemo } from "react";
import { useState } from "react";
import { useParams } from "react-router";
import { useToast } from "@gitcoin/ui/hooks/useToast";
import { MetricsBallot } from "@gitcoin/ui/retrofunding";
import { isEqual } from "lodash";
import { Hex } from "viem";
import { useAccount } from "wagmi";
import { useGetRoundWithApplications, useVote } from "@/hooks";
import { useGetMetrics } from "@/hooks/useGetMetrics";
import { RetroVoteBody, RetroVoteFormData } from "@/types";
import { Home } from "../Home";
import { VoteSidebar } from "./components/VoteSidebar";

export const Vote = () => {
  const { toast } = useToast();
  const [currentBallot, setCurrentBallot] = useState<
    { metricIdentifier: string; voteShare: number }[]
  >([]);

  const { address } = useAccount();
  const { roundId, chainId: chainIdString } = useParams();
  const chainId = parseInt(chainIdString as string);

  const { voteMutation } = useVote();

  const { data: round, isLoading: roundIsLoading } = useGetRoundWithApplications({
    roundId: roundId as string,
    chainId,
  });

  const availableMetricsIds = round?.impactMetrics;

  const { data: metrics, isLoading: metricsIsLoading } = useGetMetrics({
    identifiers: availableMetricsIds,
    enabled: !!availableMetricsIds,
  });

  const availableMetrics = useMemo(
    () =>
      metrics?.map((metric) => ({
        title: metric.title,
        description: metric.description,
        metricId: metric.identifier,
      })) ?? [],
    [metrics],
  );

  const handleFormChange = useCallback((formData: RetroVoteFormData) => {
    const ballot = formData.metrics.map(({ metricId, amount }) => ({
      metricIdentifier: metricId,
      voteShare: amount,
    }));
    if (!isEqual(ballot, currentBallot)) {
      setCurrentBallot(ballot);
    }
  }, []);

  const handleSubmit = ({ metrics }: RetroVoteFormData) => {
    if (roundId && chainId) {
      const alloPoolId = roundId;
      const signature = "0xdeadbeef";
      const voter = address as Hex;
      const ballot = metrics.map(({ metricId, amount }) => ({
        metricIdentifier: metricId,
        voteShare: amount,
      }));
      const voteBody: RetroVoteBody = {
        alloPoolId,
        chainId,
        voter,
        signature,
        ballot,
      };
      voteMutation.mutate(voteBody, {
        onSuccess: () => {
          toast({
            status: "success",
            description: "Vote submitted successfully",
          });
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

  if (!address) {
    return <Home />;
  }

  return (
    <div className="flex justify-center gap-12 px-20 pt-[52px]">
      <MetricsBallot
        className="w-[1000px]"
        name="metrics"
        availableMetrics={availableMetrics}
        maxAllocation={100}
        onSubmit={handleSubmit}
        onFormChange={handleFormChange} // TODO: make it optional in core
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
