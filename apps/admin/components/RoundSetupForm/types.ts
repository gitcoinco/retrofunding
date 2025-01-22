export type Program = {
  chainId: number;
  programId: string;
  programName: string;
};

export interface RoundSetupFormData {
  program: {
    chainId: number;
    programId: string;
    programName: string;
  };
  roundName: string;
  payoutToken: string;
  coverImage: Record<string, unknown>;
  timezone: string;
  roundDates: {
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
  };
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
