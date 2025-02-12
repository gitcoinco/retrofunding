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
    queryKey: ["getMetrics", identifiers],
    queryFn: () => getMetrics(identifiers),
    select: (data) => data.metrics,
    staleTime: 1000 * 60 * 10,
  });
};
