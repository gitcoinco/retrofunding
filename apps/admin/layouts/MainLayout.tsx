"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Navbar, Toaster } from "gitcoin-ui";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col" suppressHydrationWarning>
      <Toaster />
      <Navbar
        text={{ text: "Retrofunding" }}
        primaryLogo={{
          link: "/",
          size: "h-8",
        }}
      >
        <ConnectButton />
      </Navbar>

      <main className="relative flex flex-1 flex-col">{children}</main>
    </div>
  );
};
