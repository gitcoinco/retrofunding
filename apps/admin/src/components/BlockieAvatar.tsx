"use client";

import { AvatarComponent } from "@rainbow-me/rainbowkit";
import { blo } from "blo";
import { Hex } from "viem";

// Custom Avatar for RainbowKit from scaffold-eth
export const BlockieAvatar: AvatarComponent = ({ address, ensImage, size }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    className="rounded-full"
    src={ensImage || blo(address as Hex)}
    width={size}
    height={size}
    alt={`${address} avatar`}
  />
);
