import { useQuery } from "@tanstack/react-query";
import { getRolesByChainIdAndPoolId } from "@/services/allo-indexer/dataLayer";

export const useGetRolesByChainIdAndPoolId = (chainId: number, poolId: string) => {
  return useQuery({
    queryKey: ["roles", chainId, poolId],
    queryFn: () => getRolesByChainIdAndPoolId(chainId, poolId),
  });
};
