import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router";
import { MainLayout } from "@/layouts/MainLayout";
import { Home, Vote } from "./pages";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="*" element={<Home />} />
          <Route path="/:chainId/:roundId" element={<Home />} />
          <Route path="/:chainId/:roundId/vote" element={<Vote />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
);
