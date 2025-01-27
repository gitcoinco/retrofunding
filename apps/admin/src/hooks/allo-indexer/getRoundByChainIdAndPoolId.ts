import { useQuery } from "@tanstack/react-query";
import { getRoundByChainIdAndPoolId } from "@/services/allo-indexer/dataLayer";

export const useGetRoundByChainIdAndPoolId = (chainId: number, poolId: string) => {
  return useQuery({
    queryKey: ["round", chainId, poolId],
    queryFn: () => getRoundByChainIdAndPoolId(chainId, poolId),
  });
};
