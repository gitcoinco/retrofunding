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
  roundMetadata: {
    name: string;
    retroFundingConfig: {
      coverImage: string;
    };
  };
  roles: {
    address: string;
    role: string;
  }[];
  applicationsEndTime: number;
  applicationsStartTime: number;
  donationsEndTime: number;
  donationsStartTime: number;
  createdAtBlock: number;
};
