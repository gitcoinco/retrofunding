import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getVoters } from "@/services/backend/dataLayer";
import { Hex } from "viem";

export const useIsVoter = ({
  alloPoolId,
  chainId,
  address,
}: {
  alloPoolId: string;
  chainId: number;
  address: Hex;
}): UseQueryResult<{ isVoter: boolean }, Error> => {
  return useQuery({
    enabled: !!alloPoolId && !!chainId && !!address,
    queryKey: ["isVoter", alloPoolId, chainId, address],
    queryFn: async () => {
      const voters = await getVoters(alloPoolId, chainId);
      const isVoter = voters.some((voter) => voter === address);
      return {isVoter};
    },
  });
};
