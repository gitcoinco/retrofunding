import { executeQuery } from "./alloIndexerClient";
import {
  getProgramByIdAndChainIdQuery,
  getProgramsAndRoundsByUserAndTagQuery,
  getRoundQuery,
  getRoundWithApplicationsQuery,
} from "./queries";
import { ProgramWithRounds, RetroRound, RetroRoundWithApplications } from "@/types";

export const getRound = async (
  {chainId,
  roundId,
  }: {chainId: number,
  roundId: string,}
): Promise<RetroRound> => {
  try {
    const response = (await executeQuery(getRoundQuery, {
      chainId,
      roundId,
    })) as { round: RetroRound };
    return response.round;
  } catch (error) {
    console.error(`Error fetching round "${roundId}" in chainId "${chainId}": ${error}`);
    throw error;
  }
};

export const getRoundWithApplications = async (
  {chainId,
  roundId,
  }: {chainId: number,
  roundId: string,}
): Promise<RetroRoundWithApplications> => {
  try {
    const response = (await executeQuery(getRoundWithApplicationsQuery, {
      chainId,
      roundId,
    })) as { round: RetroRoundWithApplications };
    return response.round;
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
    projects: {
      metadata: {
        name: string;
      };
      chainId: number;
      id: string;
    }[];
  };
  const program = response.projects[0];
  return {
    programName: program.metadata.name,
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
