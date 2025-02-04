import { PoolDistribution, Metric, Pool } from "@/types";
import { getMetricsQuery, getFilteredMetricsQuery, getPoolDistributionQuery, getPoolQuery, getVotersQuery } from "./queries";
import { executeQuery } from "./retrofundingClient";

export const getVoters = async (alloPoolId: string, chainId: number): Promise<string[]> => {
  const response = await executeQuery(getVotersQuery, { alloPoolId, chainId });
  return response.pools[0].eligibilityCriteria.data.voters;
};

export const getMetrics = async (identifiers?: string[]): Promise<Metric[]> => {
  try {
    if (!identifiers || identifiers.length === 0) {
      const response = await executeQuery(getMetricsQuery, {});
      return response.metrics;
    }
    const response = await executeQuery(getFilteredMetricsQuery, { identifiers });
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
