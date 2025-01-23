"use client";

import { useMemo } from "react";
import { IconType, SideNav, SideNavItem } from "gitcoin-ui";

export const AdminSideNav = ({
  programs = [],
  rounds = [],
}: {
  programs: { name: string; id: string }[];
  rounds: { name: string; id: string }[];
}) => {
  const items = useMemo<SideNavItem[]>(
    () => [
      {
        content: "Home",
        id: "/home",
        iconType: IconType.HOME,
      },
      {
        content: "My Programs",
        id: "/my-programs",
        iconType: IconType.BRIEFCASE,
        items: programs.map(({ name, id }) => ({
          content: name,
          id: `/my-programs/${id}`,
        })),
      },
      {
        content: "My Rounds",
        id: "/my-rounds",
        iconType: IconType.COLLECTION,
        items: rounds.map(({ name, id }) => ({
          content: name,
          id: `/my-rounds/${id}`,
        })),
      },
    ],
    [programs, rounds],
  );

  return <SideNav className="w-72" items={items} onClick={() => {}} />;
};
