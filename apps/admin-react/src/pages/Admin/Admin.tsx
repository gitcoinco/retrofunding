"use client";

import { AdminContent } from "./AdminContent";
import { AdminSideNav } from "./AdminSideNav";

const programs: { name: string; id: string }[] = [];
const rounds: { name: string; id: string }[] = [];

export const Admin = () => {
  // TODO: get programs and rounds from backend
  return (
    <div className="flex justify-between px-20 pt-[52px]">
      <AdminSideNav programs={programs} rounds={rounds} />
      <AdminContent />
    </div>
  );
};
