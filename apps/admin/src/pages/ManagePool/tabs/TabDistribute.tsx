import { useState } from "react";
import { ProgressModal } from "@gitcoin/ui/client";
import { useToast } from "@gitcoin/ui/hooks/useToast";
import { Distribute } from "@gitcoin/ui/retrofunding";
import { ApplicationPayout, PoolConfig } from "@gitcoin/ui/types";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import Decimal from "decimal.js";
import { Address, getAddress } from "viem";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { LoadingPage } from "@/components/LoadingPage";
import { MessagePage } from "@/components/Message";
import {
  useDeleteCustomDistribution,
  useUpdateCustomDistribution,
} from "@/hooks/backend/useCustomDistribution";
import { usePoolDistribution } from "@/hooks/backend/usePoolDistribution";
import { useBalance } from "@/hooks/contracts";
import { useDistribute } from "@/hooks/contracts/useDistribute/useDistribute";
import { useFundRound } from "@/hooks/contracts/useFundRound";
import { RetroRound } from "@/types";
import { transformDistributeApplications } from "@/utils";
import { getPoolStatus } from "@/utils/getPoolStatus";
import { getRoundConstantGrantFunding } from "@/utils/getRoundConstantGrantFunding";

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

  const [edittedPayouts, setEdittedPayouts] = useState<ApplicationPayout[]>([]);
  const [isEditPayoutsDialogOpen, setIsEditPayoutsDialogOpen] = useState(false);
  const [isResetPayoutsDialogOpen, setIsResetPayoutsDialogOpen] = useState(false);
  const {
    data: balance,
    isLoading: isBalanceLoading,
    isError: isBalanceError,
    refetch: refetchBalance,
  } = useBalance(strategy, chainId, token);

  // This to be true only if non of the applications have a distribution transaction
  const canSyncDistribution =
    roundData.applications.filter((application) => Boolean(application.distributionTransaction))
      .length === 0;

  const {
    data: poolDistribution,
    isLoading: isPoolDistributionLoading,
    isError: isPoolDistributionError,
    refetch: refetchPoolDistribution,
  } = usePoolDistribution(roundData.id, roundData.chainId, canSyncDistribution);

  const { toast } = useToast();

  const { steps, fundRoundMutation } = useFundRound(token);
  const { mutateAsync: fundRound, isPending: isFunding } = fundRoundMutation;
  const { steps: distributeSteps, distributeMutation } = useDistribute();
  const { mutateAsync: distribute, isPending: isDistributing } = distributeMutation;

  const { mutateAsync: updateCustomDistribution } = useUpdateCustomDistribution();
  const { mutateAsync: deleteCustomDistribution } = useDeleteCustomDistribution();

  if (isBalanceLoading || isPoolDistributionLoading) {
    return <LoadingPage />;
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
  const constantFundingAmount = getRoundConstantGrantFunding(
    roundData.id,
    roundData.chainId.toString(),
  );
  const poolConfig = {
    tokenTicker: balance.symbol,
    amountOfTokensInPool: balance.value,
    amountOfTokensToDistribute,
    tokenDecimals: balance.decimals,
    poolStatus: getPoolStatus(roundData),
    chainId,
    constantAmountPerGrant: constantFundingAmount,
  } satisfies PoolConfig;

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

  const onDistribute = async (
    values: { applicationId: string; amount: bigint }[],
    selectedApplications: string[],
  ) => {
    const filteredValues = values.filter((value) =>
      selectedApplications.includes(value.applicationId),
    );
    const totalAmount = filteredValues.reduce(
      (acc, value) => acc.plus(new Decimal(value.amount.toString())),
      new Decimal(0),
    );

    if (totalAmount.gt(new Decimal(balance.value.toString()))) {
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
    const transactionData = filteredValues.map((value) => ({
      anchorAddress: getAddress(roundApplications[value.applicationId].anchorAddress),
      amount: value.amount,
      index: Number(value.applicationId) + 1,
    }));
    const distributionMetadata = values.map((value) => ({
      anchorAddress: roundApplications[value.applicationId].anchorAddress,
      payoutAddress: roundApplications[value.applicationId].payoutAddress,
      amount: value.amount.toString(),
      index: Number(value.applicationId) + 1,
    }));
    await distribute(
      {
        distributionMetadata,
        transactionData,
        poolId: roundData.id,
        chainId: roundData.chainId,
        strategyAddress: strategy,
      },
      {
        onSuccess: async () => {
          await onUpdate();
          await refetchBalance();
          toast({
            title: "Distribution successful",
            description: "The distribution has been successfully completed",
            status: "success",
          });
        },
        onError: () => {
          toast({
            title: "Distribution failed",
            description: "The distribution has failed",
            status: "error",
          });
        },
      },
    );
  };

  const onEditPayouts = async (values: ApplicationPayout[]) => {
    // use Decimal.js for sum
    const totalPercentage = values.reduce(
      (acc, value) => acc.plus(new Decimal(value.payoutPercentage)),
      new Decimal(0),
    );
    if (totalPercentage.toNumber() !== 100) {
      toast({
        title: "Payout percentage error",
        description: "The payout percentage must be 100%",
        status: "error",
      });
      throw new Error(`Total payout percentage must be 100%`);
    }

    await updateCustomDistribution(
      {
        alloPoolId: roundData.id,
        chainId: roundData.chainId,
        distribution: values.map((value) => ({
          alloApplicationId: value.id,
          distributionPercentage: value.payoutPercentage,
        })),
      },
      {
        onSuccess: async () => {
          await refetchPoolDistribution();
          toast({
            title: "Payouts updated successfully",
            description: "The payouts have been successfully updated",
            status: "success",
          });
        },
        onError: () => {
          toast({
            title: "Payout update failed",
            description: "The payout update has failed",
            status: "error",
          });
        },
      },
    );
  };

  const onResetEdit = async () => {
    await deleteCustomDistribution(
      {
        alloPoolId: roundData.id,
        chainId: roundData.chainId,
      },
      {
        onSuccess: async () => {
          await refetchPoolDistribution();
          toast({
            title: "Payouts reset successfully",
            description: "The payouts have been successfully reset",
            status: "success",
          });
        },
        onError: () => {
          toast({
            title: "Reset payouts failed",
            description: "The payouts reset has failed",
            status: "error",
          });
        },
      },
    );
  };

  return (
    <>
      <Distribute
        applications={applications}
        poolConfig={poolConfig}
        canResetEdit={!!poolDistribution.customDistributionData}
        onFundRound={onFundRound}
        onDistribute={onDistribute}
        onEditPayouts={async (values) => {
          setEdittedPayouts(values);
          setIsEditPayoutsDialogOpen(true);
        }}
        onResetEdit={async () => setIsResetPayoutsDialogOpen(true)}
      />
      <ProgressModal steps={steps} isOpen={isFunding} />
      <ProgressModal steps={distributeSteps} isOpen={isDistributing} />
      <ConfirmationDialog
        isOpen={isEditPayoutsDialogOpen}
        onOpenChange={setIsEditPayoutsDialogOpen}
        modalTitle="Edit voting distribution"
        modalDescription="You can edit the voting distribution anytime, but once a project has been paid out, voting distribution becomes locked and cannot be changed. Make sure all changes are final before making payments."
        buttonText="Continue"
        onSubmit={async () => {
          await onEditPayouts(edittedPayouts);
          setIsEditPayoutsDialogOpen(false);
        }}
      />
      <ConfirmationDialog
        isOpen={isResetPayoutsDialogOpen}
        onOpenChange={setIsResetPayoutsDialogOpen}
        modalTitle="Reset voting distribution"
        modalDescription="Reset the distribution to the actual distribution calculated by the round badgeholder's votes."
        buttonText="Reset"
        onSubmit={async () => {
          await onResetEdit();
          setIsResetPayoutsDialogOpen(false);
        }}
      />
    </>
  );
};
