"use client";

import { useSearchParams } from "react-router";
import { VerticalTabs, Icon, IconType } from "@gitcoin/ui";
import { RefetchOptions } from "@tanstack/react-query";
import { QueryObserverResult } from "@tanstack/react-query";
import { RetroRound } from "@/types";
import { TabApplication } from "./TabApplication";
import { TabDistribute } from "./TabDistribute";
import { TabRoundDate } from "./TabRoundDate";
import { TabRoundDetail } from "./TabRoundDetail";
import { TabVoter } from "./TabVoter";

interface PoolTabsProps {
  chainId: number;
  poolId: string;
  poolData: RetroRound;
  onUpdate: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<RetroRound, Error>>;
}

export const PoolTabs = ({ chainId, poolId, poolData, onUpdate }: PoolTabsProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "applications";

  const handleTabChange = (tab: any) => {
    setSearchParams({ tab });
  };

  return (
    <div className="px-20">
      <VerticalTabs
        listClassName="justify-normal"
        value={tab}
        onValueChange={handleTabChange}
        tabs={[
          {
            tabContent: <TabApplication chainId={chainId} poolId={poolId} />,
            tabIcon: <Icon type={IconType.DOCUMENT_DUPLICATE} />,
            tabKey: "applications",
            tabSubtitle: "Review and approve applications",
            tabTitle: "Applications",
          },
          {
            tabContent: <TabRoundDetail poolData={poolData} poolId={poolId} onUpdate={onUpdate} />,
            tabIcon: <Icon type={IconType.PENCIL} />,
            tabKey: "round-details",
            tabSubtitle: "Configure name and description",
            tabTitle: "Round details",
          },
          // tab round date
          {
            tabContent: <TabRoundDate poolData={poolData} onUpdate={onUpdate} />,
            tabIcon: <Icon type={IconType.CALENDAR} />,
            tabKey: "round-date",
            tabSubtitle: "Adjust round and application dates",
            tabTitle: "Round dates",
          },
          // tab voter
          {
            tabContent: <TabVoter chainId={chainId} poolId={poolId} />,
            tabIcon: <Icon type={IconType.USERS} />,
            tabKey: "voter",
            tabSubtitle: "Configure voter settings",
            tabTitle: "Voters",
          },
          ///tab Distribute
          {
            tabContent: <TabDistribute roundData={poolData} onUpdate={onUpdate} />,
            tabIcon: <Icon type={IconType.CASH} />,
            tabKey: "distribute",
            tabSubtitle: "Fund your round and distribute tokens",
            tabTitle: "Fund and distribute",
          },
        ]}
        withIcons
      />
    </div>
  );
};
