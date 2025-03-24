import {
  DirectGrantsLiteStrategy,
  DirectGrantsLiteStrategyAbi,
  DonationVotingMerkleDistributionDirectTransferStrategyAbi,
  DonationVotingMerkleDistributionStrategy,
  EasyRetroFundingStrategy,
  EasyRetroFundingStrategyAbi,
} from "@allo-team/allo-v2-sdk";
import { ApplicationStatus, ApplicationStatusType, PoolCategory } from "@gitcoin/ui/checker";
import { ProgressStatus, Step } from "@gitcoin/ui/types";
import { EventEmitter } from "events";
import { Abi, Address, createPublicClient, encodeFunctionData, http, WalletClient } from "viem";

export const applicationStatusToNumber = (status: ApplicationStatusType): bigint => {
  switch (status) {
    case ApplicationStatus.PENDING:
      return 1n;
    case ApplicationStatus.APPROVED:
      return 2n;
    case ApplicationStatus.REJECTED:
      return 3n;
    case ApplicationStatus.APPEAL:
      return 4n;
    case ApplicationStatus.IN_REVIEW:
      return 5n;
    case ApplicationStatus.CANCELLED:
      return 6n;
    default:
      throw new Error(`Unknown status ${status}`);
  }
};

class ReviewRecipients extends EventEmitter {
  async execute(
    args: {
      roundId: string;
      strategyAddress: Address;
      applicationsToUpdate: { index: number; status: ApplicationStatusType }[];
      currentApplications: { index: number; status: ApplicationStatusType }[];
      strategy?: PoolCategory;
    },
    chainId: number,
    walletClient: WalletClient,
  ): Promise<{ status: "success" } | { status: "error"; error: Error }> {
    let strategyInstance;
    let strategyInstanceAbi;

    switch (args.strategy) {
      case PoolCategory.QuadraticFunding: {
        strategyInstance = new DonationVotingMerkleDistributionStrategy({
          chain: chainId,
          poolId: BigInt(args.roundId),
          address: args.strategyAddress,
        });
        strategyInstanceAbi = DonationVotingMerkleDistributionDirectTransferStrategyAbi;
        break;
      }
      case PoolCategory.Direct: {
        strategyInstance = new DirectGrantsLiteStrategy({
          chain: chainId,
          poolId: BigInt(args.roundId),
          address: args.strategyAddress,
        });
        strategyInstanceAbi = DirectGrantsLiteStrategyAbi;
        break;
      }
      case PoolCategory.Retrofunding: {
        strategyInstance = new EasyRetroFundingStrategy({
          chain: chainId,
          poolId: BigInt(args.roundId),
          address: args.strategyAddress,
        });
        strategyInstanceAbi = EasyRetroFundingStrategyAbi;
        break;
      }
      default:
        throw new Error("Invalid strategy");
    }

    let totalApplications = 0n;
    try {
      totalApplications = await strategyInstance.recipientsCounter();
    } catch (error) {
      totalApplications = BigInt(args.currentApplications.length + 1);
    }

    const rows = buildUpdatedRowsOfApplicationStatuses({
      applicationsToUpdate: args.applicationsToUpdate,
      currentApplications: args.currentApplications,
      statusToNumber: applicationStatusToNumber,
      bitsPerStatus: 4,
    });

    try {
      const account = walletClient.account;
      if (!account) {
        throw new Error("WalletClient account is undefined");
      }

      const txHash = await walletClient.sendTransaction({
        account: account,
        to: args.strategyAddress,
        data: encodeFunctionData({
          abi: strategyInstanceAbi as Abi,
          functionName: "reviewRecipients",
          args: [rows, totalApplications],
        }),
        chain: null,
      });

      this.emit("transaction", { type: "sent", txHash });

      const publicClient = createPublicClient({
        chain: walletClient.chain,
        transport: http(),
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

      if (receipt.status !== "success") {
        const errorResult = new Error("Failed to update application status");
        this.emit("transactionStatus", { status: "error", error: errorResult });
        return { status: "error", error: errorResult };
      }

      this.emit("transactionStatus", { status: "success", receipt });

      await waitUntilIndexerSynced({
        chainId: chainId,
        blockNumber: receipt.blockNumber,
      });

      this.emit("indexingStatus", { status: "success" });

      return { status: "success" };
    } catch (error) {
      this.emit("transaction", { type: "error", error });
      return { status: "error", error: error as Error };
    }
  }
}

export const waitUntilIndexerSynced = async ({
  chainId,
  blockNumber,
}: {
  chainId: number;
  blockNumber: bigint;
}) => {
  const endpoint = `${import.meta.env.VITE_INDEXER_V2_API_URL}/graphql`;
  const pollIntervalInMs = 1000;

  async function pollIndexer() {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query getBlockNumberQuery($chainId: Int!) {
            eventsRegistry(
              where: { chainId: { _eq: $chainId } }
            ) {
              chainId
              blockNumber
            }
          }
        `,
        variables: {
          chainId,
        },
      }),
    });

    if (response.status === 200) {
      const {
        data,
      }: {
        data: {
          eventsRegistry: { chainId: number; blockNumber: bigint }[];
        };
      } = await response.json();

      const eventsRegistry = data?.eventsRegistry || [];

      if (eventsRegistry.length > 0) {
        const currentBlockNumber = BigInt(
          eventsRegistry.reduce(
            (minBlock, event) =>
              BigInt(event.blockNumber) < BigInt(minBlock) ? event.blockNumber : minBlock,
            eventsRegistry[0].blockNumber,
          ),
        );

        if (currentBlockNumber >= blockNumber) {
          return true;
        }
      }
    }

    return false;
  }

  while (!(await pollIndexer())) {
    await new Promise((resolve) => setTimeout(resolve, pollIntervalInMs));
  }
};

// =========== Do not touch this code ===========

export const buildUpdatedRowsOfApplicationStatuses = (args: {
  applicationsToUpdate: { index: number; status: ApplicationStatusType }[];
  currentApplications: { index: number; status: ApplicationStatusType }[];
  statusToNumber: (status: ApplicationStatusType) => bigint;
  bitsPerStatus: number;
}): { index: bigint; statusRow: bigint }[] => {
  if (args.bitsPerStatus > 1 && args.bitsPerStatus % 2 !== 0) {
    throw new Error("bitsPerStatus must be a multiple of 2");
  }

  const applicationsPerRow = 256 / args.bitsPerStatus;

  const rowsToUpdate = Array.from(
    new Set(
      args.applicationsToUpdate.map(({ index }) => {
        return Math.floor(index / applicationsPerRow);
      }),
    ),
  );

  const updatedApplications = args.currentApplications.map((app) => {
    const updatedApplication = args.applicationsToUpdate.find(
      (appToUpdate) => appToUpdate.index === app.index,
    );

    if (updatedApplication) {
      return { ...app, status: updatedApplication.status };
    }

    return app;
  });

  return rowsToUpdate.map((rowIndex) => {
    return {
      index: BigInt(rowIndex),
      statusRow: buildRowOfApplicationStatuses({
        rowIndex,
        applications: updatedApplications,
        statusToNumber: args.statusToNumber,
        bitsPerStatus: args.bitsPerStatus,
      }),
    };
  });
};

export const buildRowOfApplicationStatuses = ({
  rowIndex,
  applications,
  statusToNumber,
  bitsPerStatus,
}: {
  rowIndex: number;
  applications: { index: number; status: ApplicationStatusType }[];
  statusToNumber: (status: ApplicationStatusType) => bigint;
  bitsPerStatus: number;
}) => {
  const applicationsPerRow = 256 / bitsPerStatus;
  const startApplicationIndex = rowIndex * applicationsPerRow;
  let row = 0n;

  for (let columnIndex = 0; columnIndex < applicationsPerRow; columnIndex++) {
    const applicationIndex = startApplicationIndex + columnIndex;
    const application = applications.find((app) => app.index === applicationIndex);

    if (application === undefined) {
      continue;
    }

    const status = statusToNumber(application.status);

    const shiftedStatus = status << BigInt(columnIndex * bitsPerStatus);
    row |= shiftedStatus;
  }

  return row;
};

export const getStrategyInstance = (
  strategyAddress: Address,
  chainId: number,
  roundId: string,
  strategy?: PoolCategory,
) => {
  let strategyInstance;
  let strategyInstanceAbi;
  switch (strategy) {
    case PoolCategory.QuadraticFunding: {
      strategyInstance = new DonationVotingMerkleDistributionStrategy({
        chain: chainId,
        poolId: BigInt(roundId),
        address: strategyAddress,
      });
      strategyInstanceAbi = DonationVotingMerkleDistributionDirectTransferStrategyAbi;
      break;
    }
    case PoolCategory.Direct: {
      strategyInstance = new DirectGrantsLiteStrategy({
        chain: chainId,
        poolId: BigInt(roundId),
        address: strategyAddress,
      });
      strategyInstanceAbi = DirectGrantsLiteStrategyAbi;
      break;
    }
    case PoolCategory.Retrofunding: {
      strategyInstance = new EasyRetroFundingStrategy({
        chain: chainId,
        poolId: BigInt(roundId),
        address: strategyAddress,
      });
      strategyInstanceAbi = EasyRetroFundingStrategyAbi;
      break;
    }
    default:
      throw new Error("Invalid strategy");
  }

  return { strategyInstance, strategyInstanceAbi };
};

export function reviewRecipients(
  args: {
    roundId: string;
    strategyAddress: Address;
    applicationsToUpdate: { index: number; status: ApplicationStatusType }[];
    currentApplications: { index: number; status: ApplicationStatusType }[];
    strategy?: PoolCategory;
  },
  chainId: number,
  walletClient: WalletClient,
): ReviewRecipients {
  const reviewRecipientsInstance = new ReviewRecipients();
  reviewRecipientsInstance.execute(args, chainId, walletClient);
  return reviewRecipientsInstance;
}

export const getOnchainEvaluationProgressSteps = ({
  contractUpdatingStatus,
  indexingStatus,
  finishingStatus,
}: {
  contractUpdatingStatus: ProgressStatus;
  indexingStatus: ProgressStatus;
  finishingStatus: ProgressStatus;
}): Step[] => {
  return [
    {
      name: "Updating",
      description: `Updating application statuses on the contract.`,
      status: contractUpdatingStatus,
    },
    {
      name: "Indexing",
      description: "Indexing the data.",
      status: indexingStatus,
    },
    {
      name: "Finishing",
      description: "Just another moment while we finish things up.",
      status: finishingStatus,
    },
  ];
};
