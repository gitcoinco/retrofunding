import { Allo } from "@allo-team/allo-v2-sdk";
import { getChainById } from "@gitcoin/gitcoin-chain-data";
import { useMutation } from "@tanstack/react-query";
import { uploadData } from "@/services/ipfs/upload";
import { MappedRoundMetadata } from "@/utils/transformRoundMetadata";
import { useContractInteraction } from "../useContractInteraction/useContractInteraction";
import { getUpdateRoundProgressSteps } from "../utils/updateRoundSteps";

export type UpdateRoundMetadataParams = {
  data: MappedRoundMetadata;
  poolId: bigint;
};

export const useUpdateRoundMetadata = () => {
  const { steps, contractInteractionMutation } = useContractInteraction();

  const updateRoundMetadataMutation = useMutation({
    mutationFn: async ({ data, poolId }: UpdateRoundMetadataParams) => {
      const chainId = data.round.retroFundingConfig.program.chainId;
      const roundImageIpfs = await uploadData(data.round.retroFundingConfig.coverImage);

      if (roundImageIpfs.type === "error") {
        throw new Error("Failed to upload round image to IPFS");
      }

      const metadataWithRoundImage = {
        ...data,
        round: {
          ...data.round,
          retroFundingConfig: {
            ...data.round.retroFundingConfig,
            coverImage: roundImageIpfs.value,
          },
        },
      };

      return contractInteractionMutation.mutateAsync({
        chainId,
        metadata: metadataWithRoundImage,
        transactionData: async (metadataCid?: string) => {
          const allo = new Allo({
            chain: chainId,
          });

          const strategyAddress = getChainById(chainId).contracts.retroFunding;

          if (!strategyAddress) {
            throw new Error("Strategy address is undefined for chainId: " + chainId);
          }

          if (!metadataCid) throw new Error("Metadata CID is required");

          return allo.updatePoolMetadata({
            poolId,
            metadata: { protocol: 1n, pointer: metadataCid },
          });
        },
        getProgressSteps: getUpdateRoundProgressSteps,
      });
    },
  });

  return { steps, updateRoundMetadataMutation };
};
