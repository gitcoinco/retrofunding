import { useState, useEffect, useMemo } from "react";
import { Allo, TransactionData } from "@allo-team/allo-v2-sdk";
import { EasyRetroFundingStrategy } from "@allo-team/allo-v2-sdk";
import { InitializeData } from "@allo-team/allo-v2-sdk/dist/strategies/EasyRetroFunding/types";
import { getChainById } from "@gitcoin/gitcoin-chain-data";
import { useMutation } from "@tanstack/react-query";
import { ProgressStatus } from "gitcoin-ui/types";
import moment from "moment-timezone";
import { createPublicClient, Hex, http, zeroAddress } from "viem";
import { useWalletClient } from "wagmi";
import { uploadData } from "@/services/ipfs/upload";
import { targetNetworks } from "@/services/web3/chains";
import { AnyJson, RoundSetupFormData } from "@/types";
import { mapFormDataToRoundMetadata } from "@/utils/transformRoundMetadata";
import { UINT64_MAX } from "@/utils/utils";
import { waitUntilIndexerSynced, getCreateRoundProgressSteps } from "../utils";

export type CreateRoundParams = {
  data: RoundSetupFormData;
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
    mutationFn: async ({ data }: CreateRoundParams) => {
      if (!walletClient) {
        throw new Error("WalletClient is undefined");
      }

      const chainId = data.program.chainId;

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

      const mappedMetadata = mapFormDataToRoundMetadata(data);
      const roundMetadataIpfs = await uploadData(mappedMetadata as unknown as AnyJson);

      if (roundMetadataIpfs.type === "error") {
        setUploadMetadataStatus(ProgressStatus.IS_ERROR);
        return { status: "error", error: new Error("Failed to upload round metadata to IPFS") };
      }

      setUploadMetadataStatus(ProgressStatus.IS_SUCCESS);
      const roundMetadataIpfsCid = roundMetadataIpfs.value;

      const allo = new Allo({
        chain: chainId,
      });

      const strategyAddress = getChainById(chainId).contracts.retroFunding;

      if (!strategyAddress) {
        throw new Error("Strategy address is undefined for chainId: " + chainId);
      }

      const retroFunding = new EasyRetroFundingStrategy({
        chain: chainId,
        address: strategyAddress,
      });

      const dates = data.roundDates;
      const timezone = data.timezone;

      const registrationStartTime = BigInt(moment.tz(dates.applications.start, timezone).unix());
      const registrationEndTime = BigInt(moment.tz(dates.applications.end, timezone).unix());
      const poolStartTime = BigInt(moment.tz(dates.round.start, timezone).unix());
      const poolEndTime = dates.round.noEndDate
        ? UINT64_MAX
        : BigInt(moment.tz(dates.round.end, timezone).unix());

      const initializeData: InitializeData = {
        useRegistryAnchor: true,
        metadataRequired: true,
        registrationStartTime,
        registrationEndTime,
        poolStartTime,
        poolEndTime,
      };

      const initData = await retroFunding.getInitializeData(initializeData);
      let txData: TransactionData;

      try {
        txData = allo.createPool({
          profileId: data.program.programId as Hex,
          strategy: strategyAddress,
          initStrategyData: initData,
          token: zeroAddress, // TODO: payout token should be an address and no name
          amount: BigInt(0),
          metadata: {
            protocol: 1n,
            pointer: roundMetadataIpfsCid,
          },
          managers: [], // TODO: do we need managers in our form?
        });
      } catch (e) {
        setContractUpdatingStatus(ProgressStatus.IS_ERROR);
        throw new Error("Failed to update application status");
      }

      setContractUpdatingStatus(ProgressStatus.IN_PROGRESS);

      let txHash;
      try {
        txHash = await walletClient.sendTransaction({
          account: account,
          to: txData.to,
          data: txData.data,
          chain: chain,
        });
      } catch (e) {
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

      try {
        await waitUntilIndexerSynced({
          chainId,
          blockNumber: receipt.blockNumber,
        });
      } catch (e) {
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
