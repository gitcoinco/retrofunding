import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getRoundVotesWithMetrics } from "@/services/backend/dataLayer";
import { RetroVote } from "@/types";

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
      const { metricIdentifiers, votes } = data.pools[0];
      return {
        metricIdentifiers: metricIdentifiers.split(","),
        votes: votes.map((vote) => ({
          updatedAt: vote.updatedAt,
          ballot: JSON.parse(vote.ballot ?? "[]"),
        })),
      };
    },
    staleTime: 1000 * 60 * 10,
    retry,
  });
};
