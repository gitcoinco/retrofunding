import { VerticalTabs, Icon } from "@gitcoin/ui";
import { RetroRound } from "@/types";
import { TabApplication } from "./TabApplication";
import { TabDistribute } from "./TabDistribute";
import { TabRoundDate } from "./TabRoundDate";
import { TabRoundDetail } from "./TabRoundDetail";
import { TabVoter } from "./TabVoter";

export const PoolTabs = ({
  chainId,
  poolId,
  poolData,
}: {
  chainId: number;
  poolId: string;
  poolData: RetroRound;
}) => {
  return (
    <div className="px-20">
      <VerticalTabs
        listClassName="justify-normal"
        tabs={[
          {
            tabContent: <TabApplication chainId={chainId} poolId={poolId} />,
            tabIcon: <Icon type="document-duplicate" />,
            tabKey: "applications",
            tabSubtitle: "Review and approve applications",
            tabTitle: "Applications",
          },
          {
            tabContent: <TabRoundDetail poolData={poolData} />,
            tabIcon: <Icon type="pencil" />,
            tabKey: "round-details",
            tabSubtitle: "Configure name and description",
            tabTitle: "Round details",
          },
          // tab round date
          {
            tabContent: <TabRoundDate poolData={poolData} />,
            tabIcon: <Icon type="calendar" />,
            tabKey: "round-date",
            tabSubtitle: "Adjust round and application dates",
            tabTitle: "Round dates",
          },
          // tab voter
          {
            tabContent: <TabVoter chainId={chainId} poolId={poolId} />,
            tabIcon: <Icon type="users" />,
            tabKey: "voter",
            tabSubtitle: "Configure voter settings",
            tabTitle: "Voters",
          },
          ///tab Distribute
          {
            tabContent: <TabDistribute />,
            tabIcon: <Icon type="cash" />,
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
