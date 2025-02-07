import { ProgressModal } from "@gitcoin/ui/client";
import { useToast } from "@gitcoin/ui/hooks/useToast";
import { Distribute } from "@gitcoin/ui/retrofunding";
import { ApplicationPayout, PoolConfig } from "@gitcoin/ui/types";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import { Address, getAddress } from "viem";
import { useWalletClient } from "wagmi";
import { MessagePage } from "@/components/Message";
import { usePoolDistribution } from "@/hooks/backend/usePoolDistribution";
import { useBalance } from "@/hooks/contracts";
import { useDistribute } from "@/hooks/contracts/useDistribute/useDistribute";
import { useFundRound } from "@/hooks/contracts/useFundRound";
import { deleteCustomDistribution, updateCustomDistribution } from "@/services/backend/api";
import { RetroRound } from "@/types";
import { transformDistributeApplications } from "@/utils";
import { getPoolStatus } from "@/utils/getPoolStatus";

// TODO: export from gitcoin-ui all the components for the modal to be used as user confirmations in the actions

interface TabDistributeProps {
  roundData: RetroRound;
  onUpdate: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<RetroRound, Error>>;
}

export const TabDistribute = ({ roundData, onUpdate }: TabDistributeProps) => {
  const token = roundData.roundMetadata.retroFundingConfig.payoutToken as Address;
  const strategy = roundData.strategyAddress as Address;
  const chainId = roundData.chainId;

  const {
    data: balance,
    isLoading: isBalanceLoading,
    isError: isBalanceError,
    refetch: refetchBalance,
  } = useBalance(strategy, chainId, token);

  const {
    data: poolDistribution,
    isLoading: isPoolDistributionLoading,
    isError: isPoolDistributionError,
    refetch: refetchPoolDistribution,
  } = usePoolDistribution(roundData.id, roundData.chainId);

  const { data: walletClient } = useWalletClient();

  const { toast } = useToast();

  const { steps, fundRoundMutation } = useFundRound(token);
  const { mutateAsync: fundRound, isPending: isFunding } = fundRoundMutation;
  const { steps: distributeSteps, distributeMutation } = useDistribute();
  const { mutateAsync: distribute, isPending: isDistributing } = distributeMutation;

  if (isBalanceLoading || isPoolDistributionLoading) {
    return <MessagePage title="Loading..." message="Loading..." />;
  }

  if (isBalanceError || isPoolDistributionError) {
    return <MessagePage title="Error..." message="Error..." />;
  }

  if (!poolDistribution || !balance) {
    return <MessagePage title="Error..." message="Round data is missing" />;
  }
  const latestDistribution =
    poolDistribution.customDistributionData ?? poolDistribution.distributionData;

  const applications = transformDistributeApplications(roundData, latestDistribution);

  const amountOfTokensToDistribute = roundData.roundMetadata.retroFundingConfig.fundingAmount ?? 0;

  const poolConfig = {
    tokenTicker: balance.symbol,
    amountOfTokensInPool: balance.value,
    amountOfTokensToDistribute,
    tokenDecimals: balance.decimals,
    poolStatus: getPoolStatus(roundData),
    chainId,
  } as PoolConfig;

  const onFundRound = async (amount: bigint) => {
    try {
      await fundRound({
        amount: amount,
        poolId: roundData.id,
        chainId: roundData.chainId,
      });
      await refetchBalance();
      toast({
        title: "Funding successful",
        description: "The funding has been successfully completed",
        status: "success",
      });
    } catch (error) {
      toast({
        title: "Funding failed",
        description: "The funding has failed",
        status: "error",
      });
    }
  };

  const onDistribute = async (values: { applicationId: string; amount: bigint }[]) => {
    const totalAmount = values.reduce((acc, value) => acc + value.amount, 0n);
    if (totalAmount > balance.value) {
      throw new Error(`something went wrong with the calculations`);
    }
    const roundApplications: Record<
      string,
      {
        anchorAddress: Address;
        payoutAddress: Address;
      }
    > = roundData.applications.reduce(
      (acc, application) => {
        acc[application.id] = {
          anchorAddress: application.anchorAddress,
          payoutAddress: application.metadata.application.recipient,
        };
        return acc;
      },
      {} as Record<string, { anchorAddress: Address; payoutAddress: Address }>,
    );
    const data = values.map((value) => ({
      anchorAddress: getAddress(roundApplications[value.applicationId].anchorAddress),
      amount: value.amount,
      index: Number(value.applicationId) + 1,
    }));
    const distributionData = values.map((value) => ({
      anchorAddress: roundApplications[value.applicationId].anchorAddress,
      payoutAddress: roundApplications[value.applicationId].payoutAddress,
      amount: value.amount.toString(),
      index: Number(value.applicationId) + 1,
    }));
    try {
      await distribute({
        distributionData,
        data,
        poolId: roundData.id,
        chainId: roundData.chainId,
        strategyAddress: strategy,
      });
      await onUpdate();
      await refetchBalance();
      toast({
        title: "Distribution successful",
        description: "The distribution has been successfully completed",
        status: "success",
      });
    } catch (error) {
      toast({
        title: "Distribution failed",
        description: "The distribution has failed",
        status: "error",
      });
    }
  };

  const onEditPayouts = async (values: ApplicationPayout[]) => {
    const totalPercentage = values.reduce((acc, value) => acc + value.payoutPercentage, 0);
    if (totalPercentage !== 100) {
      toast({
        title: "Payout percentage error",
        description: "The payout percentage must be 100%",
        status: "error",
      });
      throw new Error(`Total payout percentage must be 100%`);
    }
    try {
      await walletClient?.signMessage({
        message: `I am signing my message to update the payouts for the round ${roundData.id}`,
      });
      await updateCustomDistribution({
        alloPoolId: roundData.id,
        chainId: roundData.chainId,
        // TODO: Get signature from user
        signature: "0xdeadbeef",
        distribution: values.map((value) => ({
          alloApplicationId: value.id,
          distributionPercentage: value.payoutPercentage,
        })),
      });
      await refetchPoolDistribution();
      toast({
        title: "Payouts updated successfully",
        description: "The payouts have been successfully updated",
        status: "success",
      });
    } catch (error) {
      toast({
        title: "Payout update failed",
        description: "The payout update has failed",
        status: "error",
      });
    }
  };

  const onResetEdit = async () => {
    try {
      await walletClient?.signMessage({
        message: `I am signing my message to reset the payouts for the round ${roundData.id}`,
      });
      await deleteCustomDistribution({
        alloPoolId: roundData.id,
        chainId: roundData.chainId,
        // TODO: Get signature from user
        signature: "0xdeadbeef",
      });
      await refetchPoolDistribution();
      toast({
        title: "Payouts reset successfully",
        description: "The payouts have been successfully reset",
        status: "success",
      });
    } catch (error) {
      toast({
        title: "Reset payouts failed",
        description: "The payouts reset has failed",
        status: "error",
      });
    }
  };

  return (
    <>
      <Distribute
        applications={applications}
        poolConfig={poolConfig}
        canResetEdit={!!poolDistribution.customDistributionData}
        onFundRound={onFundRound}
        onDistribute={onDistribute}
        onEditPayouts={onEditPayouts}
        onResetEdit={onResetEdit}
      />
      <ProgressModal steps={steps} isOpen={isFunding} />
      <ProgressModal steps={distributeSteps} isOpen={isDistributing} />
    </>
  );
};
