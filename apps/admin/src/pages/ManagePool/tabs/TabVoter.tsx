import { Form } from "@gitcoin/ui/client";
import { toast } from "@gitcoin/ui/hooks/useToast";
import { FormField } from "@gitcoin/ui/types";
import { Hex } from "viem";
import { LoadingPage } from "@/components/LoadingPage";
import { useUpdatePoolEligibility } from "@/hooks/backend";
import { useGetPool } from "@/hooks/backend/useGetPool";

export const TabVoter = ({ chainId, poolId }: { chainId: number; poolId: string }) => {
  const { data: pool, isLoading } = useGetPool(poolId, chainId);
  const { mutateAsync: updatePoolEligibility } = useUpdatePoolEligibility();

  const voterAllowlistFields: FormField[] = [
    {
      field: {
        name: "voterAllowlist",
        label: "Provide wallet addresses to grant voter access to the round.",
        validation: {
          arrayValidation: {
            itemType: "address",
            minItems: 1,
            maxItems: 100,
            minItemsMessage: "At least one admin is required",
            maxItemsMessage: "Maximum of 100 admins allowed",
          },
        },
      },
      component: "Allowlist",
    },
  ];

  const voterAllowlistArgs = {
    fields: voterAllowlistFields,
    defaultValues: {
      voterAllowlist: pool?.eligibilityCriteria.data.voters,
    },
  };

  const voterStep = {
    formProps: voterAllowlistArgs,
    stepProps: {
      formTitle: "Voters",
      formDescription: "Set the application and funding period dates for your round.",
    },
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  const handleSubmit = async (values: any) => {
    await updatePoolEligibility(
      {
        alloPoolId: poolId,
        chainId: chainId,
        eligibilityType: "linear",
        data: {
          voters: values.voterAllowlist.map((voter: Hex) => voter.trim()),
        },
      },
      {
        onSuccess: (data: boolean) => {
          if (data) {
            toast({
              status: "success",
              description: "Voter allowlist updated successfully",
            });
          }
        },
        onError: (error: any) => {
          console.error(error);
          toast({
            status: "error",
            description: "Error updating voter allowlist",
          });
        },
      },
    );
  };

  return <Form step={voterStep} onSubmit={async (values: any) => await handleSubmit(values)} />;
};
