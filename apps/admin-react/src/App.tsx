"use client";

import { useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { Admin, Landing } from "@/pages";

const App = () => {
  const { isConnected, isConnecting, isReconnecting } = useAccount();

  const isFirstRender = useRef(true);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  if (isFirstRender.current || isConnecting || isReconnecting) {
    return null; // implement loading button
  }

  if (isConnected) {
    return <Admin />;
  }
  return <Landing />;
};

export default App;
