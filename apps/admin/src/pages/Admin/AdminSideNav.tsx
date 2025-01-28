"use client";

import { useMemo } from "react";
import { IconType, SideNav, SideNavItem } from "@gitcoin/ui";

export const AdminSideNav = ({
  programItems = [],
  roundItems = [],
}: {
  programItems: { name: string; id: string; iconType?: IconType }[];
  roundItems: { name: string; id: string; iconType?: IconType }[];
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
        items: programItems.map(({ name, id, iconType }) => ({
          content: name,
          id: `/my-programs/${id}`,
          iconType,
        })),
      },
      {
        content: "My Rounds",
        id: "/my-rounds",
        iconType: IconType.COLLECTION,
        items: roundItems.map(({ name, id, iconType }) => ({
          content: name,
          id: `/my-rounds/${id}`,
          iconType,
        })),
      },
    ],
    [programItems, roundItems],
  );

  return <SideNav className="w-72" items={items} onClick={() => {}} />;
};
