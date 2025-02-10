import { Modal, Dialog, DialogTitle, IconType, Icon } from "@gitcoin/ui";
import { Form, ProgressModal } from "@gitcoin/ui/client";
import { useToast } from "@gitcoin/ui/hooks/useToast";
import { cn } from "@gitcoin/ui/lib";
import { Address, Hex } from "viem";
import { useUpdateProgram } from "@/hooks/contracts/useUpdateProgram";
import { getEditProgramFormFields } from "./getEditProgramFormFields";

export interface ProgramDetails {
  name: string;
  chainId: number;
  admins: Address[];
  isProgramOwner: boolean;
  programId: Hex;
}

interface EditProgramModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  programDetails: ProgramDetails;
  refetch: () => Promise<void>;
}

// Helper function to create a normalized set from the admin addresses.
const getNormalizedAdminSet = (admins: Address[]): Set<string> =>
  new Set(admins.map((admin) => admin.toLowerCase()));

// Helper function to return addresses that have been removed and added.
const getAdminChanges = (
  oldAdmins: Address[],
  newAdmins: Address[],
): { removed: string[]; added: string[] } => {
  const originalSet = getNormalizedAdminSet(oldAdmins);
  const newSet = getNormalizedAdminSet(newAdmins);

  // Addresses removed: in the original set but not in the new set.
  const removed = [...originalSet].filter((admin) => !newSet.has(admin));

  // Addresses added: in the new set but not in the original set.
  const added = [...newSet].filter((admin) => !originalSet.has(admin));

  return { removed, added };
};

export const EditProgramModal = ({
  isOpen,
  onOpenChange,
  programDetails,
  refetch,
}: EditProgramModalProps) => {
  const formInitialValues = {
    name: programDetails.name,
    chainId: programDetails.chainId.toString(),
    admins: programDetails.admins,
  };
  const { toast } = useToast();
  const step = getEditProgramFormFields(programDetails.isProgramOwner, formInitialValues);

  const { updateProgramMutation, steps } = useUpdateProgram();

  const handleSubmit = async (values: any) => {
    const nameChanged = values.name !== programDetails.name;
    // Determine which addresses were added or removed.
    const { removed, added } = getAdminChanges(programDetails.admins, values.admins);
    const newName = nameChanged ? values.name.toString() : undefined;
    if (nameChanged || removed.length > 0 || added.length > 0) {
      await updateProgramMutation.mutateAsync(
        {
          chainId: programDetails.chainId,
          programId: programDetails.programId,
          membersToRemove: removed as Address[],
          membersToAdd: added as Address[],
          newName,
        },
        {
          onSuccess: async () => {
            await refetch();
            onOpenChange(false);
            toast({
              status: "success",
              title: "Program updated successfully",
              description: "The program has been updated successfully",
            });
          },
          onError: () => {
            toast({
              status: "error",
              title: "Error updating program",
              description: "An error occurred while updating the program",
            });
          },
        },
      );
    } else {
      toast({
        status: "info",
        title: "No changes were made to save",
        description: "Please make some changes to the program and then click save",
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <Modal
          className={cn(
            "m-0 flex flex-col gap-0 p-0 sm:max-w-fit sm:rounded-3xl",
            updateProgramMutation.isPending && "z-40",
          )}
        >
          <div className="flex w-full items-center justify-between rounded-t-3xl bg-grey-50 p-4">
            <DialogTitle className="text-[24px]/[24px] font-semibold">Edit program</DialogTitle>
            <Icon
              className="size-5 cursor-pointer hover:text-grey-500"
              type={IconType.X}
              onClick={() => onOpenChange(false)}
            />
          </div>
          <Form step={step} onSubmit={handleSubmit} className="bg-white" />
        </Modal>
      </Dialog>
      <ProgressModal
        isOpen={updateProgramMutation.isPending}
        onOpenChange={() => {}}
        steps={steps}
      />
    </>
  );
};
