import { LandingPage } from "@gitcoin/ui/retrofunding";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Landing = () => {
  return <LandingPage type="admin" actionButton={<ConnectButton />} />;
};
