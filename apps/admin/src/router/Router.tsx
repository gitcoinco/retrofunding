import { useEffect } from "react";
import { Routes, Route } from "react-router";
import { MainLayout } from "@/layouts/MainLayout";
import { Admin, CreateProgram, Landing, NotFound } from "@/pages";
import { CreateRound } from "@/pages/CreateRound";
import { ManagePool } from "@/pages/ManagePool";
import { ProtectedRoute } from "./protectedRoutes";

function useHashRedirect() {
  useEffect(() => {
    const { pathname, hash, search } = window.location;

    // Only redirect if:
    // 1. We're not at the root path
    // 2. There's no hash already
    // 3. It's not a hash-only URL (/#/)
    if (pathname !== "/" && !hash && pathname !== "/#/") {
      const cleanPath = pathname.replace(/^\/|\/$/g, "");
      const redirectUrl = new URL(window.location.href);
      redirectUrl.pathname = "/";
      redirectUrl.hash = `#/${cleanPath}`;

      // Preserve any search params
      if (search) {
        redirectUrl.search = search;
      }

      window.location.href = redirectUrl.toString();
    }
  }, []);
}

export const Router = () => {
  useHashRedirect();
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute fallback={Landing} />}>
          <Route index element={<Admin />} />
          <Route path="create-program" element={<CreateProgram />} />
          <Route path="create-round" element={<CreateRound />} />
          <Route path=":chainId/:poolId/manage-round" element={<ManagePool />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
