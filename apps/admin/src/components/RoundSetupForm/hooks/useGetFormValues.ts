import { useQuery } from "@tanstack/react-query";

export const useGetFormValues = (getValues: () => Promise<Record<string, any>>) => {
  return useQuery({
    queryKey: ["getCreateRoundSetupFormValues"],
    queryFn: getValues,
    refetchOnMount: true,
  });
};
