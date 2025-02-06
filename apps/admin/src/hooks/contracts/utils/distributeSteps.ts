import { ProgressStatus, Step } from "@gitcoin/ui/types";

export const getDistributeProgressSteps = ({
  contractUpdatingStatus,
  indexingStatus,
  finishingStatus,
}: {
  contractUpdatingStatus: ProgressStatus;
  indexingStatus: ProgressStatus;
  finishingStatus: ProgressStatus;
}): Step[] => {
  return [
    {
      name: "Distributing",
      description: `Distributing the funds to the recipients.`,
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
