import { ApplicationPayout } from "@gitcoin/ui/types";
import Decimal from "decimal.js";
import { DistributionData, RetroRound } from "@/types";

// Configure Decimal.js for maximum precision
Decimal.set({
  precision: 64, // Precision for financial calculations
  rounding: Decimal.ROUND_DOWN, // Better for financial calculations (prevents overshooting)
});

export const transformDistributeApplications = (
  roundData: RetroRound,
  poolDistribution?: DistributionData,
): ApplicationPayout[] => {
  const applicationsPercentages: Record<string, Decimal> = {};

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
      applicationsPercentages[application.id] = new Decimal(0);
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
