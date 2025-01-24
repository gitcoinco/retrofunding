import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { GenericProgressForm, ProgressModal } from "gitcoin-ui/client";
import { useToast } from "gitcoin-ui/hooks/useToast";
import { deleteDBValues } from "gitcoin-ui/lib";
import { FormStep } from "gitcoin-ui/types";
import { useCreateRound } from "@/hooks";
import { Program, RoundSetupFormData } from "@/types";
import { getRoundSetupSteps } from "./steps";

const program: Program = {
  chainId: 11155111,
  programId: "0xb818ee969595f1a10364d8978717935e08d42725bc72dbb7c376c3044b3f6be5",
  programName: "Random Program Name",
};

const FORM_NAME = "Round Setup";
const STORE_NAME = "new-round";
const DB_NAME = "round-db";

export const RoundSetupForm = (): React.ReactNode => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [roundSteps, setRoundSteps] = useState<FormStep[] | null>(null);
  const [roundSetupKeys, setRoundSetupKeys] = useState<string[] | null>(null);
  const { steps, createRoundMutation } = useCreateRound();
  const { mutateAsync: createRound, isPending: isCreating } = createRoundMutation;

  useEffect(() => {
    const fetchSteps = async () => {
      const resolvedSteps = await getRoundSetupSteps(program);
      setRoundSteps(resolvedSteps);
      setRoundSetupKeys(resolvedSteps.map((step) => step.formProps.persistKey));
    };
    fetchSteps();
  }, []);

  if (!roundSteps || !roundSetupKeys) {
    // TODO: show loading state
    return <div>Loading...</div>;
  }

  const handleSubmit = async (values: RoundSetupFormData) => {
    try {
      await createRound({
        data: {
          ...values,
        },
      });
      toast({
        status: "success",
        description: "Round created successfully",
      });
      await deleteDBValues([FORM_NAME], DB_NAME, "formProgressDB");
      await deleteDBValues(roundSetupKeys, DB_NAME, STORE_NAME);
      navigate("/");
    } catch (error) {
      console.error(error);
      toast({
        status: "error",
        description: "Failed to create round try again",
      });
    }
  };

  return (
    <>
      <GenericProgressForm
        name={FORM_NAME}
        onSubmit={handleSubmit}
        dbName={DB_NAME}
        storeName={STORE_NAME}
        steps={roundSteps}
      />
      <ProgressModal isOpen={isCreating} steps={steps} />
    </>
  );
};
