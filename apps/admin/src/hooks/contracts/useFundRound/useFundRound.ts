import { Allo, EasyRetroFundingStrategy, NATIVE, TransactionData } from "@allo-team/allo-v2-sdk";
import { useMutation } from "@tanstack/react-query";
import { Address, encodeFunctionData, erc20Abi, Hex } from "viem";
import { useContractInteraction } from "../useContractInteraction";
import { getFundRoundProgressSteps } from "../utils/fundRoundSteps";

export type FundRoundParams = {
  amount: bigint;
  poolId: string;
  chainId: number;
};

export const useFundRound = (tokenAddress: Hex) => {
  const { steps, contractInteractionMutation } = useContractInteraction();

  const isNative = tokenAddress.toLowerCase() === NATIVE.toLowerCase();

  const fundRoundMutation = useMutation({
    mutationFn: async ({ amount, poolId, chainId }: FundRoundParams) => {
      return contractInteractionMutation.mutateAsync({
        chainId,
        transactionsData: async () => {
          const txDatas: (TransactionData & { skip?: boolean })[] = [];
          const allo = new Allo({
            chain: chainId,
          });

          const alloAddress = allo.address();

          const retroFunding = new EasyRetroFundingStrategy({
            chain: chainId,
            poolId: BigInt(poolId),
          });

          let fundPoolTxData = retroFunding.fundPool(amount);

          if (!isNative) {
            txDatas.push({
              to: tokenAddress as Address,
              data: encodeFunctionData({
                abi: erc20Abi,
                functionName: "approve",
                args: [alloAddress, amount],
              }),
              value: "0",
              skip: true,
            });
            txDatas.push(fundPoolTxData);
          } else {
            txDatas.push({ ...fundPoolTxData, value: amount.toString() });
          }

          return txDatas;
        },
        getProgressSteps: getFundRoundProgressSteps,
      });
    },
  });

  return { steps, fundRoundMutation };
};
