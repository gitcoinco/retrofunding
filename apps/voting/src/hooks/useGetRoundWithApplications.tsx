import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getRoundWithApplications } from "@/services/allo-indexer/dataLayer";
import { RetroRoundWithApplications } from "@/types";
import { mapRoundWithApplications } from "@/utils/mapRoundWithApplications";

export const useGetRoundWithApplications = ({
  roundId,
  chainId,
  retry,
  enabled = true,
}: {
  roundId?: string;
  chainId?: number;
  retry?: boolean;
  enabled?: boolean;
}): UseQueryResult<RetroRoundWithApplications, Error> => {
  return useQuery({
    enabled: enabled && !!roundId && !!chainId,
    queryKey: ["getRoundWithApplications", roundId, chainId],
    queryFn: () => getRoundWithApplications({ roundId: roundId!, chainId: chainId! }),
    select: (data) => mapRoundWithApplications(data),
    staleTime: 1000 * 60 * 10,
    retry,
  });
};
