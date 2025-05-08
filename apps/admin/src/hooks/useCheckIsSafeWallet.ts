import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const useCheckIsSafeWallet = () => {
  const { connector } = useAccount();
  const [isSafeWallet, setIsSafeWallet] = useState(false);
  useEffect(() => {
    if (connector?.id && connector.id === "safe") {
      setIsSafeWallet(true);
    } else {
      setIsSafeWallet(false);
    }
  }, [connector]);
  return isSafeWallet;
};
