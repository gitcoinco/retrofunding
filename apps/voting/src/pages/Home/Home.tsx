"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { LandingPage } from "@gitcoin/ui/retrofunding";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useGetRoundWithApplications } from "@/hooks";

export const Home = () => {
  const [roundId, setRoundId] = useState<string>("");
  const [chainId, setChainId] = useState<string>("");
  const navigate = useNavigate();
  const { roundId: roundIdParam, chainId: chainIdParam } = useParams();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && roundIdParam && chainIdParam) {
      navigate(`/${chainIdParam}/${roundIdParam}/vote`, { replace: true });
    }
  }, [roundIdParam, chainIdParam, navigate, isConnected]);

  const { data: round, isLoading } = useGetRoundWithApplications({
    roundId: roundIdParam as string,
    chainId: parseInt(chainIdParam as string),
  });

  const { name, description } = useMemo<{ name?: string; description?: string }>(() => {
    return {
      name: round?.roundMetadata?.name,
      description: round?.roundMetadata?.eligibility?.description,
    };
  }, [round]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (roundId && chainId) {
        navigate(`/${chainId}/${roundId}`, { replace: true });
      }
    },
    [roundId, chainId, navigate],
  );

  const actionButton = useMemo(
    () =>
      roundIdParam && chainIdParam ? (
        <ConnectButton />
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={chainId}
            onChange={(e) => setChainId(e.target.value)}
            placeholder="Enter Chain ID"
            required
          />
          <input
            type="text"
            value={roundId}
            onChange={(e) => setRoundId(e.target.value)}
            placeholder="Enter Round ID"
            required
          />
          <button type="submit">Go to Round</button>
        </form>
      ),
    [roundId, chainId, roundIdParam, chainIdParam, handleSubmit],
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
