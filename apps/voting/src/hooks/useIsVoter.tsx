import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Hex, getAddress } from "viem";
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
    queryKey: ["getIsVoter", alloPoolId, chainId, address],
    queryFn: async () => {
      const voters = (await getVoters(alloPoolId, chainId)) as string[] | Record<Hex, number>;
      if (voters && !Array.isArray(voters)) {
        const voterAddresses = Object.keys(voters) as Hex[];
        const isVoter = voterAddresses.some(
          (voter: Hex) => getAddress(voter) === getAddress(address),
        );
        return { isVoter };
      }
      if (voters && Array.isArray(voters)) {
        const isVoter = (voters as Hex[]).some(
          (voter: Hex) => getAddress(voter) === getAddress(address),
        );
        return { isVoter };
      }
      return { isVoter: false };
    },
    retry,
  });
};
