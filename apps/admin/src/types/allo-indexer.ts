import { Address, Hex } from "viem";
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
  chainId: number;
  strategyAddress: string;
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
  support: {
    type: string;
    info: string;
  };
  applications: {
    id: string;
    anchorAddress: Address;
    metadata: {
      application: {
        project: {
          title: string;
          logoImg?: string;
          bannerImg?: string;
        };
        recipient: Address;
      };
    };
    status: string;
    distributionTransaction?: Hex;
  }[];
};
