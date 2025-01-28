import { ProgressStatus, Step } from "@gitcoin/ui/types";

export const getCreateRoundProgressSteps = ({
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
      name: "Uploading Round Metadata",
      description: "Uploading round metadata to IPFS.",
      status: uploadMetadataStatus,
    },
    {
      name: "Creating Round",
      description: `Creating round on the contract.`,
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
