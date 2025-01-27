import { useQuery } from "@tanstack/react-query";
import { getMetrics } from "@/services/backend/dataLayer";

export const useGetMetrics = () => {
  const query = useQuery({
    queryKey: ["getMetrics"],
    queryFn: async () => {
      const metrics = await getMetrics();
      return metrics;
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
