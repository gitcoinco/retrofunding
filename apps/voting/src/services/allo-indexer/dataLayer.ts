import { executeQuery } from "./alloIndexerClient";
import {
  getProgramByIdAndChainIdQuery,
  getProgramsAndRoundsByUserAndTagQuery,
  getRoundWithApplicationsQuery,
} from "./queries";
import { APIRetroRoundWithApplications, ProgramWithRounds, RetroRound, RetroRoundWithApplications } from "@/types";

export const getRoundWithApplications = async (
  {chainId,
  roundId,
  }: {chainId: number,
  roundId: string,}
): Promise<RetroRoundWithApplications> => {
  try {
    const {round} = (await executeQuery(getRoundWithApplicationsQuery, {
      chainId,
      roundId,
    })) as { round: APIRetroRoundWithApplications };
    return {
      id: round.id,
      name: round.roundMetadata.name,
      roundName: round.roundMetadata.retroFundingConfig.roundName,
      description: round.roundMetadata.eligibility.description,
      chainId: round.roundMetadata.retroFundingConfig.program.chainId,
      programId: round.roundMetadata.retroFundingConfig.program.programId,
      programName: round.roundMetadata.retroFundingConfig.program.programName,
      strategyName: round.strategyName,
      applicationsEndTime: round.applicationsEndTime,
      applicationsStartTime: round.applicationsStartTime,
      donationsEndTime: round.donationsEndTime,
      donationsStartTime: round.donationsStartTime,
      roles: round.roles,
      requirements: round.roundMetadata.eligibility.requirements,
      coverImage: round.roundMetadata.retroFundingConfig.coverImage,
      impactMetrics: round.roundMetadata.retroFundingConfig.impactMetrics,
      payoutToken: round.roundMetadata.retroFundingConfig.payoutToken,
      feesAddress: round.roundMetadata.feesAddress,
      feesPercentage: round.roundMetadata.feesPercentage,
      programContractAddress: round.roundMetadata.programContractAddress,
      projectId: round.roundMetadata.retroFundingConfig.program.programId,
      roundType: round.roundMetadata.roundType,
      createdAtBlock: round.createdAtBlock,
      applications: round.applications.map((application) => ({
        id: application.id,
        signature: application.metadata.signature,
        round: application.metadata.application.round,
        answers: application.metadata.application.answers,
        projectId: application.metadata.application.project.id,
        title: application.metadata.application.project.title,
        description: application.metadata.application.project.description,
        logoImg: `https://ipfs.io/ipfs/${application.metadata.application.project.logoImg}`,
        bannerImg: `https://ipfs.io/ipfs/${application.metadata.application.project.bannerImg}`,
        metaPtr: application.metadata.application.project.metaPtr,
        website: application.metadata.application.project.website,
        createdAt: application.metadata.application.project.createdAt,
        credentials: application.metadata.application.project.credentials,
        lastUpdated: application.metadata.application.project.lastUpdated,
        recipient: application.metadata.application.recipient,
      })),
    };
  } catch (error) {
    console.error(`Error fetching round "${roundId}" in chainId "${chainId}": ${error}`);
    throw error;
  }
};

export const getProgramsAndRoundsByUserAndTag = async (
  userAddress?: string,
  chainIds?: number[],
  tags?: string[],
): Promise<ProgramWithRounds[]> => {
  try {
    const response = (await executeQuery(getProgramsAndRoundsByUserAndTagQuery, {
      userAddress,
      chainIds,
      tags,
    })) as { projects: ProgramWithRounds[] };
    return response.projects;
  } catch (error) {
    console.error("Error fetching programs and rounds by user and tag:", error);
    throw error;
  }
};

export const getProgramByIdAndChainId = async (programId: string, chainId: number) => {
  const response = (await executeQuery(getProgramByIdAndChainIdQuery, {
    programId: programId.toLowerCase(),
    chainId,
  })) as {
    // NOTE: Program name depends on the value stored onChain instead of the metadataCID
    projects: {
      name: string;
      chainId: number;
      id: string;
    }[];
  };
  const program = response.projects[0];
  return {
    programName: program.name,
    chainId: program.chainId,
    programId: program.id,
  };
};

export const getApplicationsById = async ({
  poolId,
  chainId,
  applicationIds,
}: {
  poolId: string;
  chainId: number;
  applicationIds: string[];
}) => {};
