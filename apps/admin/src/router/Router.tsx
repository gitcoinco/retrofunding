import { Routes, Route } from "react-router";
import App from "@/App";
import { MainLayout } from "@/layouts/MainLayout";
import { CreateProgram } from "@/pages";
import { CreateRound } from "@/pages/CreateRound";
import { ManagePool } from "@/pages/ManagePool";

export const Router = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<App />} />
        <Route path="/create-program" element={<CreateProgram />} />
        <Route path="/create-round" element={<CreateRound />} />
        <Route path="/:chainId/:poolId/manage-round" element={<ManagePool />} />
      </Route>
    </Routes>
  );
};
