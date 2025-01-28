import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { GenericProgressForm, ProgressModal } from "@gitcoin/ui/client";
import { useToast } from "@gitcoin/ui/hooks/useToast";
import { deleteDBValues } from "@gitcoin/ui/lib";
import { FormStep } from "@gitcoin/ui/types";
import { useAccount } from "wagmi";
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

  useEffect(() => {
    const fetchSteps = async () => {
      const resolvedSteps = await getRoundSetupSteps({
        programId: programId || "",
        chainId: Number(chainId),
      });
      setRoundSteps(resolvedSteps);
      setRoundSetupKeys(resolvedSteps.map((step) => step.formProps.persistKey));
    };
    fetchSteps();
  }, []);

  if (!roundSteps || !roundSetupKeys || !programId || !chainId || !address) {
    // TODO: show loading state
    return <div></div>;
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
      await deleteDBValues([FORM_NAME], "formProgressDB", "formProgress");
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
