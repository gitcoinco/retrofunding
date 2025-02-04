import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getRoundWithApplications } from "@/services/allo-indexer/dataLayer";
import { RetroRoundWithApplications  } from "@/types";

export const useGetRoundWithApplications = ({
  roundId,
  chainId,
}: {
  roundId?: string;
  chainId?: number;
}): UseQueryResult<RetroRoundWithApplications, Error> => {
  return useQuery({
    enabled: !!roundId && !!chainId,
    queryKey: ["round", roundId, chainId],
    queryFn: () => getRoundWithApplications({ roundId: roundId!, chainId: chainId! }),
  });
};
