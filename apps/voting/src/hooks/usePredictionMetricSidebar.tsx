import { useMemo } from "react";
import { ProjectAllocation } from "@gitcoin/ui/types";
import { useToggle } from "usehooks-ts";
import { RetroApplication, RetroVote } from "@/types";
import { calculateDistribution } from "@/utils";
import { useGetDataToCalculateDistribution } from "./backend/useGetDataToCalculateDistribution";
import { useGetRoundWithApplications } from "./useGetRoundWithApplications";

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

  const { data: dataToCalculateDistribution, isLoading: isLoadingDataToCalculateDistribution } =
    useGetDataToCalculateDistribution(poolId, chainId);

  const prediction = useMemo(() => {
    if (!dataToCalculateDistribution || !ballot) return [];
    return calculateDistribution(dataToCalculateDistribution, [
      {
        votes: ballot,
      },
    ]);
  }, [dataToCalculateDistribution, ballot]);

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
      name: applications[alloApplicationId].title,
      amount: distributionPercentage / 100,
      image: applications[alloApplicationId].logoImg,
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
    isLoading: isLoadingPool || isLoadingDataToCalculateDistribution,
  };
};
