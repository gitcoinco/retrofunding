import { useQuery } from "@tanstack/react-query";
import { calculatePool } from "@/services/backend/api";
import { getPoolDistribution } from "@/services/backend/dataLayer";

export const usePoolDistribution = (
  alloPoolId: string,
  chainId: number,
  canSyncDistribution: boolean,
) => {
  return useQuery({
    queryKey: ["poolDistribution", alloPoolId, chainId],
    queryFn: async () => {
      // First sync the pool votes then get the up to date distribution
      // Can sync distribution if no payout has been made yet
      try {
        if (canSyncDistribution) {
          await calculatePool({ alloPoolId, chainId });
        }
      } catch (error) {
        console.error("Error calculating pool:", error);
      }
      const distribution = await getPoolDistribution(alloPoolId, chainId);
      return distribution;
    },
  });
};
