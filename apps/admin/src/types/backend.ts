import { Hex } from "viem";

export interface Metric {
  id: string;
  identifier: string;
  title: string;
  description: string;
  orientation: string;
}

export interface AlloPoolIdChainId {
  alloPoolId: string;
  chainId: number;
}

export interface LinearEligibilityData {
  voters: Hex[];
}

export interface CreatePoolBody extends AlloPoolIdChainId {
  eligibilityType: string;
  eligibilityData: LinearEligibilityData;
  metricIdentifiers: string[];
}

export type SyncPoolBody = AlloPoolIdChainId;

export interface UpdatePoolEligibilityBody extends AlloPoolIdChainId {
  eligibilityType: string;
  data: LinearEligibilityData;
}

export type CalculatePoolBody = AlloPoolIdChainId;

export interface DistributionItem {
  alloApplicationId: string;
  distributionPercentage: number;
}

export interface DistributionData {
  lastUpdated: string;
  distribution: DistributionItem[];
}

export interface Pool extends AlloPoolIdChainId, DistributionData {
  eligibilityCriteria: {
    eligibilityType: string;
    data: LinearEligibilityData;
  };
  metricIdentifiers: string[];
}

export interface UpdateCustomDistributionBody extends AlloPoolIdChainId {
  signature: Hex;
  distribution: DistributionItem[];
}

export interface DeleteCustomDistributionBody extends AlloPoolIdChainId {
  signature: Hex;
}
