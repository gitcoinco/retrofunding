import { executeQuery } from "./alloIndexerClient";
import {
  getProgramByIdAndChainIdQuery,
  getProgramsAndRoundsByUserAndTagQuery,
} from "./queries";
import { ProgramWithRounds } from "@/types";
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
