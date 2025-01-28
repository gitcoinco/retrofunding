"use client";

import { Navbar as GitcoinNavbar } from "@gitcoin/ui";
import { RetrofundingLogoLockup } from "@gitcoin/ui/logos";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// TODO: use new navbar and wrap the logo with NavLink of react-router
export const Navbar = () => {
  return (
    <GitcoinNavbar
      className="bg-white/5 shadow-[0px_4px_24px_0px_rgba(0,0,0,0.08)] backdrop-blur-[44px]"
      showDivider={false}
      primaryLogo={{ link: "/", img: RetrofundingLogoLockup, size: "32px" }}
    >
      <ConnectButton />
    </GitcoinNavbar>
  );
};
