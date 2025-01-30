import { Hex } from "viem";

export type RoundDetailFormValues = {
  roundName: string;
  program: {
    programId: Hex;
    chainId: number;
    programName: string;
  };
  payoutToken: Hex;
  coverImage: File;
  description: string;
};
