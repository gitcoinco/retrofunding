import { useEffect } from "react";
import { Routes, Route } from "react-router";
import { MainLayout } from "@/layouts/MainLayout";
import { Landing, NotFound, Vote } from "@/pages";
import { ProtectedVoteRoute } from "./protectedRoutes";

function useHashRedirect() {
  useEffect(() => {
    const { pathname, hash, search } = window.location;

    // Only redirect if:
    // 1. We're not at the root path
    // 2. There's no hash already
    // 3. It's not a hash-only URL (/#/)
    if (pathname !== "/" && !hash) {
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
        <Route path="/:chainId/:roundId">
          <Route element={<ProtectedVoteRoute fallback={Landing} />}>
            <Route index element={<Vote />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
