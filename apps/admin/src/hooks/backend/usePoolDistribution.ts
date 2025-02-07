import { useQuery } from "@tanstack/react-query";
import { getPoolDistribution } from "@/services/backend/dataLayer";

export const usePoolDistribution = (alloPoolId: string, chainId: number) => {
  return useQuery({
    queryKey: ["poolDistribution", alloPoolId, chainId],
    queryFn: async () => await getPoolDistribution(alloPoolId, chainId),
  });
};
