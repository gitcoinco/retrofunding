import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ProgressForm, ProgressModal } from "@gitcoin/ui/client";
import { useToast } from "@gitcoin/ui/hooks/useToast";
import { deleteDBValues } from "@gitcoin/ui/lib";
import { FormWithPersistStep as FormStep } from "@gitcoin/ui/types";
import { useAccount } from "wagmi";
import { MessagePage } from "@/components/Message";
import { useCreateRound } from "@/hooks";
import { RoundSetupFormData } from "@/types";
import { getRoundSetupSteps } from "./steps";

export const RoundSetupForm = (): React.ReactNode => {
  const { toast } = useToast();
  const { address } = useAccount();
  const navigate = useNavigate();
  const [roundSteps, setRoundSteps] = useState<FormStep[] | null>(null);
  const [roundSetupKeys, setRoundSetupKeys] = useState<string[] | null>(null);
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
      setRoundSteps(resolvedSteps);
      setRoundSetupKeys(resolvedSteps.map((step) => step.formProps.persistKey));
    };
    fetchSteps();
  }, []);

  if (!roundSteps || !roundSetupKeys || !programId || !chainId || !address) {
    return <MessagePage title="Loading..." message="Loading..." />;
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
      />
      <ProgressModal isOpen={isCreating} steps={steps} />
    </>
  );
};
