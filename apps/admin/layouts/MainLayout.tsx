"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Navbar } from "gitcoin-ui";
import { Suspense } from "react";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen" suppressHydrationWarning>
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar
          text={{ text: "Retrofunding" }}
          primaryLogo={{
            link: "/",
            size: "h-8",
          }}
        >
          <ConnectButton />
        </Navbar>
      </Suspense>
      <main className="relative flex flex-col flex-1">{children}</main>
    </div>
  );
};
