import { Icon } from "gitcoin-ui";
import { getChainInfo } from "gitcoin-ui/lib";

export const renderChainIcon = (chainId: number) => {
  return <Icon type={getChainInfo(chainId).icon} />;
};
