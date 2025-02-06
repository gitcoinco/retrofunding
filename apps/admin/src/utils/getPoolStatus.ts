import { PoolStatus } from "@gitcoin/ui/types";
import { RetroRound } from "@/types";

export const getPoolStatus = (poolData: RetroRound) => {
  const now = new Date();
  const applicationStartDate = new Date(poolData.applicationsStartTime);
  const applicationEndDate = new Date(poolData.applicationsEndTime);
  const votingStartDate = new Date(poolData.donationsStartTime);
  const votingEndDate = new Date(poolData.donationsEndTime);
  if (now >= applicationStartDate && now <= applicationEndDate) {
    return PoolStatus.ApplicationsInProgress;
  } else if (now >= votingEndDate) {
    return PoolStatus.FundingPending;
  } else if (now >= votingStartDate && now <= votingEndDate) {
    return PoolStatus.RoundInProgress;
  } else {
    return PoolStatus.PreRound;
  }
};
