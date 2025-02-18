import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Hex } from "viem";
import { getVoters } from "@/services/backend/dataLayer";

export const useIsVoter = ({
  alloPoolId,
  chainId,
  address,
  retry,
  enabled = true,
}: {
  alloPoolId: string;
  chainId: number;
  address: Hex;
  retry?: boolean;
  enabled?: boolean;
}): UseQueryResult<{ isVoter: boolean }, Error> => {
  return useQuery({
    enabled: enabled && !!alloPoolId && !!chainId && !!address,
    queryKey: ["getVoters", alloPoolId, chainId, address],
    queryFn: async () => {
      const voters = await getVoters(alloPoolId, chainId);
      const isVoter = voters.some((voter) => voter.toLowerCase() === address.toLowerCase());
      return { isVoter };
    },
    retry,
  });
};
