export type ProgramWithRounds = {
  id: string;
  chainId: number;
  metadata: {
    name: string;
  };
  roles: {
    address: string;
    role: string;
  }[];
  createdAtBlock: number;
  retroRounds: RetroRound[];
  qfRounds: {
    id: string;
  }[];
  dgRounds: {
    id: string;
  }[];
};

type TImpactMetricId = string;
type TPayoutToken = string;
type TStrategyName = string;
type TChainId = number;

export interface RetroRound {
  id: string;
  strategyName: TStrategyName;
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
      impactMetrics: TImpactMetricId[];
      payoutToken: TPayoutToken;
      roundName: string;
      program: {
        chainId: TChainId;
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

export interface RetroRoundWithApplications extends RetroRound {
  applications: RetroApplication[];
}

export interface RetroApplication {
  id: string;
  metadata: {
    signature: string
    application: {
      round:string
      answers: ApplicationAnswer[],
      project: {
        id: string;
        title: string;
        description: string
        logoImg: string;
        bannerImg: string
        metaPtr: {
          pointer: string
          protocol: any
        }
        website: string
        createdAt: number
        credentials: any
        lastUpdated: number
      }
      recipient: string
    }
  }
}

interface ApplicationAnswer {
  type: string;
  questionId: number;
  question: string;
  answer: string;
  hidden: boolean;
}