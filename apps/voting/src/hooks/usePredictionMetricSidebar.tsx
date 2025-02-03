import { useMemo } from "react";
import { ProjectAllocation } from "@gitcoin/ui/types";
import { useToggle } from "usehooks-ts";
import { RetroApplication, RetroVote } from "@/types";
import { useGetRoundWithApplications } from "./useGetRoundWithApplications";
import { usePredictDistribution } from "./usePredictDistribution";

export const usePredictionMetricSidebar = ({
  poolId,
  chainId,
  ballot,
}: {
  poolId?: string;
  chainId?: number;
  ballot?: RetroVote[];
}) => {
  const [isAscending, toggleSort] = useToggle(false);

  const { data: pool, isLoading: isLoadingPool } = useGetRoundWithApplications({
    roundId: poolId,
    chainId,
  });
  const { data: prediction, isLoading: isLoadingPrediction } = usePredictDistribution({
    poolId,
    chainId,
    ballot,
  });

  const applications = pool?.applications.reduce(
    (acc, application) => ({
      ...acc,
      [application.id]: application,
    }),
    {} as Record<string, RetroApplication>,
  );

  const distribution: ProjectAllocation[] = useMemo(() => {
    if (!applications || !prediction) return [];
    return prediction.map(({ alloApplicationId, distributionPercentage }) => ({
      id: alloApplicationId,
      name: applications[alloApplicationId].metadata.application.project.title,
      amount: distributionPercentage / 100,
      image: applications[alloApplicationId].metadata.application.project.logoImg,
    }));
  }, [applications, prediction]);

  const sortedProjects: ProjectAllocation[] = useMemo(() => {
    if (!distribution) return [];
    return [...distribution].sort((a, b) => (a.amount < b.amount ? (isAscending ? -1 : 1) : -1));
  }, [distribution, isAscending]);

  const chartData = useMemo(
    () =>
      sortedProjects.map((project, i) => ({
        x: i,
        y: project.amount,
      })),
    [sortedProjects],
  );

  return {
    distribution,
    sortedProjects,
    chartData,
    isAscending,
    toggleSort,
    isLoading: isLoadingPool || isLoadingPrediction,
  };
};
