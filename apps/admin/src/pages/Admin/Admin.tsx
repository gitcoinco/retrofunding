"use client";

import { useMemo } from "react";
import { useAccount } from "wagmi";
import { LoadingPage } from "@/components/LoadingPage";
import { useGetUserProgramsAndRounds } from "@/hooks/allo-indexer";
import {
  transformProgramData,
  getProgramsAndRoundsItems,
  transformPoolData,
} from "@/utils/transformAdminPageMetadata";
import { AdminContent } from "./AdminContent";
import { AdminSideNav } from "./AdminSideNav";

export const Admin = () => {
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

  if (isLoadingProgramsAndRounds) return <LoadingPage />;

  return (
    <div className="flex items-start justify-center gap-6 px-20 pt-[52px]">
      <AdminSideNav
        programItems={programsItems}
        roundItems={roundsItems}
        refetch={async () => {
          await refetch();
        }}
      />
      <AdminContent programs={programs} pools={pools} />
    </div>
  );
};
