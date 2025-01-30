import { Allo, AlloAbi, EasyRetroFundingStrategy } from "@allo-team/allo-v2-sdk";
import { InitializeData } from "@allo-team/allo-v2-sdk/dist/strategies/EasyRetroFunding/types";
import { getChainById } from "@gitcoin/gitcoin-chain-data";
import { useMutation } from "@tanstack/react-query";
import moment from "moment";
import {
  createPublicClient,
  Hex,
  http,
  TransactionReceipt,
  zeroAddress,
  getContract,
  decodeEventLog,
} from "viem";
import { getCreateRoundProgressSteps } from "@/hooks";
import { uploadData } from "@/services/ipfs/upload";
import { targetNetworks } from "@/services/web3/chains";
import { RoundSetupFormData } from "@/types";
import { mapFormDataToRoundMetadata } from "@/utils/transformRoundMetadata";
import { UINT64_MAX } from "@/utils/utils";
import { useContractInteraction } from "../useContractInteraction/useContractInteraction";

export type CreateRoundParams = {
  data: RoundSetupFormData;
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
        postIndexerHook: async (receipt: TransactionReceipt) => {
          let poolId: bigint | undefined = undefined;
          receipt.logs.forEach((log) => {
            const event = decodeEventLog({
              abi: AlloAbi,
              data: log.data,
              topics: log.topics,
            });
            if (event.eventName === "PoolCreated") {
              poolId = event.args.poolId;
            }
          });

          if (!poolId) throw new Error("Pool ID is undefined");

          // your code here
        },
      });
    },
  });

  return { steps, createRoundMutation };
};
