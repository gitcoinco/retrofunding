import { Form } from "@gitcoin/ui/client";
import { FormField } from "@gitcoin/ui/types";
import { useGetPool } from "@/hooks/backend/useGetPool";

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

  console.log("===<", pool?.eligibilityCriteria.data.voters);
  console.log(pool);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <Form step={voterStep} onSubmit={async (values: any) => console.log(values)} />;
};
