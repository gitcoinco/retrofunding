"use client";

import { Outlet } from "react-router";
import { Navbar } from "@/components/Navbar";
import { Web3Providers } from "@/providers";

export const MainLayout = () => {
  return (
    <div style={{ height: "100vh" }} className="flex min-h-full flex-col" suppressHydrationWarning>
      <Web3Providers>
        <header>
          <Navbar />
        </header>
        <main className="relative flex flex-1 flex-col">
          <Outlet />
        </main>
      </Web3Providers>
    </div>
  );
};
