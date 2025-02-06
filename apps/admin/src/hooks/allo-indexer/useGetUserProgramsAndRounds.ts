import { useQuery } from "@tanstack/react-query";
import { config } from "@/config";
import { getProgramsAndRoundsByUserAndTag } from "@/services/allo-indexer/dataLayer";

const tags = ["allo-v2", "program"];

export const useGetUserProgramsAndRounds = (userAddress?: string) => {
  const lowerCaseAddress = userAddress?.toLowerCase();
  return useQuery({
    enabled: !!lowerCaseAddress,
    queryKey: ["userProgramsAndRounds", lowerCaseAddress],
    queryFn: () =>
      getProgramsAndRoundsByUserAndTag(lowerCaseAddress, config.availableNetworks, tags),
  });
};
