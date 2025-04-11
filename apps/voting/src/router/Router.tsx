import { useEffect } from "react";
import { Routes, Route } from "react-router";
import { MainLayout } from "@/layouts/MainLayout";
import { Landing, NotFound, Vote, Leaderboard } from "@/pages";
import { ProtectedVoteRoute } from "./protectedRoutes";

function useRemoveHashRedirect() {
  useEffect(() => {
    const { pathname, hash, search } = window.location;

    // If there's a hash, remove it and update the URL
    if (hash) {
      const newPath = pathname + search;
      // Use replaceState to avoid adding to browser history
      window.history.replaceState({}, "", newPath);
    }
  }, []);
}

export const Router = () => {
  useRemoveHashRedirect();
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/:chainId/:roundId">
          <Route element={<ProtectedVoteRoute fallback={Landing} />}>
            <Route index element={<Vote />} />
          </Route>
        </Route>
        <Route path="leaderboard/:chainId/:roundId">
          <Route index element={<Leaderboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
