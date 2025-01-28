"use client";

import { Outlet } from "react-router";
import { Toaster } from "@gitcoin/ui";
import { Navbar } from "@/components/Navbar";
import { Web3Providers } from "@/providers";

export const MainLayout = () => {
  return (
    <div style={{ height: "100vh" }} className="flex min-h-full flex-col">
      <Web3Providers>
        <Toaster />
        <Navbar />
        <main className="relative flex flex-1 flex-col">
          <Outlet />
        </main>
      </Web3Providers>
    </div>
  );
};
