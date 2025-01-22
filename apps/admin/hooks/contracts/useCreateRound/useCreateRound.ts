import { useState, useEffect, useMemo } from "react";
import { Allo } from "@allo-team/allo-v2-sdk";
import { useMutation } from "@tanstack/react-query";
import { ProgressStatus } from "gitcoin-ui";
import { Address, createPublicClient, http } from "viem";
import { useWalletClient } from "wagmi";
import { uploadData } from "@/services/ipfs/upload";
import { targetNetworks } from "@/services/web3/chains";
import { waitUntilIndexerSynced, getCreateRoundProgressSteps } from "../utils";

export type CreateRoundParams = {
  chainId: number;
  // Add round creation params here
};

export const useCreateRound = () => {
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

  const { data: walletClient } = useWalletClient();

  const createRoundMutation = useMutation({
    mutationFn: async ({ chainId }: CreateRoundParams) => {
      if (!walletClient) {
        throw new Error("WalletClient is undefined");
      }
      if (walletClient.chain.id !== chainId) {
        await walletClient.switchChain({
          id: chainId,
        });
      }

      const chain = targetNetworks.find((chain) => chain.id === chainId);

      const account = walletClient.account;
      if (!account) {
        throw new Error("WalletClient account is undefined");
      }

      const publicClient = createPublicClient({
        chain,
        transport: http(),
      });

      const roundMetadata = {};
      const roundMetadataIpfs = await uploadData(roundMetadata);

      if (roundMetadataIpfs.type === "error") {
        setUploadMetadataStatus(ProgressStatus.IS_ERROR);
        return { status: "error", error: new Error("Failed to upload round metadata to IPFS") };
      }

      setUploadMetadataStatus(ProgressStatus.IS_SUCCESS);

      const roundMetadataIpfsCid = roundMetadataIpfs.value;

      const allo = new Allo({
        chain: chainId,
      });

      const nonce = BigInt(Math.floor(Math.random() * 1000000000));

      // const txData = allo.createRound({});
      // TODO: Implement this
      const txData = {
        data: "0x" as Address,
      };

      setContractUpdatingStatus(ProgressStatus.IN_PROGRESS);

      let txHash;

      try {
        txHash = await walletClient.sendTransaction({
          account: account,
          to: allo.address(),
          data: txData.data,
          chain: chain,
        });
      } catch (e) {
        console.log(e);
        setContractUpdatingStatus(ProgressStatus.IS_ERROR);
        throw new Error("Failed to update application status");
      }

      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

      if (!receipt.status) {
        setContractUpdatingStatus(ProgressStatus.IS_ERROR);
        throw new Error("Failed to update application status");
      }

      setContractUpdatingStatus(ProgressStatus.IS_SUCCESS);
      setIndexingStatus(ProgressStatus.IN_PROGRESS);

      // Wait until indexer is synced
      try {
        await waitUntilIndexerSynced({
          chainId,
          blockNumber: receipt.blockNumber,
        });
      } catch (e) {
        console.error(e);
        setIndexingStatus(ProgressStatus.IS_ERROR);
      }

      setIndexingStatus(ProgressStatus.IS_SUCCESS);

      setFinishingStatus(ProgressStatus.IN_PROGRESS);

      setFinishingStatus(ProgressStatus.IS_SUCCESS);
    },
  });

  useEffect(() => {
    if (createRoundMutation.isSuccess) {
      setContractUpdatingStatus(ProgressStatus.NOT_STARTED);
      setIndexingStatus(ProgressStatus.NOT_STARTED);
      setFinishingStatus(ProgressStatus.NOT_STARTED);
      createRoundMutation.reset();
    }
  }, [createRoundMutation]);

  const steps = useMemo(() => {
    return getCreateRoundProgressSteps({
      uploadMetadataStatus,
      contractUpdatingStatus,
      indexingStatus,
      finishingStatus,
    });
  }, [uploadMetadataStatus, contractUpdatingStatus, indexingStatus, finishingStatus]);

  return {
    steps,
    createRoundMutation,
  };
};
