import { useQuery } from "@tanstack/react-query";
import { getDataToCalculateDistribution } from "@/services/backend/api";
import { PreparedCalculationData } from "@/types/backend";

export const useGetDataToCalculateDistribution = (
  alloPoolId?: string,
  chainId?: number,
  enabled?: boolean,
) => {
  return useQuery<PreparedCalculationData, Error>({
    enabled,
    queryKey: ["dataToCalculateDistribution", alloPoolId, chainId],
    queryFn: () => getDataToCalculateDistribution({ alloPoolId, chainId }),
  });
};
