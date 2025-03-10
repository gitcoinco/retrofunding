import { getChainInfo } from "@gitcoin/ui/lib";
import { PoolStatus, PoolType, PoolData } from "@gitcoin/ui/types";
import { Address, Hex, zeroAddress } from "viem";
import { config } from "@/config";
import { APIRetroRound, ProgramWithRounds } from "@/types/allo-indexer";

export const getPoolStatus = (pool: {
  applicationStartDate: Date;
  applicationEndDate: Date;
  votingStartDate: Date;
  votingEndDate: Date;
}): PoolStatus => {
  const now = new Date();
  if (now >= pool.applicationStartDate && now <= pool.applicationEndDate) {
    return PoolStatus.ApplicationsInProgress;
  } else if (now > pool.applicationEndDate && now <= pool.votingStartDate) {
    return PoolStatus.FundingPending;
  } else if (now > pool.votingStartDate && now <= pool.votingEndDate) {
    return PoolStatus.RoundInProgress;
  }
  return PoolStatus.PreRound;
};

const getOperatorsCount = (roles?: ProgramWithRounds["roles"], operatorRoles: string[] = []) => {
  if (!roles) return 0;
  return new Set(
    roles
      ?.filter(({ role }) => (operatorRoles.length > 0 ? operatorRoles.includes(role) : true))
      .map(({ address }) => address),
  ).size;
};

export const transformProgramData = (program: ProgramWithRounds) => ({
  id: program.id,
  chainId: program.chainId,
  title: program.name,
  operatorsCount: getOperatorsCount(program.roles),
  roundsCount: program.retroRounds?.length || 0,
  createdAtBlock: program.createdAtBlock,
  onClick: (programData?: { chainId: number; programId: string }) => {
    if (programData) {
      console.log("Program clicked:", programData);
    }
  },
});

export const getProgramsAndRoundsItems = (programs: ProgramWithRounds[]) => {
  const roundsItems = programs
    .map((program) =>
      program.retroRounds.map((round: APIRetroRound) => ({
        name: round.roundMetadata?.name,
        roundId: round.id,
        chainId: program.chainId,
        iconType: getChainInfo(program.chainId).icon,
      })),
    )
    .flat();
  const programsItems = programs.map((program) => ({
    name: program.name,
    programId: program.id as Hex,
    chainId: program.chainId,
    iconType: getChainInfo(program.chainId).icon,
    admins: (program.roles?.map((role) => role.address) ?? []) as Address[],
    owner: (program.roles?.find((role) => role.role === "OWNER")?.address ??
      zeroAddress) as Address,
  }));
  return { roundsItems, programsItems };
};

export const transformPoolData = (programs: ProgramWithRounds[]): PoolData[] => {
  const pools = programs?.map((program) =>
    program?.retroRounds?.map((round: APIRetroRound) => {
      const poolDates = {
        applicationStartDate: new Date(round?.applicationsStartTime),
        applicationEndDate: new Date(round?.applicationsEndTime),
        votingStartDate: new Date(round?.donationsStartTime),
        votingEndDate: new Date(round?.donationsEndTime),
      } as {
        applicationStartDate: Date;
        applicationEndDate: Date;
        votingStartDate: Date;
        votingEndDate: Date;
      };

      return {
        roundName: round?.roundMetadata?.name,
        roundId: round?.id,
        chainId: program?.chainId,
        poolType: PoolType.Retrofunding,
        poolStatus: getPoolStatus(poolDates),
        operatorsCount: round?.roles?.length || 0,
        createdAtBlock: round?.createdAtBlock,
        logoImg: `${config.pinataBaseUrl}/${round?.roundMetadata?.retroFundingConfig?.coverImage}`,
        ...poolDates,
      };
    }),
  );
  return pools.flat();
};
