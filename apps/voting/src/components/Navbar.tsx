"use client";

import { Navbar as GitcoinNavbar } from "@gitcoin/ui";
import { RetrofundingLogoLockup, RetrofundingVoteLogoWordmark } from "@gitcoin/ui/logos";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const primaryLogoLink = import.meta.env.VITE_PRIMARY_LOGO_LINK;
const secondaryLogoLink = import.meta.env.VITE_SECONDARY_LOGO_LINK;

// TODO: use new navbar and wrap the logo with NavLink of react-router
export const Navbar = () => {
  return (
    <GitcoinNavbar
      className="h-24 flex-col items-center justify-between gap-2 bg-white/5 px-0 shadow-[0px_4px_24px_0px_rgba(0,0,0,0.08)] backdrop-blur-[44px] md:h-16 md:flex-row md:px-20"
      primaryLogo={{ link: primaryLogoLink, img: RetrofundingLogoLockup, size: "32px" }}
      secondaryLogo={{ link: secondaryLogoLink, img: RetrofundingVoteLogoWordmark, size: "32px" }}
    >
      <ConnectButton />
    </GitcoinNavbar>
  );
};
