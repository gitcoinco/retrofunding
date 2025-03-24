import Decimal from "decimal.js";
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

export enum EligibilityType {
  Linear = "linear",
  Weighted = "weighted",
}

export interface LinearEligibilityData {
  voters: Hex[];
}

export interface WeightedEligibilityData {
  voters: Record<Hex, number>;
}

export interface CreatePoolBody extends AlloPoolIdChainId {
  eligibilityType: EligibilityType;
  eligibilityData: LinearEligibilityData | WeightedEligibilityData;
  metricIdentifiers: string[];
}

export type SyncPoolBody = AlloPoolIdChainId;

export interface UpdatePoolEligibilityBody extends AlloPoolIdChainId {
  signature: Hex;
  eligibilityType: EligibilityType;
  data: LinearEligibilityData | WeightedEligibilityData;
}

export type CalculatePoolBody = AlloPoolIdChainId;

export interface DistributionItem {
  alloApplicationId: string;
  distributionPercentage: Decimal;
}

export interface DistributionData {
  lastUpdated: string;
  distribution: DistributionItem[];
}

export interface Pool extends AlloPoolIdChainId, DistributionData {
  eligibilityCriteria: {
    eligibilityType: EligibilityType;
    data: LinearEligibilityData | WeightedEligibilityData;
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
