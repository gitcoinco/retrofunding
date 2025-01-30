import { ApplicationMetadata, RoundMetadata } from "./roundMetadata";

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

export type RetroRound = {
  id: string;
  roundMetadata: RoundMetadata;
  applicationMetadata: ApplicationMetadata;
  matchTokenAddress: string;
  roles: {
    address: string;
    role: string;
  }[];
  applicationsEndTime: string;
  applicationsStartTime: string;
  donationsEndTime: string;
  donationsStartTime: string;
  createdAtBlock: number;
  strategyName: string;
  project: {
    id: string;
    name: string;
    chainId: number;
  };
};
