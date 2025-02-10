import { Routes, Route } from "react-router";
import { MainLayout } from "@/layouts/MainLayout";
import { Home, Vote } from "./pages";

export const routes = (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="*" element={<Home />} />
      <Route path="/:chainId/:roundId" element={<Home />} />
      <Route path="/:chainId/:roundId/vote" element={<Vote />} />
    </Route>
  </Routes>
);
