import { ProgressStatus, Step } from "@gitcoin/ui/types";

export const getCreateProgramProgressSteps = ({
  uploadMetadataStatus,
  contractUpdatingStatus,
  indexingStatus,
  finishingStatus,
}: {
  uploadMetadataStatus: ProgressStatus;
  contractUpdatingStatus: ProgressStatus;
  indexingStatus: ProgressStatus;
  finishingStatus: ProgressStatus;
}): Step[] => {
  return [
    {
      name: "Uploading Program Metadata",
      description: "Uploading program metadata to IPFS.",
      status: uploadMetadataStatus,
    },
    {
      name: "Creating Program",
      description: `Creating program on the contract.`,
      status: contractUpdatingStatus,
    },
    {
      name: "Indexing",
      description: "Indexing the data.",
      status: indexingStatus,
    },
    {
      name: "Finishing",
      description: "Just another moment while we finish things up.",
      status: finishingStatus,
    },
  ];
};
