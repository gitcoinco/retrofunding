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

export type CalculatePoolBody = AlloPoolIdChainId;

export type CalculatePoolResponse = {
  distributions: Distribution[];
};

type Distribution = {
  alloApplicationId: string;
  distributionPercentage: number;
};
