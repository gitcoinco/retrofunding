import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Hex } from "viem";
import { getVote } from "@/services/backend/dataLayer";
import { RetroVote } from "@/types";

export const useGetVote = ({
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
}): UseQueryResult<{ updatedAt: Date; ballot: RetroVote[] }, Error> => {
  return useQuery({
    enabled: enabled && !!alloPoolId && !!chainId && !!address,
    queryKey: ["getVote", alloPoolId, chainId, address],
    queryFn: async () => getVote(alloPoolId, chainId, address),
    select: (data) => ({
      ballot: JSON.parse(data.votes?.[0]?.ballot ?? "[]"),
      updatedAt: data.votes?.[0]?.updatedAt,
    }),
    staleTime: 1000 * 60 * 10,
    retry,
  });
};
