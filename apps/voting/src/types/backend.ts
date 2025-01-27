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

export interface VoteBody extends AlloPoolIdChainId {
  voter: Hex;
  signer: string;
  ballot: Vote[];
}

export interface PredictDistributionBody extends AlloPoolIdChainId {
  ballot: Vote[];
}

interface Vote {
  metricIdentifier: string;
  voteShare: number;
}
