import { useState, useEffect, useMemo } from "react";
import { Registry } from "@allo-team/allo-v2-sdk";
import { useMutation } from "@tanstack/react-query";
import { ProgressStatus } from "gitcoin-ui";
import { Address, createPublicClient, http } from "viem";
import { useWalletClient } from "wagmi";
import { uploadData } from "@/services/ipfs/upload";
import { targetNetworks } from "@/services/web3/chains";
import { waitUntilIndexerSynced, getCreateProgramProgressSteps } from "../utils";

export type CreateProgramParams = {
  chainId: number;
  programName: string;
  members: Address[];
};

export const useCreateProgram = () => {
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

  const createProgramMutation = useMutation({
    mutationFn: async ({ chainId, programName, members }: CreateProgramParams) => {
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

      const programMetadata = {
        name: programName,
        type: "program",
      };

      const programMetadataIpfs = await uploadData(programMetadata);

      if (programMetadataIpfs.type === "error") {
        setUploadMetadataStatus(ProgressStatus.IS_ERROR);
        return { status: "error", error: new Error("Failed to upload program metadata to IPFS") };
      }

      setUploadMetadataStatus(ProgressStatus.IS_SUCCESS);

      const programMetadataIpfsCid = programMetadataIpfs.value;

      const registry = new Registry({
        chain: chainId,
      });

      const nonce = BigInt(Math.floor(Math.random() * 1000000000));

      const txData = registry.createProfile({
        nonce,
        name: programName,
        metadata: { protocol: 1n, pointer: programMetadataIpfsCid },
        owner: account.address,
        members,
      });

      setContractUpdatingStatus(ProgressStatus.IN_PROGRESS);

      let txHash;

      try {
        txHash = await walletClient.sendTransaction({
          account: account,
          to: registry.address(),
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
    if (createProgramMutation.isSuccess) {
      setContractUpdatingStatus(ProgressStatus.NOT_STARTED);
      setIndexingStatus(ProgressStatus.NOT_STARTED);
      setFinishingStatus(ProgressStatus.NOT_STARTED);
      createProgramMutation.reset();
    }
  }, [createProgramMutation]);

  const steps = useMemo(() => {
    return getCreateProgramProgressSteps({
      uploadMetadataStatus,
      contractUpdatingStatus,
      indexingStatus,
      finishingStatus,
    });
  }, [uploadMetadataStatus, contractUpdatingStatus, indexingStatus, finishingStatus]);

  return {
    steps,
    createProgramMutation,
  };
};
