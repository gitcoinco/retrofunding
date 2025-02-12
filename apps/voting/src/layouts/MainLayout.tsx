"use client";

import { Outlet } from "react-router";
import { Toaster } from "@gitcoin/ui";
import { Navbar } from "@/components/Navbar";

export const MainLayout = () => {
  return (
    <div style={{ height: "100vh" }} className="flex min-h-full flex-col">
      <Toaster />
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
};
