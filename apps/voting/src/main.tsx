import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router";
import { Web3Providers } from "./providers";
import { routes } from "./routes";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <StrictMode>
    <Web3Providers>
      <HashRouter>{routes}</HashRouter>
    </Web3Providers>
  </StrictMode>,
);
