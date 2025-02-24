import { useQuery } from "@tanstack/react-query";
import { config } from "@/config";
import { getProgramsAndRoundsByUser } from "@/services/allo-indexer/dataLayer";

export const useGetUserProgramsAndRounds = (userAddress?: string) => {
  return useQuery({
    enabled: !!userAddress,
    queryKey: ["userProgramsAndRounds", userAddress],
    queryFn: () => getProgramsAndRoundsByUser(userAddress, config.availableNetworks),
  });
};
