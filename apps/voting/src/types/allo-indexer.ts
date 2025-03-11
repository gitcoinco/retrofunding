export type ProgramWithRounds = {
  id: string;
  chainId: number;
  name: string;
  metadata: {
    name: string;
  };
  roles: {
    address: string;
    role: string;
  }[];
  createdAtBlock: number;
  retroRounds: APIRetroRound[];
  qfRounds: {
    id: string;
  }[];
  dgRounds: {
    id: string;
  }[];
};

export type ImpactMetricId = string;
export type PayoutToken = string;
export type StrategyName = string;
export type ChainId = number;

export interface APIRetroRound {
  id: string;
  strategyName: StrategyName;
  applicationsEndTime: Date;
  applicationsStartTime: Date;
  donationsEndTime: Date;
  donationsStartTime: Date;
  roles: {
    address: string;
    role: string;
  }[];
  roundMetadata: {
    name: string;
    eligibility: {
      description: string;
      requirements: any[];
    };
    retroFundingConfig: {
      coverImage: string;
      impactMetrics: ImpactMetricId[];
      payoutToken: PayoutToken;
      roundName: string;
      program: {
        chainId: ChainId;
        programId: string;
        programName: string;
      };
    };
    feesAddress: "";
    feesPercentage: number;
    programContractAddress: string;
    projectId: string;
    roundType: string;
  };
  createdAtBlock: number;
}

export interface APIRetroRoundWithApplications extends APIRetroRound {
  applications: APIRetroApplication[];
}

export interface APIRetroApplication {
  id: string;
  metadata: {
    signature: string;
    application: {
      round: string;
      answers: ApplicationAnswer[];
      project: {
        id: string;
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
      };
      recipient: string;
    };
  };
}

export interface ApplicationAnswer {
  type: string;
  questionId: number;
  question: string;
  answer: string;
  hidden: boolean;
}
