"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
// import { useCreateRound } from "@/hooks/contracts/useCreateRound";
import { FormStep } from "gitcoin-ui/types";
import { mapFormDataToRoundMetadata } from "../../utils/transformRoundMetadata";
import { getRoundSetupSteps } from "./steps";
import { Program, RoundSetupFormData } from "./types";

const GenericProgressForm = dynamic(
  async () => {
    const mod = await import("gitcoin-ui/client");
    return mod.GenericProgressForm;
  },
  { ssr: false },
);

const program: Program = {
  chainId: 10,
  programId: "1",
  programName: "Cool program",
};

export const RoundSetupForm = (): React.ReactNode => {
  const [steps, setSteps] = useState<FormStep[] | null>(null);
  // const { steps, createRoundMutation } = useCreateRound();
  // const { mutateAsync: createRound, isPending: isCreating } = createRoundMutation;

  useEffect(() => {
    const fetchSteps = async () => {
      const resolvedSteps = await getRoundSetupSteps(program);
      setSteps(resolvedSteps);
    };
    fetchSteps();
  }, []);

  const handleSubmit = async (values: RoundSetupFormData) => {
    const { roundMetadata, applicationQuestions } = mapFormDataToRoundMetadata(values);
    console.log("Submitted final values:", values);
    console.log("Mapped round metadata:", roundMetadata);
    console.log("Application questions:", applicationQuestions);
  };

  if (!steps) {
    // TODO: show loading state
    return <div>Loading...</div>;
  }

  return (
    <div suppressHydrationWarning>
      <GenericProgressForm
        name="Round Setup"
        onSubmit={handleSubmit}
        dbName="round-db"
        storeName="new-round"
        steps={steps}
      />
    </div>
  );
};
