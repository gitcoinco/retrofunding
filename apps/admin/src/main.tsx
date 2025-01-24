import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import { MainLayout } from "@/layouts/MainLayout";
import App from "./App";
import { CreateProgram } from "./pages/CreateProgram";
import { CreateRound } from "./pages/CreateRound";
import "./index.css";

// TODO: Add route protection when the user is not connected

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<App />} />
          <Route path="/create-program" element={<CreateProgram />} />
          <Route path="/create-round" element={<CreateRound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
