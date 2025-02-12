import { Routes, Route } from "react-router";
import { MainLayout } from "@/layouts/MainLayout";
import { Landing, Vote } from "@/pages";
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
        <Route path="*" element={<p>Not found</p>} />
      </Route>
    </Routes>
  );
};
