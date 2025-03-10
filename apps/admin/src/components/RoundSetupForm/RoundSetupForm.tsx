import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ProgressForm, ProgressModal } from "@gitcoin/ui/client";
import { useToast } from "@gitcoin/ui/hooks/useToast";
import { deleteDBValues } from "@gitcoin/ui/lib";
import { FormWithPersistStep as FormStep } from "@gitcoin/ui/types";
import { Hex } from "viem";
import { useAccount } from "wagmi";
import { useCreateRound } from "@/hooks";
import { RoundSetupFormData } from "@/types";
import { LoadingPage } from "../LoadingPage";
import { LastStepFormSummary } from "./components";
import { getRoundSetupSteps } from "./steps";

export const RoundSetupForm = (): React.ReactNode => {
  const { toast } = useToast();
  const { address } = useAccount();
  const navigate = useNavigate();
  const [roundSteps, setRoundSteps] = useState<FormStep[] | null>(null);
  const [roundSetupKeys, setRoundSetupKeys] = useState<string[] | null>(null);
  const [managers, setManagers] = useState<Hex[]>([]);
  const { steps, createRoundMutation } = useCreateRound();
  const { mutateAsync: createRound, isPending: isCreating } = createRoundMutation;
  const [searchParams] = useSearchParams();
  const programId = searchParams.get("programId");
  const chainId = searchParams.get("chainId");
  const FORM_NAME = "Round Setup";
  const DB_NAME = `round-db-${programId}-${chainId}`;
  const STORE_NAME = `new-round`;
  const STEPS_PERSIST_KEY = `round-setup-steps-${programId}-${chainId}`;

  useEffect(() => {
    const fetchSteps = async () => {
      const resolvedSteps = await getRoundSetupSteps({
        programId: programId || "",
        chainId: Number(chainId),
        address: address,
      });
      setRoundSteps(resolvedSteps.roundSetupSteps);
      setRoundSetupKeys(resolvedSteps.roundSetupSteps.map((step) => step.formProps.persistKey));
      setManagers(resolvedSteps.managers);
    };
    fetchSteps();
  }, []);

  if (!roundSteps || !roundSetupKeys || !programId || !chainId || !address) {
    return <LoadingPage />;
  }

  const handleSubmit = async (values: RoundSetupFormData) => {
    try {
      await createRound({
        data: {
          ...values,
          managers: managers,
        },
      });
      toast({
        status: "success",
        description: "Round created successfully",
      });
      await deleteDBValues([STEPS_PERSIST_KEY], "formProgressDB", "formProgress");
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
      <ProgressForm
        name={FORM_NAME}
        onSubmit={handleSubmit}
        dbName={DB_NAME}
        storeName={STORE_NAME}
        steps={roundSteps}
        stepsPersistKey={STEPS_PERSIST_KEY}
        lastStepFormSummary={LastStepFormSummary}
      />
      <ProgressModal isOpen={isCreating} steps={steps} />
    </>
  );
};
