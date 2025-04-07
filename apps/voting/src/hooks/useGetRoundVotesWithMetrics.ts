import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Hex } from "viem";
import { getRoundVotesWithMetrics } from "@/services/backend/dataLayer";
import { RetroVote } from "@/types";

const getBallot = (ballot: string, voter: Hex, voterWeights: Record<Hex, number>) => {
  const parsedBallot = JSON.parse(ballot) as RetroVote[];
  return parsedBallot.map((vote) => ({
    ...vote,
    voteShare: vote.voteShare * (voterWeights[voter] ?? 0),
  }));
};

export const useGetRoundVotesWithMetrics = ({
  alloPoolId,
  chainId,
  retry,
  enabled = true,
}: {
  alloPoolId: string;
  chainId: number;
  retry?: boolean;
  enabled?: boolean;
}): UseQueryResult<
  { metricIdentifiers: string[]; votes: { updatedAt: Date; ballot: RetroVote[] }[] },
  Error
> => {
  return useQuery({
    enabled: enabled && !!alloPoolId && !!chainId,
    queryKey: ["getVotes", alloPoolId, chainId],
    queryFn: async () => getRoundVotesWithMetrics(alloPoolId, chainId),
    select: (data) => {
      const { metricIdentifiers, votes, eligibilityCriteria } = data.pools[0];
      const { data: eligibilityData } = eligibilityCriteria;
      const { voters } = eligibilityData as { voters: string[] | Record<Hex, number> };

      if (voters && Array.isArray(voters)) {
        return {
          metricIdentifiers: metricIdentifiers.split(","),
          votes: votes.map((vote) => ({
            updatedAt: vote.updatedAt,
            ballot: JSON.parse(vote.ballot ?? "[]"),
          })),
        };
      }
      const voterWeights = voters as Record<Hex, number>;
      return {
        metricIdentifiers: metricIdentifiers.split(","),
        votes: votes.map((vote) => ({
          updatedAt: vote.updatedAt,
          ballot: getBallot(vote.ballot, vote.voter, voterWeights),
        })),
      };
    },
    staleTime: 1000 * 60 * 10,
    retry,
  });
};
