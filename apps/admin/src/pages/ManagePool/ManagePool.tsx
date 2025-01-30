"use client";

import { useParams } from "react-router";
import { PoolSummary } from "@gitcoin/ui/pool";
import { PoolType } from "@gitcoin/ui/types";
import { MessagePage } from "@/components/Message";
import { useGetRoundByChainIdAndPoolId } from "@/hooks/allo-indexer/getRoundByChainIdAndPoolId";
import { PoolTabs } from "./tabs";

interface PoolTabsProps {
  chainId: number;
  poolId: string;
  poolData: any; // replace 'any' with your actual type
  onUpdate: () => void;
}

export const ManagePool = () => {
  const { chainId, poolId } = useParams();

  if (!chainId || !poolId) {
    return (
      <MessagePage
        title="Pool Not Found"
        message="The pool you're looking for doesn't exist. Please check the URL."
      />
    );
  }

  const chainIdNumber = parseInt(chainId);
  const {
    data: poolData,
    isLoading,
    isError,
    refetch,
  } = useGetRoundByChainIdAndPoolId(chainIdNumber, poolId);

  if (isLoading) {
    return <MessagePage title="Loading..." message="Loading..." />;
  }

  if (isError || !poolData || !poolData.project || !poolData.roundMetadata) {
    // TODO: redirect to 404 page
    return (
      <MessagePage
        title="Pool Missing Data"
        message="Pool data is missing. Please check the URL."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PoolSummary
        chainId={chainIdNumber}
        poolId={poolId}
        programId={poolData.project.id}
        strategyName={poolData.strategyName}
        name={poolData.roundMetadata.name}
        applicationsStartTime={poolData.applicationsStartTime}
        applicationsEndTime={poolData.applicationsEndTime}
        donationsStartTime={poolData.donationsStartTime}
        donationsEndTime={poolData.donationsEndTime}
      />

      <PoolTabs
        chainId={chainIdNumber}
        poolId={poolId}
        poolData={poolData}
        onUpdate={() => refetch()}
      />
    </div>
  );
};
