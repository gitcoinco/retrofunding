import { ProgressStatus, Step } from "@gitcoin/ui/types";

export const getUpdateTimestampsProgressSteps = ({
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
      name: "Updating Timestamps",
      description: `Updating timestamps on the contract.`,
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
