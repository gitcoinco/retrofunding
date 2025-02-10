"use client";

import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@gitcoin/ui";
import { LandingPage } from "@gitcoin/ui/retrofunding";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Hex } from "viem";
import { useAccount } from "wagmi";
import { useGetRoundWithApplications } from "@/hooks";
import { useIsVoter } from "@/hooks/useIsVoter";

export const Home = () => {
  const navigate = useNavigate();
  const { roundId: roundIdParam, chainId: chainIdParam } = useParams();
  const { isConnected, address } = useAccount();
  const { data } = useIsVoter({
    alloPoolId: roundIdParam as string,
    chainId: parseInt(chainIdParam as string),
    address: address as Hex,
  });

  const isVoter = data?.isVoter;

  useEffect(() => {
    if (isConnected && roundIdParam && chainIdParam && isVoter) {
      navigate(`/${chainIdParam}/${roundIdParam}/vote`, { replace: true });
    }
  }, [roundIdParam, chainIdParam, navigate, isConnected]);

  const { data: round } = useGetRoundWithApplications({
    roundId: roundIdParam as string,
    chainId: parseInt(chainIdParam as string),
  });

  const { name, description } = round ?? {};

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const chainId = formData.get("chainId") as string;
    const poolId = formData.get("poolId") as string;
    if (poolId && chainId) {
      navigate(`/${chainId}/${poolId}/vote`, { replace: true });
    }
  };

  const isShowForm = !roundIdParam || !chainIdParam || !window.location.pathname.includes("/vote");

  const actionButton = useMemo(
    () =>
      isVoter === false ? (
        <p>You are not a voter</p> // TODO: add the modal based on designs
      ) : isShowForm ? (
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <input type="text" name="chainId" placeholder="Enter Chain ID" required />
            <input type="text" name="poolId" placeholder="Enter Round ID" required />
            <Button type="submit" value="Go to Round" variant="light-purple" />
          </div>
        </form>
      ) : (
        <ConnectButton />
      ),
    [roundIdParam, chainIdParam, handleSubmit],
  );

  return (
    <LandingPage
      type="vote"
      roundName={name}
      roundDescription={description}
      actionButton={actionButton}
    />
  );
};
