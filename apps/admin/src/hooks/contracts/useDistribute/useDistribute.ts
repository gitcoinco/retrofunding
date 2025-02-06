import { EasyRetroFundingStrategy, TransactionData } from "@allo-team/allo-v2-sdk";
import { useMutation } from "@tanstack/react-query";
import { Address, getAddress } from "viem";
import { uploadData } from "@/services/ipfs/upload";
import { targetNetworks } from "@/services/web3/chains";
import { useContractInteraction } from "../useContractInteraction";
import { getDistributeProgressSteps } from "../utils/distributeSteps";

export type DistributeParams = {
  distributionData: {
    anchorAddress: Address;
    payoutAddress: Address;
    amount: string;
    index: number;
  }[];

  data: { anchorAddress: Address; amount: bigint; index: number }[];
  poolId: string;
  chainId: number;
  strategyAddress: Address;
};

export const useDistribute = () => {
  const { steps, contractInteractionMutation } = useContractInteraction();

  const distributeMutation = useMutation({
    mutationFn: async ({
      distributionData,
      data,
      chainId,
      poolId,
      strategyAddress,
    }: DistributeParams) => {
      const retroFunding = new EasyRetroFundingStrategy({
        chain: chainId,
        poolId: BigInt(poolId),
        address: getAddress(strategyAddress),
        rpc: targetNetworks.find((network) => network.id === chainId)?.rpcUrls.public.http[0],
      });

      const distributionMetadata = (await retroFunding.getDistributionMetadata()) as any;
      // TODO: check if there are distribution metadata while no distributions occured
      // Compare the metadata and if not the same update again the distribution metadata
      const firstTime = distributionMetadata[1] == "";
      const txData = retroFunding.distribute(
        data.map((application) => getAddress(application.anchorAddress)),
        data.map((application) => ({
          recipientId: getAddress(application.anchorAddress),
          index: BigInt(application.index),
          amount: application.amount,
        })),
      );
      return contractInteractionMutation.mutateAsync({
        chainId,
        transactionsData: async () => {
          const txDatas: (TransactionData & { skip?: boolean })[] = [];

          if (firstTime) {
            const jsonDataFile = new File([JSON.stringify(distributionData)], "distribution.json", {
              type: "application/json",
            });
            const distributionMetadataIpfs = await uploadData(jsonDataFile);
            if (distributionMetadataIpfs.type === "error") {
              throw new Error("Failed to upload distribution metadata to IPFS");
            }
            const distributionMetadataCid = distributionMetadataIpfs.value;
            console.log("distributionMetadataCid", distributionMetadataCid);
            txDatas.push({
              ...retroFunding.updateDistribution({
                protocol: BigInt(1),
                pointer: distributionMetadataCid,
              }),
              skip: true,
            });
          }
          txDatas.push(txData);

          return txDatas;
        },
        getProgressSteps: getDistributeProgressSteps,
      });
    },
  });

  return { steps, distributeMutation };
};
