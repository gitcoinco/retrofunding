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

export interface SyncPoolBody extends AlloPoolIdChainId {}
export interface Distribution {
  alloApplicationId: string;
  distributionPercentage: number;
}

export interface PoolDistribution {
  lastUpdated: string;
  distributions: Distribution[];
}

export interface Pool extends AlloPoolIdChainId, PoolDistribution {
  eligibilityCriteria: {
    eligibilityType: string;
    data: LinearEligibilityData;
  };
  metricIdentifiers: string[];
}

export interface RetroVoteBody extends AlloPoolIdChainId {
  voter: Hex;
  signature: string;
  ballot: RetroVote[];
}

export interface PredictDistributionBody extends AlloPoolIdChainId {
  ballot: RetroVote[];
}

export interface RetroVote {
  metricIdentifier: string;
  voteShare: number;
}

export interface GetVoteResponse {
  updatedAt: Date;
  ballot: RetroVote[];
}
