import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Hex } from "viem";
import { getVote } from "@/services/backend/dataLayer";
import { GetVoteResponse } from "@/types";

export const useGetVote = ({
  alloPoolId,
  chainId,
  address,
}: {
  alloPoolId: string;
  chainId: number;
  address: Hex;
}): UseQueryResult<GetVoteResponse, Error> => {
  return useQuery({
    enabled: !!alloPoolId && !!chainId && !!address,
    queryKey: ["getVote", alloPoolId, chainId, address],
    queryFn: async () => {
      const vote = await getVote(alloPoolId, chainId, address);
      return vote;
    },
  });
};
