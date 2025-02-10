import { useQuery } from "@tanstack/react-query";

export const useGetFormValues = (getValues: () => Promise<Record<string, any>>) => {
  return useQuery({
    queryKey: ["formValues"],
    queryFn: getValues,
    refetchOnMount: true,
  });
};
