import { EasyRetroFundingStrategy } from "@allo-team/allo-v2-sdk";
import { useMutation } from "@tanstack/react-query";
import moment from "moment";
import { Hex } from "viem";
import { RoundDates } from "@/types";
import { UINT64_MAX } from "@/utils/utils";
import { useContractInteraction } from "../useContractInteraction";
import { getUpdateTimestampsProgressSteps } from "../utils/updateTimestampsSteps";

export type UpdateTimestampsParams = {
  data: RoundDates;
  poolId: string;
  chainId: number;
  strategyAddress: string;
};

export const useUpdateTimestamps = () => {
  const { steps, contractInteractionMutation } = useContractInteraction();

  const updateTimestampsMutation = useMutation({
    mutationFn: async ({ data, chainId, strategyAddress }: UpdateTimestampsParams) => {
      return contractInteractionMutation.mutateAsync({
        chainId,
        transactionsData: async () => {
          const retroFunding = new EasyRetroFundingStrategy({
            chain: chainId,
            address: strategyAddress as Hex,
          });
          const dates = data;
          const timezone = data.timezone;

          const registrationStartTime = BigInt(
            moment.tz(dates.applications.start, timezone).unix(),
          );
          const registrationEndTime = BigInt(moment.tz(dates.applications.end, timezone).unix());
          const poolStartTime = BigInt(moment.tz(dates.round.start, timezone).unix());
          const poolEndTime = dates.round.noEndDate
            ? UINT64_MAX
            : BigInt(moment.tz(dates.round.end, timezone).unix());

          return [
            retroFunding.updatePoolTimestamps(
              registrationStartTime,
              registrationEndTime,
              poolStartTime,
              poolEndTime,
            ),
          ];
        },
        getProgressSteps: getUpdateTimestampsProgressSteps,
      });
    },
  });

  return { steps, updateTimestampsMutation };
};
