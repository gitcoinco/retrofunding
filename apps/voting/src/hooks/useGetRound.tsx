import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getRound } from "@/services/allo-indexer/dataLayer";
import { RetroRound } from "@/types";

export const useGetRound = ({
  roundId,
  chainId,
}: {
  roundId: string;
  chainId: number;
}): UseQueryResult<RetroRound, Error> => {
  return useQuery({
    enabled: !!roundId && !!chainId,
    queryKey: ["round", roundId, chainId],
    queryFn: () => getRound({ roundId, chainId }),
  });
};
