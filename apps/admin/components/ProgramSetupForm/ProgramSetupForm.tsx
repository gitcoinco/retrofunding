"use client";

import dynamic from "next/dynamic";
import { programSetupSteps } from "./steps";

const GenericProgressForm = dynamic(
  async () => {
    const mod = await import("gitcoin-ui/client");
    return mod.GenericProgressForm;
  },
  { ssr: false },
);

export const ProgramSetupForm = (): React.ReactNode => {
  const handleSubmit = async (values: any) => {
    console.log("Submitted final values:", values);
  };

  return (
    <div suppressHydrationWarning>
      <GenericProgressForm
        name="Program Setup"
        onSubmit={handleSubmit}
        dbName="program-db"
        storeName="new-program"
        steps={programSetupSteps}
      />
    </div>
  );
};
