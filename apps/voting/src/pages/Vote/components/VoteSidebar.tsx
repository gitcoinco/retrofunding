"use client";

import { AllocationSidebar } from "@gitcoin/ui";
import { RetroVote } from "@/types";
import { usePredictionMetricSidebar } from "@/hooks";

export const VoteSidebar = ({
  poolId,
  chainId,
  ballot,
}: {
  poolId?: string;
  chainId?: number;
  ballot?: RetroVote[];
}) => {

  const { sortedProjects, chartData, isAscending, toggleSort, isLoading } = usePredictionMetricSidebar({
    poolId,
    chainId,
    ballot,
  });

  return (
    <AllocationSidebar
      isLoading={isLoading}
      title="Allocation preview"
      description="This is a preview of the allocation"
      projects={sortedProjects}
      chartData={chartData}
      sortConfig={{ isAscending, onClick: toggleSort }}
    />
  );
};
