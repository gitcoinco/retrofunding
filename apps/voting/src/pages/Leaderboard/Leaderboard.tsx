import { useParams } from "react-router";
import { Spinner } from "@gitcoin/ui";
import { getChainInfo } from "@gitcoin/ui/lib";
import { Leaderboard as LeaderboardComponent } from "@gitcoin/ui/retrofunding";
import { SEO } from "@/components/SEO";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { RoundCard } from "./components/RoundCard";

export const Leaderboard = () => {
  const { roundId: roundIdParam, chainId: chainIdParam } = useParams();
  const chainInfo = getChainInfo(Number(chainIdParam));
  const { leaderboardProps, isLoading, round } = useLeaderboard({
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
    <>
      <SEO
        title="Top Projects in GG23: Mature Builders Retro Round 🚀"
        description="Discover the projects that are building long-term impact. Check out the current leaderboard rankings."
        url={`https://retrofunding-vote-git-chore-seo-leaderboard-fa673d-grants-stack.vercel.app/leaderboard/${chainIdParam}/${roundIdParam}`}
        twitterCard="summary"
        image="https://retrofunding-vote-git-chore-seo-leaderboard-fa673d-grants-stack.vercel.app/leaderboard.svg"
      />
      <div
        className="flex flex-col items-center justify-center gap-4 px-4 pt-10 md:px-20"
        key={roundIdParam}
      >
        <RoundCard
          roundName={round?.roundName ?? ""}
          roundDescription={round?.description ?? ""}
          roundDonationsStartTime={round?.donationsStartTime?.toString() ?? ""}
          roundDonationsEndTime={round?.donationsEndTime?.toString() ?? ""}
          roundChainId={chainIdParam ?? ""}
          roundChainName={chainInfo.name}
          roundChainIcon={chainInfo.icon}
          roundId={roundIdParam ?? ""}
        />
        <LeaderboardComponent {...leaderboardProps} padding="xl" />
      </div>
    </>
  );
};
