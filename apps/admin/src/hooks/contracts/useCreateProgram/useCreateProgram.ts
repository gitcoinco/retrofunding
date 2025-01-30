import { Registry } from "@allo-team/allo-v2-sdk";
import { useMutation } from "@tanstack/react-query";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { getCreateProgramProgressSteps } from "@/hooks";
import { useContractInteraction } from "../useContractInteraction/useContractInteraction";

export type CreateProgramParams = {
  chainId: number;
  programName: string;
  members: Address[];
};

export const useCreateProgram = () => {
  const { address: accountAddress } = useAccount();

  const { steps, contractInteractionMutation } = useContractInteraction();

  const createProgramMutation = useMutation({
    mutationFn: async ({ chainId, programName, members }: CreateProgramParams) => {
      const registry = new Registry({
        chain: chainId,
      });

      if (!registry || !accountAddress) throw new Error("Registry or account not found");

      return contractInteractionMutation.mutateAsync({
        chainId,
        metadata: {
          name: programName,
          type: "program",
        },
        transactionData: async (metadataCid?: string) => {
          if (!metadataCid) throw new Error("Metadata CID is required");
          const nonce = BigInt(Math.floor(Math.random() * 1000000000));

          return registry.createProfile({
            nonce,
            name: programName,
            metadata: { protocol: 1n, pointer: metadataCid },
            owner: accountAddress,
            members,
          });
        },
        getProgressSteps: getCreateProgramProgressSteps,
      });
    },
  });

  return { steps, createProgramMutation };
};
