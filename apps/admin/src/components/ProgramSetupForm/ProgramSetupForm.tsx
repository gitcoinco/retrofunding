import { useNavigate } from "react-router";
import { ProgressModal } from "@gitcoin/ui/client";
import { GenericProgressForm } from "@gitcoin/ui/client";
import { useToast } from "@gitcoin/ui/hooks/useToast";
import { deleteDBValues } from "@gitcoin/ui/lib";
import { Address } from "viem";
import { useCreateProgram } from "@/hooks";
import { programSetupSteps } from "./steps";

const DB_NAME = "program-db";
const STORE_NAME = "new-program";
const STEPS_PERSIST_KEY = "program-setup-progress";
const PROGRAM_SETUP_KEYS = programSetupSteps.map((step) => step.formProps.persistKey);

const PROGRESS_DB_NAME = "formProgressDB";
const PROGRESS_STORE_NAME = "formProgress";
const PROGRESS_FORM_NAME = "Program Setup";

export const ProgramSetupForm = (): React.ReactNode => {
  const { toast } = useToast();
  const navigate = useNavigate();
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
      await deleteDBValues([STEPS_PERSIST_KEY], PROGRESS_DB_NAME, PROGRESS_STORE_NAME);
      await deleteDBValues(PROGRAM_SETUP_KEYS, DB_NAME, STORE_NAME);
      navigate("/");
    } catch (error) {
      console.error(error);
      toast({
        status: "error",
        description: "Failed to create program try again",
      });
    }
  };

  return (
    <div>
      <GenericProgressForm
        name={PROGRESS_FORM_NAME}
        onSubmit={handleSubmit}
        dbName={DB_NAME}
        storeName={STORE_NAME}
        steps={programSetupSteps}
        stepsPersistKey={STEPS_PERSIST_KEY}
      />
      <ProgressModal isOpen={isCreating} steps={steps} />
    </div>
  );
};
