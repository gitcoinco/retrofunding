import { useState, useEffect, useMemo, useRef } from "react";
import { TransactionData } from "@allo-team/allo-v2-sdk";
import { ProgressStatus, Step } from "@gitcoin/ui/types";
import { useSafeAppsSDK } from "@safe-global/safe-apps-react-sdk";
import { useMutation } from "@tanstack/react-query";
import { createPublicClient, http, TransactionReceipt } from "viem";
import { useWalletClient } from "wagmi";
import { useCheckIsSafeWallet } from "@/hooks";
import { uploadData } from "@/services/ipfs/upload";
import { targetNetworks } from "@/services/web3/chains";
import { waitUntilIndexerSynced } from "../utils/indexer";

interface GetProgressSteps {
  (args: {
    uploadMetadataStatus: ProgressStatus;
    contractUpdatingStatus: ProgressStatus;
    indexingStatus: ProgressStatus;
    finishingStatus: ProgressStatus;
  }): Step[];
}

export const useContractInteraction = () => {
  const { sdk } = useSafeAppsSDK();

  const [uploadMetadataStatus, setUploadMetadataStatus] = useState<ProgressStatus>(
    ProgressStatus.NOT_STARTED,
  );
  const [contractUpdatingStatus, setContractUpdatingStatus] = useState<ProgressStatus>(
    ProgressStatus.NOT_STARTED,
  );
  const [indexingStatus, setIndexingStatus] = useState<ProgressStatus>(ProgressStatus.NOT_STARTED);
  const [finishingStatus, setFinishingStatus] = useState<ProgressStatus>(
    ProgressStatus.NOT_STARTED,
  );
  const [steps, setSteps] = useState<Step[]>([]);

  const { data: walletClient } = useWalletClient();

  const getProgressStepsRef = useRef<GetProgressSteps | null>(null);

  const isSafeWallet = useCheckIsSafeWallet();

  useMemo(() => {
    if (getProgressStepsRef.current) {
      setSteps(
        getProgressStepsRef.current({
          uploadMetadataStatus,
          contractUpdatingStatus,
          indexingStatus,
          finishingStatus,
        }),
      );
    }
  }, [uploadMetadataStatus, contractUpdatingStatus, indexingStatus, finishingStatus]);

  const contractInteractionMutation = useMutation({
    mutationFn: async ({
      chainId,
      metadata,
      transactionsData,
      getProgressSteps,
      postIndexerHook,
    }: {
      chainId: number;
      metadata?: any;
      transactionsData: (metadataCid?: string) => Promise<
        (TransactionData & {
          skip?: boolean;
        })[]
      >;
      getProgressSteps: ({
        uploadMetadataStatus,
        contractUpdatingStatus,
        indexingStatus,
        finishingStatus,
      }: {
        uploadMetadataStatus: ProgressStatus;
        contractUpdatingStatus: ProgressStatus;
        indexingStatus: ProgressStatus;
        finishingStatus: ProgressStatus;
      }) => Step[];
      postIndexerHook?: (receipt: TransactionReceipt) => Promise<void>;
    }) => {
      if (!walletClient) {
        throw new Error("WalletClient is undefined");
      }

      if (walletClient.chain.id !== chainId) {
        await walletClient.switchChain({ id: chainId });
      }

      const account = walletClient.account;
      if (!account) {
        throw new Error("WalletClient account is undefined");
      }

      getProgressStepsRef.current = getProgressSteps;

      const chain = targetNetworks.find((chain) => chain.id === chainId);
      const publicClient = createPublicClient({
        chain,
        transport: http(),
      });

      let metadataCid: string | undefined = undefined;

      if (metadata) {
        setUploadMetadataStatus(ProgressStatus.IN_PROGRESS);
        const metadataUpload = await uploadData(metadata);

        if (metadataUpload.type === "error") {
          setUploadMetadataStatus(ProgressStatus.IS_ERROR);
          throw new Error("Failed to upload metadata to IPFS");
        }

        metadataCid = metadataUpload.value;
        setUploadMetadataStatus(ProgressStatus.IS_SUCCESS);
      }

      const txDatas = await transactionsData(metadataCid);
      setContractUpdatingStatus(ProgressStatus.IN_PROGRESS);
      let receipt: TransactionReceipt | undefined;

      if (isSafeWallet) {
        const transactions = txDatas.map((txData) => ({
          to: txData.to,
          data: txData.data,
          value: txData.value,
        }));
        const { safeTxHash } = await sdk.txs.send({ txs: transactions });

        console.log(transactions);
      } else {
        for (const txData of txDatas) {
          let txHash;
          try {
            txHash = await walletClient.sendTransaction({
              account,
              to: txData.to,
              data: txData.data,
              value: BigInt(txData.value),
              chain,
            });
          } catch (e) {
            setContractUpdatingStatus(ProgressStatus.IS_ERROR);
            throw new Error("Failed to send transaction");
          }

          receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
          if (!receipt.status || receipt.status === "reverted") {
            setContractUpdatingStatus(ProgressStatus.IS_ERROR);
            throw new Error("Transaction failed");
          }

          if (!txData.skip) {
            setContractUpdatingStatus(ProgressStatus.IS_SUCCESS);

            setIndexingStatus(ProgressStatus.IN_PROGRESS);

            try {
              await waitUntilIndexerSynced({
                chainId,
                blockNumber: receipt.blockNumber,
              });
            } catch (e) {
              setIndexingStatus(ProgressStatus.IS_ERROR);
              throw new Error("Failed to sync with indexer");
            }
          }
        }
      }

      if (postIndexerHook && receipt) {
        await postIndexerHook(receipt);
      }

      setIndexingStatus(ProgressStatus.IS_SUCCESS);
      setFinishingStatus(ProgressStatus.IN_PROGRESS);
      setFinishingStatus(ProgressStatus.IS_SUCCESS);
    },
  });

  useEffect(() => {
    if (contractInteractionMutation.isSuccess) {
      setContractUpdatingStatus(ProgressStatus.NOT_STARTED);
      setIndexingStatus(ProgressStatus.NOT_STARTED);
      setFinishingStatus(ProgressStatus.NOT_STARTED);
      contractInteractionMutation.reset();
    }
  }, [contractInteractionMutation]);

  return {
    steps,
    contractInteractionMutation,
  };
};
