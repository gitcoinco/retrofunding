import { APIRetroRoundWithApplications, ProgramWithRounds } from "@/types";
import { executeQuery } from "./alloIndexerClient";
import {
  getProgramByIdAndChainIdQuery,
  getProgramsAndRoundsByUserAndTagQuery,
  getRoundWithApplicationsQuery,
} from "./queries";

export const getRoundWithApplications = async ({
  chainId,
  roundId,
}: {
  chainId: number;
  roundId: string;
}): Promise<APIRetroRoundWithApplications> => {
  const { round } = (await executeQuery(getRoundWithApplicationsQuery, {
    chainId,
    roundId,
  })) as { round: APIRetroRoundWithApplications };

  if (!round) {
    throw new Error(`Round ${roundId} not found with ChainId ${chainId}`);
  }
  return round;
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
