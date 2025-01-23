import { ConnectButton } from "@rainbow-me/rainbowkit";
import { LandingPage } from "gitcoin-ui/retrofunding";

export const Landing = () => {
  return <LandingPage type="admin" actionButton={<ConnectButton />} />;
};
