import { ProgramWithRounds, RetroRound, RoundRoles } from "@/types";
import { executeQuery } from "./alloIndexerClient";
import {
  getProgramByIdAndChainIdQuery,
  getProgramsAndRoundsByUserQuery,
  getRoundByChainIdAndPoolIdQuery,
  getRolesByChainIdAndPoolIdQuery,
} from "./queries";

export const getProgramsAndRoundsByUser = async (
  userAddress?: string,
  chainIds?: number[],
): Promise<ProgramWithRounds[]> => {
  try {
    const response = (await executeQuery(getProgramsAndRoundsByUserQuery, {
      userAddress,
      chainIds,
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
      projectRoles: {
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
    members: program.projectRoles.map((role) => role.address),
  };
};

export const getRoundByChainIdAndPoolId = async (chainId: number, poolId: string) => {
  try {
    const response = (await executeQuery(getRoundByChainIdAndPoolIdQuery, {
      chainId,
      poolId,
    })) as { rounds: RetroRound[] };

    return response.rounds[0];
  } catch (error) {
    console.error("Error fetching round by chainId and poolId:", error);
    throw error;
  }
};

export const getRolesByChainIdAndPoolId = async (chainId: number, poolId: string) => {
  try {
    const response = (await executeQuery(getRolesByChainIdAndPoolIdQuery, {
      chainId,
      poolId,
    })) as { rounds: RoundRoles[] };

    return response.rounds[0].roundRoles.map((role) => role.address);
  } catch (error) {
    console.error("Error fetching roles by chainId and poolId:", error);
    throw error;
  }
};
