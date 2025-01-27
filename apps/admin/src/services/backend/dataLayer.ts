import { Metric, Pool, PoolDistribution } from "@/types";
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
    const pool = response.pool[0];
    pool.metricIdentifiers = pool.metricIdentifiers.split(",");
    pool.distributionData = JSON.parse(pool.distributionData) as PoolDistribution;
    return pool;
  } catch (error) {
    console.error("Error fetching metrics:", error);
    throw error;
  }
};

export const getPoolDistribution = async (
  alloPoolId: string,
  chainId: number,
): Promise<PoolDistribution> => {
  try {
    const response = await executeQuery(getPoolDistributionQuery, { alloPoolId, chainId });
    return response.pools[0].distributionData.json();
  } catch (error) {
    console.error("Error fetching pool distribution:", error);
    throw error;
  }
};
