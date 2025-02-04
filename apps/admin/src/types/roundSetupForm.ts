import { Hex } from "viem";

export type Program = {
  chainId: number;
  programId: string;
  programName: string;
};

export interface RoundDates {
  noEndDate: boolean;
  timezone: string;
  applications: {
    start: string;
    end: string;
  };
  round: {
    start: string;
    noEndDate: boolean;
    end: string;
  };
}

export interface RoundSetupFormData {
  program: {
    chainId: number;
    programId: string;
    programName: string;
  };
  roundName: string;
  supportType: string;
  supportInfo: string;
  payoutToken: Hex;
  coverImage: File;
  timezone: string;
  roundDates: RoundDates;
  description: string;
  requirements: string[];
  impactMetrics: string[];
  applicationQuestions: {
    requirements: {
      twitter: {
        verification: boolean;
      };
      github: {
        verification: boolean;
      };
    };
    questions: Array<{
      id: number;
      title: string;
      type: string;
      required: boolean;
      hidden: boolean;
      encrypted: boolean;
      choices: string[];
    }>;
  };
  voterAllowlist: string[];
}
