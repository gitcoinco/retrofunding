import { APIRetroRoundWithApplications, ProgramWithRounds } from "@/types";
import { executeQuery } from "./alloIndexerClient";
import { getRoundWithApplicationsQuery } from "./queries";

export const getRoundWithApplications = async ({
  chainId,
  roundId,
}: {
  chainId: number;
  roundId: string;
}): Promise<APIRetroRoundWithApplications> => {
  const { rounds } = (await executeQuery(getRoundWithApplicationsQuery, {
    chainId,
    roundId,
  })) as { rounds: APIRetroRoundWithApplications[] };
  const round = rounds[0];
  if (!round) {
    throw new Error(`Round ${roundId} not found with ChainId ${chainId}`);
  }
  return round;
};
