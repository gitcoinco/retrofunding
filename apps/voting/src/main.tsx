import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { MainLayout } from "@/layouts/MainLayout";
import { Home, Vote } from "./pages";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="*" element={<Home />} />
          <Route path="/:chainId/:roundId" element={<Home />} />
          <Route path="/:chainId/:roundId/vote" element={<Vote />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
