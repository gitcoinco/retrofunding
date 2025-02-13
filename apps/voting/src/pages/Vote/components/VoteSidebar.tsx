"use client";

import { AllocationSidebar } from "@gitcoin/ui";
import { usePredictionMetricSidebar } from "@/hooks";
import { RetroVote } from "@/types";

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
  const {
    sortedProjects,
    chartData,
    isAscending,
    toggleSort,
    isLoading: predictionIsLoading,
  } = usePredictionMetricSidebar({
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
      className="hidden border-grey-300 lg:block"
      chartData={chartData}
      sortConfig={{ isAscending, onClick: toggleSort }}
    />
  );
};
