import { DistributionData, Metric, Pool } from "@/types";
import { getMetricsQuery, getPoolQuery, getPoolDistributionQuery } from "./queries";
import { executeQuery } from "./retrofundingClient";

export const getMetrics = async (): Promise<Metric[]> => {
  try {
    const response = await executeQuery(getMetricsQuery, {});
    return response.metrics;
  } catch (error) {
    console.error("Error fetching metrics:", error);
    throw error;
  }
};

export const getPool = async (alloPoolId: string, chainId: number): Promise<Pool> => {
  try {
    const response = await executeQuery(getPoolQuery, { alloPoolId, chainId });
    const pool = response.pools[0];
    const metrics = pool?.metricIdentifiers;
    pool.metricIdentifiers = metrics ? metrics.split(",") : [];
    pool.distributionData = JSON.parse(pool.distributionData) as DistributionData;
    return pool;
  } catch (error) {
    console.error("Error fetching metrics:", error);
    throw error;
  }
};

export const getPoolDistribution = async (
  alloPoolId: string,
  chainId: number,
): Promise<{
  distributionData: DistributionData;
  customDistributionData?: DistributionData;
}> => {
  try {
    const response = await executeQuery(getPoolDistributionQuery, { alloPoolId, chainId });
    const pool = response.pools[0];
    const distributionData = JSON.parse(pool.distributionData);
    const customDistributionData = pool.customDistributionData
      ? JSON.parse(pool.customDistributionData)
      : undefined;
    return {
      distributionData,
      customDistributionData,
    };
  } catch (error) {
    console.error("Error fetching pool distribution:", error);
    throw error;
  }
};
