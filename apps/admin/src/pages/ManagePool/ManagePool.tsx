"use client";

import { useParams } from "react-router";
import { PoolSummary } from "@gitcoin/ui/pool";
import { useAccount } from "wagmi";
import { LoadingPage } from "@/components/LoadingPage";
import { MessagePage } from "@/components/Message";
import { useGetRolesByChainIdAndPoolId, useGetRoundByChainIdAndPoolId } from "@/hooks/allo-indexer";
import { NotAdminDialog } from "./NotAdminDialog";
import { PoolTabs } from "./tabs";

export const ManagePool = () => {
  const { chainId, poolId } = useParams();
  const { address } = useAccount();

  if (!chainId || !poolId) {
    return (
      <MessagePage
        title="Pool Not Found"
        message="The pool you're looking for doesn't exist. Please check the URL."
      />
    );
  }

  let { data: admins, isLoading: isAdminsLoading } = useGetRolesByChainIdAndPoolId(
    Number(chainId),
    poolId,
  );

  const chainIdNumber = parseInt(chainId);
  const {
    data: poolData,
    isLoading,
    isError,
    refetch,
  } = useGetRoundByChainIdAndPoolId(chainIdNumber, poolId);

  if (isLoading || isAdminsLoading) {
    return <LoadingPage />;
  }

  if (isError || !poolData || !poolData.project || !poolData.roundMetadata) {
    return (
      <MessagePage
        title="Pool Missing Data"
        message="Pool data is missing. Please check the URL."
      />
    );
  }

  const isAdmin = admins?.includes(address ?? "");

  if (!isAdmin) {
    return <NotAdminDialog isOpen={true} />;
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

      <PoolTabs chainId={chainIdNumber} poolId={poolId} poolData={poolData} onUpdate={refetch} />
    </div>
  );
};
