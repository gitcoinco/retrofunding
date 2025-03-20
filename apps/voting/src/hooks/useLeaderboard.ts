import { useMemo } from "react";
import { Leaderboard } from "@gitcoin/ui/retrofunding";
import { ProjectAllocation } from "@gitcoin/ui/types";
import { RetroApplication } from "@/types";
import { calculateDistribution } from "@/utils";
import { useGetDataToCalculateDistribution } from "./backend/useGetDataToCalculateDistribution";
import { useGetMetrics } from "./useGetMetrics";
import { useGetRoundVotesWithMetrics } from "./useGetRoundVotesWithMetrics";
import { useGetRoundWithApplications } from "./useGetRoundWithApplications";

export type LeaderboardProps = Parameters<typeof Leaderboard>[0];
export const useLeaderboard = ({ poolId, chainId }: { poolId?: string; chainId?: number }) => {
  const { data: pool, isLoading: isLoadingPool } = useGetRoundWithApplications({
    roundId: poolId,
    chainId,
  });

  const { data, isLoading: isLoadingVotes } = useGetRoundVotesWithMetrics({
    alloPoolId: poolId ?? "",
    chainId: chainId ?? 0,
  });

  const { metricIdentifiers, votes } = data ?? {};

  const { data: metricsData, isLoading: isLoadingMetrics } = useGetMetrics({
    identifiers: metricIdentifiers,
  });

  const { data: dataToCalculateDistribution, isLoading: isLoadingDataToCalculateDistribution } =
    useGetDataToCalculateDistribution(poolId, chainId);

  const prediction = useMemo(() => {
    if (!dataToCalculateDistribution || !votes) return [];
    return calculateDistribution(
      dataToCalculateDistribution,
      votes.map((vote) => ({ votes: vote.ballot })),
    );
  }, [dataToCalculateDistribution, votes]);

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
    // Always sort in descending order (highest amount first)
    return [...distribution].sort((a, b) => b.amount - a.amount);
  }, [distribution]);

  const leaderboardProps: LeaderboardProps = useMemo(() => {
    if (!applications || !dataToCalculateDistribution || !sortedProjects) {
      return { projects: {}, metrics: {} };
    }

    // Transform applications into projects with metrics using sortedProjects order
    const projects = sortedProjects.reduce(
      (acc, projectAllocation, index) => {
        const application = applications[projectAllocation.id];

        if (!application) return acc;

        const projectMetrics: Record<string, number> = {};

        // Filter scores for this application
        const appScores = dataToCalculateDistribution.applicationToMetricsScores.filter(
          (score) => score.alloApplicationId === application.id,
        );

        // Map each metric score to the metrics object
        appScores.forEach((score) => {
          projectMetrics[score.metricIdentifier] = Number(score.metricScore);
        });

        return {
          ...acc,
          [index + 1]: {
            // Using index as the rank
            project: {
              name: application.title,
              logoImg: application.logoImg,
              website: application.website,
              projectTwitter: application.projectTwitter,
              projectGithub: application.projectGithub,
              description: application.description,
            },
            metrics: projectMetrics,
          },
        };
      },
      {} as Record<number, { project: any; metrics: Record<string, number> }>,
    );

    // Define metrics descriptions
    const metrics: Record<string, { name: string; description?: string }> =
      metricsData?.reduce(
        (acc, metric) => ({
          ...acc,
          [metric.identifier]: { name: metric.title, description: metric.description },
        }),
        {} as Record<string, { name: string; description?: string }>,
      ) ?? {};

    return { projects, metrics };
  }, [applications, dataToCalculateDistribution, sortedProjects, metricsData]);

  return {
    leaderboardProps,
    isLoading:
      isLoadingPool || isLoadingDataToCalculateDistribution || isLoadingVotes || isLoadingMetrics,
  };
};
