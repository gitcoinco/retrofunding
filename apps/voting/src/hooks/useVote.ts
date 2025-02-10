import { useMutation } from "@tanstack/react-query";
import { vote } from "@/services/backend/api";
import { RetroVoteBody } from "@/types";

export type VoteParams = {
  data: RetroVoteBody;
};

export const useVote = () => {
  const voteMutation = useMutation({
    mutationFn: async (data: RetroVoteBody) => {
      return vote(data)
    },
  });

  return { voteMutation };
};
