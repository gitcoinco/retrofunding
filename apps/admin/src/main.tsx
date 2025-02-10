import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Routes, Route, HashRouter } from "react-router";
import { MainLayout } from "@/layouts/MainLayout";
import App from "./App";
import { CreateProgram } from "./pages/CreateProgram";
import { CreateRound } from "./pages/CreateRound";
import { ManagePool } from "./pages/ManagePool";
import { Web3Providers } from "./providers";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <StrictMode>
    <Web3Providers>
      <HashRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<App />} />
            <Route path="/create-program" element={<CreateProgram />} />
            <Route path="/create-round" element={<CreateRound />} />
            <Route path="/:chainId/:poolId/manage-round" element={<ManagePool />} />
          </Route>
        </Routes>
      </HashRouter>
    </Web3Providers>
  </StrictMode>,
);
