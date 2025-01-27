import { useQuery } from "@tanstack/react-query";
import { getPool } from "@/services/backend/dataLayer";

export const useGetPool = (alloPoolId: string, chainId: number) => {
  const query = useQuery({
    queryKey: ["pool", alloPoolId, chainId],
    queryFn: async () => await getPool(alloPoolId, chainId),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
