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
    persistKey: "round-edit-voter-allowlist",
    dbName: "round-edit-db",
    storeName: "round-edit-store",
    defaultValues: {
      voterAllowlist: pool?.eligibilityCriteria.data.voters,
    },
  };

  console.log("===<", pool?.eligibilityCriteria.data.voters);
  console.log(pool);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="inline-flex w-full flex-col justify-start gap-6 rounded-3xl bg-[#f7f7f7] p-6">
      <div className="text-2xl font-medium leading-loose text-black">Voters</div>
      <Form {...voterAllowlistArgs} />
    </div>
  );
};
