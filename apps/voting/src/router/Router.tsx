import { Routes, Route } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { Landing, NotFound, Vote, Leaderboard } from "@/pages";
import { ProtectedVoteRoute } from "./protectedRoutes";

export const Router = () => {
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
