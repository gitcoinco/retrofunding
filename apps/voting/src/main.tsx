import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Web3Providers } from "./providers";
import { Router } from "./router";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <StrictMode>
    <Web3Providers>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </Web3Providers>
  </StrictMode>,
);
