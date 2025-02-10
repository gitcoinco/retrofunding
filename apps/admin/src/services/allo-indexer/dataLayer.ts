import { ProgramWithRounds, RetroRound } from "@/types";
import { executeQuery } from "./alloIndexerClient";
import {
  getProgramByIdAndChainIdQuery,
  getProgramsAndRoundsByUserAndTagQuery,
  getRoundByChainIdAndPoolIdQuery,
} from "./queries";

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
      roles: {
        address: string;
      }[];
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
    members: program.roles.map((role) => role.address),
  };
};

export const getRoundByChainIdAndPoolId = async (chainId: number, poolId: string) => {
  try {
    const response = (await executeQuery(getRoundByChainIdAndPoolIdQuery, {
      chainId,
      poolId,
    })) as { round: RetroRound };

    return response.round;
  } catch (error) {
    console.error("Error fetching round by chainId and poolId:", error);
    throw error;
  }
};
