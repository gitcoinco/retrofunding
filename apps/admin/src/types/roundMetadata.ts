export type RoundVisibilityType = "public" | "private";

export interface RetroFundingConfig {
  program: {
    chainId: number;
    programId: string;
    programName: string;
  };
  roundName: string;
  payoutToken: string;
  coverImage: string;
  impactMetrics: string[];
}

export interface RoundMetadata {
  name: string;
  roundType: string;
  eligibility: {
    description: string;
    requirements: Array<{ requirement: string }>;
  };
  projectId: string;
  programContractAddress: string;
  retroFundingConfig: {
    program: {
      chainId: number;
      programId: string;
      programName: string;
    };
    roundName: string;
    payoutToken: string;
    coverImage?: string;
    impactMetrics: string[];
  };
  support?: {
    type: string;
    info: string;
  };
  feesAddress: string;
  feesPercentage: number;
}

export type Requirement = {
  requirement?: string;
};

export type Eligibility = {
  description: string;
  requirements?: Requirement[];
};

export type BaseQuestion = {
  id: number;
  title: string;
  required: boolean;
  hidden: boolean;
  encrypted: boolean;
};

export type ProjectQuestion = {
  id: number;
  type: "project";
};

export type RecipientQuestion = {
  id: number;
  type: "recipient";
};

export type EmailQuestion = BaseQuestion & {
  type: "email";
};

export type AddressQuestion = BaseQuestion & {
  type: "address";
};

export type TextQuestion = BaseQuestion & {
  type: "text" | "short-answer" | "link";
};

export type ParagraphQuestion = BaseQuestion & {
  type: "paragraph";
};

export type MultipleChoiceQuestion = BaseQuestion & {
  type: "multiple-choice";
  options: string[];
};

export type CheckboxQuestion = BaseQuestion & {
  type: "checkbox";
  options: string[];
};

export type DropdownQuestion = BaseQuestion & {
  type: "dropdown";
  options: string[];
};

export type NumberQuestion = BaseQuestion & {
  type: "number";
};

export type RoundApplicationQuestion =
  | AddressQuestion
  | ProjectQuestion
  | RecipientQuestion
  | EmailQuestion
  | TextQuestion
  | ParagraphQuestion
  | MultipleChoiceQuestion
  | CheckboxQuestion
  | DropdownQuestion
  | NumberQuestion;
