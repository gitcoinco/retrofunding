import { Form } from "@gitcoin/ui/client";
import { toast } from "@gitcoin/ui/hooks/useToast";
import { FormField } from "@gitcoin/ui/types";
import { MessagePage } from "@/components/Message";
import { useGetPool } from "@/hooks/backend/useGetPool";
import { updatePoolEligibility } from "@/services/backend/api";

export const TabVoter = ({ chainId, poolId }: { chainId: number; poolId: string }) => {
  const { data: pool, isLoading } = useGetPool(poolId, chainId);

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
    return <MessagePage title="Loading..." message="Loading..." />;
  }

  const handleSubmit = async (values: any) => {
    await updatePoolEligibility({
      alloPoolId: poolId,
      chainId: chainId,
      eligibilityType: "linear",
      data: {
        voters: values.voterAllowlist,
      },
    });

    toast({
      status: "success",
      description: "Voter allowlist updated successfully",
    });
  };

  return <Form step={voterStep} onSubmit={async (values: any) => await handleSubmit(values)} />;
};
