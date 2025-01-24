import { Metric } from "@/types";
import { getMetricsQuery } from "./queries";
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
