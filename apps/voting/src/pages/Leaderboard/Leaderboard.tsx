import { useParams } from "react-router";
import { Spinner } from "@gitcoin/ui";
import { Leaderboard as LeaderboardComponent } from "@gitcoin/ui/retrofunding";
import { useLeaderboard } from "@/hooks/useLeaderboard";

export const Leaderboard = () => {
  const { roundId: roundIdParam, chainId: chainIdParam } = useParams();

  const { leaderboardProps, isLoading } = useLeaderboard({
    poolId: roundIdParam,
    chainId: Number(chainIdParam),
  });

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="font-ui-sans text-xl font-medium">Loading...</p>
        <Spinner />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center gap-4 px-4 pt-10 md:px-20"
      key={roundIdParam}
    >
      <LeaderboardComponent {...leaderboardProps} padding="xl" />
    </div>
  );
};
