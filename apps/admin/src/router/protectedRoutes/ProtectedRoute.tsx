import React, { PropsWithChildren } from "react";
import { Outlet, useParams } from "react-router";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useGetRolesByChainIdAndPoolId, useGetUserProgramsAndRounds } from "@/hooks";
import { NotAdminDialog } from "@/pages/ManagePool/NotAdminDialog";

interface RouteProps {
  fallback: React.FC<PropsWithChildren<any>>;
  fallbackProps?: any;
}

export const ProtectedRoute = ({ fallback: Fallback }: RouteProps) => {
  const { isConnected, isConnecting, address } = useAccount();

  const { poolId: poolIdParam, chainId: chainIdParam } = useParams();
  const chainId = parseInt(chainIdParam as string);
  const poolId = poolIdParam as string;

  let isAdminsLoading = false;
  let adminsData: string[] = [];

  if (poolId && chainId) {
    let { data, isLoading } = useGetRolesByChainIdAndPoolId(chainId, poolId);
    adminsData = data ?? [];
    isAdminsLoading = isLoading;
  } else {
    isAdminsLoading = false;
  }

  const isLoading = isConnecting || isAdminsLoading;

  if (isLoading) {
    return <Fallback isLoading={true} />;
  }

  if (!isConnected) {
    return (
      <Fallback>
        <ConnectButton />
      </Fallback>
    );
  }

  if (address && poolId) {
    const isAdmin = adminsData.includes(address.toLowerCase());

    if (!isAdmin) {
      return (
        <Fallback>
          <NotAdminDialog isOpen={true} />
        </Fallback>
      );
    }
  }

  return <Outlet />;
};
