"use client";

import { AllocationSidebar } from "@gitcoin/ui";
import { RetroVote } from "@/types";
import { usePredictionMetricSidebar } from "@/hooks";

export const VoteSidebar = ({
  isLoading,
  poolId,
  chainId,
  ballot,
}: {
  isLoading: boolean;
  poolId?: string;
  chainId?: number;
  ballot?: RetroVote[];
}) => {

  const { sortedProjects, chartData, isAscending, toggleSort, isLoading: predictionIsLoading } = usePredictionMetricSidebar({
    poolId,
    chainId,
    ballot,
  });

  return (
    <AllocationSidebar
      isLoading={isLoading || predictionIsLoading}
      title="Allocation preview"
      description="This is a preview of the allocation"
      projects={sortedProjects}
      chartData={chartData}
      sortConfig={{ isAscending, onClick: toggleSort }}
    />
  );
};
