import { PropsWithChildren, useMemo } from "react";
import { Spinner } from "@gitcoin/ui";
import { LandingPage } from "@gitcoin/ui/retrofunding";
import { useAccount } from "wagmi";
import { useGetUserProgramsAndRounds } from "@/hooks";
import { BallotList } from "./Vote/BallotList";
import {
  transformProgramData,
  getProgramsAndRoundsItems,
  transformPoolData,
} from "@/utils/transformAdminPageMetadata";

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center gap-4">
    <p className="font-ui-sans text-xl font-medium">Loading...</p>
    <Spinner />
  </div>
);

export const ListBallots = ({
  poolName,
  poolDescription,
  isLoading,
  children,
}: PropsWithChildren<{ poolName?: string; poolDescription?: string; isLoading?: boolean }>) => {
  const { address } = useAccount();
  const {
    data: programsAndRounds,
    isLoading: isLoadingProgramsAndRounds,
    refetch,
  } = useGetUserProgramsAndRounds(address);

  const { roundsItems, programsItems, programs, pools } = useMemo(() => {
    if (!programsAndRounds) return { roundsItems: [], programsItems: [], programs: [], pools: [] };
    const { roundsItems, programsItems } = getProgramsAndRoundsItems(programsAndRounds);
    const programs = programsAndRounds.map((program) => transformProgramData(program));
    const pools = transformPoolData(programsAndRounds);
    return { roundsItems, programsItems, programs, pools };
  }, [programsAndRounds, refetch]);

  if (isLoadingProgramsAndRounds) return <LoadingSpinner />;

  return (
    <div className="flex items-start justify-center gap-6 px-20 pt-[52px]">
      <BallotList pools={pools} programs={programs} />
    </div>
  );
  // return (
  //   <LandingPage type="vote" roundName={poolName} roundDescription={poolDescription}>
  //     {isLoading ? <LoadingSpinner /> : children}
  //   </LandingPage>
  // );
};
