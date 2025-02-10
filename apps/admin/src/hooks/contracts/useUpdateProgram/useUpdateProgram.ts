import { Registry, TransactionData } from "@allo-team/allo-v2-sdk";
import { useMutation } from "@tanstack/react-query";
import { Address, Hex } from "viem";
import { useAccount } from "wagmi";
import { useContractInteraction } from "../useContractInteraction";
import { getUpdateProgramProgressSteps } from "../utils/updateProgramSteps";

export type UpdateProgramParams = {
  chainId: number;
  programId: Hex;
  membersToRemove: Address[];
  membersToAdd: Address[];
  newName?: string;
};

export const useUpdateProgram = () => {
  const { address: accountAddress } = useAccount();

  const { steps, contractInteractionMutation } = useContractInteraction();

  const updateProgramMutation = useMutation({
    mutationFn: async ({
      chainId,
      programId,
      membersToRemove,
      membersToAdd,
      newName,
    }: UpdateProgramParams) => {
      const registry = new Registry({
        chain: chainId,
      });

      if (!registry || !accountAddress) throw new Error("Registry or account not found");

      return contractInteractionMutation.mutateAsync({
        chainId,
        transactionsData: async () => {
          const txDatas: (TransactionData & { skip?: boolean })[] = [];
          if (newName) {
            txDatas.push(
              registry.updateProfileName({
                profileId: programId,
                name: newName,
              }),
            );
          }
          if (membersToRemove.length > 0) {
            txDatas.push(
              registry.removeMembers({
                profileId: programId,
                members: membersToRemove,
              }),
            );
          }
          if (membersToAdd.length > 0) {
            txDatas.push(
              registry.addMembers({
                profileId: programId,
                members: membersToAdd,
              }),
            );
          }
          // Skip all but keep the last transaction to wait for the indexer
          // to update the latest changes in the program
          txDatas.forEach((txData, index) => {
            if (index !== txDatas.length - 1) {
              txData.skip = true;
            }
          });
          return txDatas;
        },
        getProgressSteps: getUpdateProgramProgressSteps,
      });
    },
  });

  return { steps, updateProgramMutation };
};
