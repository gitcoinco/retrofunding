"use client";

import { useMemo } from "react";
import { useAccount } from "wagmi";
import { useGetUserProgramsAndRounds } from "@/hooks/allo-indexer/getUserProgramsAndRounds";
import {
  transformProgramData,
  getProgramsAndRoundsItems,
  transformPoolData,
} from "@/utils/transformAdminPageMetadata";
import { AdminContent } from "./AdminContent";
import { AdminSideNav } from "./AdminSideNav";

export const Admin = () => {
  const { address } = useAccount();
  const { data: programsAndRounds, isLoading: isLoadingProgramsAndRounds } =
    useGetUserProgramsAndRounds(address);

  const { roundsItems, programsItems, programs, pools } = useMemo(() => {
    if (!programsAndRounds) return { roundsItems: [], programsItems: [], programs: [], pools: [] };
    const { roundsItems, programsItems } = getProgramsAndRoundsItems(programsAndRounds);
    const programs = programsAndRounds.map((program) => transformProgramData(program));
    const pools = transformPoolData(programsAndRounds);
    return { roundsItems, programsItems, programs, pools };
  }, [programsAndRounds]);

  // TODO add loading state to the Admin Content
  if (isLoadingProgramsAndRounds) return <div>Loading...</div>;

  return (
    <div className="flex items-start justify-center gap-6 px-20 pt-[52px]">
      <AdminSideNav programItems={programsItems} roundItems={roundsItems} />
      {/* TODO add loading state */}
      <AdminContent programs={programs} pools={pools} />
    </div>
  );
};
