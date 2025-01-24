"use client";

import { useAccount } from "wagmi";
import { Admin, Landing } from "@/pages";

const App = () => {
  const { isConnected } = useAccount();

  if (isConnected) {
    return <Admin />;
  }
  return <Landing />;
};

export default App;
