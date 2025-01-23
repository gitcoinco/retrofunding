"use client";

import { GenericProgressForm } from "gitcoin-ui/client";
import { programSetupSteps } from "./steps";

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
