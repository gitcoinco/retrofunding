import { ApplicationPayout } from "@gitcoin/ui/types";
import { DistributionData, RetroRound } from "@/types";

export const transformDistributeApplications = (
  roundData: RetroRound,
  poolDistribution?: DistributionData,
): ApplicationPayout[] => {
  const applicationsPercentages: Record<string, number> = {};

  if (!roundData?.applications) {
    return [];
  }

  const filteredApplications = roundData.applications.filter(
    (application) => application.status === "APPROVED",
  );

  if (poolDistribution?.distribution) {
    poolDistribution.distribution.forEach((application) => {
      applicationsPercentages[application.alloApplicationId] = application.distributionPercentage;
    });
  } else {
    filteredApplications.forEach((application) => {
      applicationsPercentages[application.id] = 0;
    });
  }

  const applications = filteredApplications
    .map((application) => {
      let imageCID = application.metadata.application.project.logoImg;
      if (!imageCID) {
        // Default imageCID logo
        imageCID = "bafkreihbauobycfxsvr5gm5kad7r74vequsz3dcuozvqori3aukm7hnsju";
      }
      return {
        id: application.id,
        title: application.metadata.application.project.title,
        imageUrl: `https://ipfs.io/ipfs/${imageCID}`,
        payoutAddress: application.metadata.application.recipient,
        payoutPercentage: applicationsPercentages[application.id],
        payoutTransactionHash: application.distributionTransaction,
      };
    })
    .filter((application) => application.payoutPercentage !== undefined);
  return applications;
};
