"use client";

import { SetupProgressForm } from "gitcoin-ui/setup-progress-form";
import { programSetupSteps } from "./steps";

export const ProgramSetupForm = (): React.ReactNode => {
  const handleSubmit = async (values: any) => {
    console.log("Submitted final values:", values);
  };
  return (
    <div suppressHydrationWarning>
      <SetupProgressForm
        name="Program Setup"
        onSubmit={handleSubmit}
        dbName="program-db"
        storeName="new-program"
        steps={programSetupSteps}
      />
    </div>
  );
};
