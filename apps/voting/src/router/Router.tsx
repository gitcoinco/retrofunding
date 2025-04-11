import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { MainLayout } from "@/layouts/MainLayout";
import { Landing, NotFound, Vote, Leaderboard } from "@/pages";
import { ProtectedVoteRoute } from "./protectedRoutes";

function useRemoveHashRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const { pathname, hash, search } = window.location;

    // If there's a hash, remove it but keep the path after the hash
    if (hash) {
      // Remove the # and any leading slashes from the hash
      const cleanPath = hash.replace(/^#\/?/, "");
      // Combine with search params if they exist
      const newPath = "/" + cleanPath + (search || "");
      // Use navigate to properly handle the route change
      navigate(newPath, { replace: true });
    }
  }, [navigate]);
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
