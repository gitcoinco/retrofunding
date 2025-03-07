import React, { PropsWithChildren } from "react";
import { Outlet } from "react-router";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

interface RouteProps {
  fallback: React.FC<PropsWithChildren<any>>;
  fallbackProps?: any;
}

export const ProtectedRoute = ({ fallback: Fallback }: RouteProps) => {
  const { isConnected, isConnecting } = useAccount();

  const isLoading = isConnecting;

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

  return <Outlet />;
};
