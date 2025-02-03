import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getMetrics } from "@/services/backend/dataLayer";
import { Metric } from "@/types";

export const useGetMetrics = ({
  identifiers,
  enabled = true,
}: {
  identifiers?: string[];
  enabled?: boolean;
}): UseQueryResult<Metric[], Error> => {
  return useQuery({
    enabled,
    queryKey: ["metrics", identifiers],
    queryFn: () => getMetrics({ identifiers }),
  });
};
