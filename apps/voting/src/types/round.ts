import {
  ApplicationAnswer,
  ChainId,
  ImpactMetricId,
  PayoutToken,
  StrategyName,
} from "./allo-indexer";

export interface RetroRound {
  id: string;
  name: string;
  roundName: string;
  description: string;
  chainId: ChainId;
  programId: string;
  programName: string;
  strategyName: StrategyName;
  applicationsEndTime: Date;
  applicationsStartTime: Date;
  donationsEndTime: Date;
  donationsStartTime: Date;
  roles: {
    address: string;
    role: string;
  }[];
  requirements: any[];
  coverImage: string;
  impactMetrics: ImpactMetricId[];
  payoutToken: PayoutToken;
  feesAddress: "";
  feesPercentage: number;
  programContractAddress: string;
  projectId: string;
  roundType: string;
  createdAtBlock: number;
}

export interface RetroRoundWithApplications extends RetroRound {
  applications: RetroApplication[];
}

export interface RetroApplication {
  id: string;
  signature: string;
  round: string;
  answers: ApplicationAnswer[];
  projectId: string;
  title: string;
  description: string;
  logoImg: string;
  bannerImg: string;
  metaPtr: {
    pointer: string;
    protocol: any;
  };
  website: string;
  createdAt: number;
  credentials: any;
  lastUpdated: number;
  recipient: string;
  projectGithub?: string;
  projectTwitter?: string;
}
