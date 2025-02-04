import { useQuery } from "@tanstack/react-query";
import { predictDistribution } from "@/services/backend";
import { RetroVote } from "@/types";

interface PredictDistributionParams {
  poolId?: string;
  chainId?: number;
  ballot?: RetroVote[];
}

export const usePredictDistribution = ({ poolId, chainId, ballot }: PredictDistributionParams) => {
  const hasRequiredParams = Boolean(
    poolId &&
    chainId &&
    ballot
  );

  return useQuery({
    queryKey: ["predictDistribution", { poolId, chainId, ballot }],
    queryFn: () => {
      return predictDistribution({
        alloPoolId: poolId!,
        chainId: chainId!,
        ballot: ballot!,
      });
    },
    enabled: hasRequiredParams,
  });
};
