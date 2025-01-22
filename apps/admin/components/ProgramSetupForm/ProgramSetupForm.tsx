"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ProgressModal } from "gitcoin-ui";
import { useToast } from "gitcoin-ui/hooks";
import { deleteDBValues } from "gitcoin-ui/lib";
import { Address } from "viem";
import { useCreateProgram } from "@/hooks/contracts";
import { programSetupSteps } from "./steps";

const GenericProgressForm = dynamic(
  async () => {
    const mod = await import("gitcoin-ui/client");
    return mod.GenericProgressForm;
  },
  { ssr: false },
);

const DB_NAME = "program-db";
const STORE_NAME = "new-program";
const PROGRAM_SETUP_KEYS = programSetupSteps.map((step) => step.formProps.persistKey);

const PROGRESS_DB_NAME = "formProgressDB";
const PROGRESS_STORE_NAME = "formProgress";
const PROGRESS_FORM_NAME = "Program Setup";

export const ProgramSetupForm = (): React.ReactNode => {
  const router = useRouter();
  const { toast } = useToast();
  const { steps, createProgramMutation } = useCreateProgram();

  const { mutateAsync: createProgram, isPending: isCreating } = createProgramMutation;

  const handleSubmit = async (values: { name: string; admins: Address[]; chainId: number }) => {
    try {
      await createProgram({
        chainId: Number(values.chainId),
        programName: values.name,
        members: values.admins || [],
      });
      toast({
        status: "success",
        description: "Program created successfully",
      });
      await deleteDBValues([PROGRESS_FORM_NAME], PROGRESS_DB_NAME, PROGRESS_STORE_NAME);
      await deleteDBValues(PROGRAM_SETUP_KEYS, DB_NAME, STORE_NAME);
      router.push("/");
    } catch (error) {
      console.error(error);
      toast({
        status: "error",
        description: "Failed to create program try again",
      });
    }
  };

  return (
    <div suppressHydrationWarning>
      <GenericProgressForm
        name={PROGRESS_FORM_NAME}
        onSubmit={handleSubmit}
        dbName={DB_NAME}
        storeName={STORE_NAME}
        steps={programSetupSteps}
      />
      <ProgressModal isOpen={isCreating} steps={steps} />
    </div>
  );
};
