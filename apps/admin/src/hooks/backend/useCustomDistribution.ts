import { useMutation } from "@tanstack/react-query";
import { useWalletClient } from "wagmi";
import { deleteCustomDistribution, updateCustomDistribution } from "@/services/backend/api";
import { UpdateCustomDistributionBody, DeleteCustomDistributionBody } from "@/types";
import { getDeterministicObjectKeccakHash } from "@/utils";

export const useUpdateCustomDistribution = () => {
  const { data: walletClient } = useWalletClient();
  return useMutation({
    mutationFn: async (body: Omit<UpdateCustomDistributionBody, "signature">) => {
      if (!walletClient) throw new Error("Wallet client not found");
      const signature = await walletClient.signMessage({
        message: await getDeterministicObjectKeccakHash({
          alloPoolId: body.alloPoolId,
          chainId: body.chainId,
        }),
      });
      return await updateCustomDistribution({ ...body, signature });
    },
  });
};

export const useDeleteCustomDistribution = () => {
  const { data: walletClient } = useWalletClient();
  return useMutation({
    mutationFn: async (body: Omit<DeleteCustomDistributionBody, "signature">) => {
      if (!walletClient) throw new Error("Wallet client not found");
      const signature = await walletClient.signMessage({
        message: await getDeterministicObjectKeccakHash({
          alloPoolId: body.alloPoolId,
          chainId: body.chainId,
        }),
      });
      return await deleteCustomDistribution({ ...body, signature });
    },
  });
};
