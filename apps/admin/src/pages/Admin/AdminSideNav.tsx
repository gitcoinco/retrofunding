"use client";

import { useMemo } from "react";
import { useNavigate } from "react-router";
import { IconType, SideNav, SideNavItem } from "@gitcoin/ui";

export const AdminSideNav = ({
  programItems = [],
  roundItems = [],
}: {
  programItems: { name: string; chainId: number; programId: string; iconType?: IconType }[];
  roundItems: { name: string; chainId: number; roundId: string; iconType?: IconType }[];
}) => {
  const navigate = useNavigate();

  const onClick = (id: string | undefined) => {
    if (id) {
      navigate(id);
    }
  };

  const items = useMemo<SideNavItem[]>(
    () => [
      {
        content: "Home",
        id: "/",
        iconType: IconType.HOME,
      },
      {
        content: "My Programs",
        id: "/",
        iconType: IconType.BRIEFCASE,
        items: programItems.map(({ name, chainId, programId, iconType }) => ({
          content: name,
          id: `/${chainId}/${programId}/manage-program`,
          iconType,
        })),
      },
      {
        content: "My Rounds",
        id: "/",
        iconType: IconType.COLLECTION,
        items: roundItems.map(({ name, chainId, roundId, iconType }) => ({
          content: name,
          id: `/${chainId}/${roundId}/manage-round`,
          iconType,
        })),
      },
    ],
    [programItems, roundItems],
  );

  return <SideNav className="w-72" items={items} onClick={(id) => onClick(id)} />;
};
