import { Allo, EasyRetroFundingStrategy, Registry } from "@allo-team/allo-v2-sdk";
import { InitializeData } from "@allo-team/allo-v2-sdk/dist/strategies/EasyRetroFunding/types";
import { getChainById } from "@gitcoin/gitcoin-chain-data";
import { useMutation } from "@tanstack/react-query";
import moment from "moment";
import { Address, Hex, zeroAddress } from "viem";
import { useAccount } from "wagmi";
import { getCreateRoundProgressSteps } from "@/hooks";
import { uploadData } from "@/services/ipfs/upload";
import { mapFormDataToRoundMetadata } from "@/utils/transformRoundMetadata";
import { UINT64_MAX } from "@/utils/utils";
import { useContractInteraction } from "../useContractInteraction/useContractInteraction";
import { CreateRoundParams } from "./useCreateRound.old";

export type CreateProgramParams = {
  chainId: number;
  programName: string;
  members: Address[];
};

export const useCreateRound = () => {
  const { steps, contractInteractionMutation } = useContractInteraction();

  const createRoundMutation = useMutation({
    mutationFn: async ({ data }: CreateRoundParams) => {
      const chainId = data.program.chainId;
      const roundImageIpfs = await uploadData(data.coverImage);

      if (roundImageIpfs.type === "error") {
        throw new Error("Failed to upload round image to IPFS");
      }

      const mappedMetadata = mapFormDataToRoundMetadata(data, roundImageIpfs.value);

      mappedMetadata.round.retroFundingConfig.coverImage = roundImageIpfs.value;

      return contractInteractionMutation.mutateAsync({
        chainId,
        metadata: mappedMetadata,
        transactionData: async (metadataCid?: string) => {
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

          const registrationStartTime = BigInt(
            moment.tz(dates.applications.start, timezone).unix(),
          );
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

          ///
          if (!metadataCid) throw new Error("Metadata CID is required");
          const nonce = BigInt(Math.floor(Math.random() * 1000000000));

          return allo.createPool({
            profileId: data.program.programId as Hex,
            strategy: strategyAddress,
            initStrategyData: initData,
            token: zeroAddress, // TODO: payout token should be an address and no name
            amount: BigInt(0),
            metadata: {
              protocol: 1n,
              pointer: metadataCid,
            },
            managers: [], // TODO: do we need managers in our form?
          });
        },
        getProgressSteps: getCreateRoundProgressSteps,
      });
    },
  });

  return { steps, createRoundMutation };
};
