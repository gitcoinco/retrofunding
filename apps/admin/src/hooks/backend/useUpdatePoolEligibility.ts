import { useMutation } from "@tanstack/react-query";
import { useWalletClient } from "wagmi";
import { updatePoolEligibility } from "@/services/backend/api";
import { UpdatePoolEligibilityBody } from "@/types";
import { getDeterministicObjectKeccakHash } from "@/utils";

export const useUpdatePoolEligibility = () => {
  const { data: walletClient } = useWalletClient();
  return useMutation({
    mutationFn: async (body: Omit<UpdatePoolEligibilityBody, "signature">) => {
      if (!walletClient) throw new Error("Wallet client not found");
      const signature = await walletClient.signMessage({
        message: {
          raw: await getDeterministicObjectKeccakHash({
            alloPoolId: body.alloPoolId,
            chainId: body.chainId,
          }),
        },
      });
      return await updatePoolEligibility({ ...body, signature });
    },
  });
};
