import { NATIVE } from "@allo-team/allo-v2-sdk";
import { getAddress, Hex, zeroAddress } from "viem";
import { useBalance as useBalanceHook } from "wagmi";

/**
 * @description Get the balance of a token or native token for a given address on a given chain
 * @param address - The address of the account to get the balance of
 * @param chainId - The chain id of the network
 * @param tokenAddress - The address of the token to get the balance of
 * @returns The balance of the token or native token
 */
export const useBalance = (address: Hex, chainId: number, tokenAddress: Hex) => {
  const token =
    getAddress(tokenAddress) === getAddress(NATIVE) || getAddress(tokenAddress) === zeroAddress
      ? undefined
      : tokenAddress;
  const balance = useBalanceHook({
    address,
    token,
    chainId,
  });

  return balance;
};
