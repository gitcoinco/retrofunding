import { Routes, Route } from "react-router";
import { MainLayout } from "@/layouts/MainLayout";
import { Admin, CreateProgram, Landing } from "@/pages";
import { CreateRound } from "@/pages/CreateRound";
import { ManagePool } from "@/pages/ManagePool";
import { ProtectedRoute } from "./protectedRoutes";

export const Router = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute fallback={Landing} />}>
          <Route path="/" element={<Admin />} />
          <Route path="/create-program" element={<CreateProgram />} />
          <Route path="/create-round" element={<CreateRound />} />
          <Route path="/:chainId/:poolId/manage-round" element={<ManagePool />} />
        </Route>
      </Route>
    </Routes>
  );
};
