import { Distribution, RetroBallot } from "@/types";
import { PreparedCalculationData } from "@/types";

const normalizeScore = (rawScore: number, maxValue: number, isIncreasing: boolean): number => {
  let normalizedScore = rawScore / maxValue;
  if (!isIncreasing) {
    normalizedScore = +(1 - normalizedScore);
  }
  return normalizedScore;
};

// New calculation function with explicit parameter types
export const calculateDistribution = (
  preparedData: PreparedCalculationData,
  ballots: Array<Partial<RetroBallot>>,
): Distribution[] => {
  const { pool, isIncreasingMap, applicationToMetricsScores, metricsBounds } = preparedData;

  const appToWeightedScores: Record<string, number> = {};

  for (const metricScore of applicationToMetricsScores) {
    const { alloApplicationId, metricIdentifier, metricScore: rawScore } = metricScore;

    // Get metric details from the pool
    if (!pool.metricIdentifiers.includes(metricIdentifier)) {
      throw new Error(`Metric "${metricIdentifier}" not found in pool`);
    }

    const { maxValue } = metricsBounds[metricIdentifier];
    const isIncreasing = isIncreasingMap[metricIdentifier] as boolean;
    const normalizedScore = normalizeScore(rawScore, maxValue, isIncreasing);

    // Get vote share for the metric
    const totalVoteShare = ballots.reduce((sum, vote) => {
      const ballotItem = vote.votes?.find((item) => item.metricIdentifier === metricIdentifier);

      return ballotItem !== undefined ? sum + ballotItem.voteShare : sum;
    }, 0);
    // Weighted score for this metric
    const weightedScore = (normalizedScore * totalVoteShare) / 100;

    // Add to application's total score
    if (appToWeightedScores[alloApplicationId] === undefined) {
      appToWeightedScores[alloApplicationId] = 0;
    }
    appToWeightedScores[alloApplicationId] += weightedScore;
  }

  // Calculate total weighted scores across all applications
  const totalWeightedScore = Object.values(appToWeightedScores).reduce(
    (sum, score) => sum + score,
    0,
  );

  // Calculate distribution percentages
  const distributions = Object.entries(appToWeightedScores).map(
    ([alloApplicationId, weightedScore]) => {
      const distributionPercentage =
        totalWeightedScore > 0 ? (weightedScore / totalWeightedScore) * 100 : 0;
      return {
        alloApplicationId,
        distributionPercentage,
      };
    },
  );

  // Sort by distribution percentage descending
  distributions.sort((a, b) => b.distributionPercentage - a.distributionPercentage);

  return distributions;
};
