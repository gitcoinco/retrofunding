import { Form } from "@gitcoin/ui/client";
import { toast } from "@gitcoin/ui/hooks/useToast";
import { FormField } from "@gitcoin/ui/types";
import { Hex } from "viem";
import { LoadingPage } from "@/components/LoadingPage";
import { useUpdatePoolEligibility } from "@/hooks/backend";
import { useGetPool } from "@/hooks/backend/useGetPool";
import { EligibilityType } from "@/types";

export const TabVoter = ({ chainId, poolId }: { chainId: number; poolId: string }) => {
  const { data: pool, isLoading } = useGetPool(poolId, chainId);
  const { mutateAsync: updatePoolEligibility } = useUpdatePoolEligibility();

  const voterAllowlistFields: FormField[] = [
    {
      field: {
        name: "voterAllowlist",
        label: "",
        validation: {
          objectValidation: {
            properties: {
              addresses: {
                type: "array",
                label: "addresses",
                isRequired: true,
                arrayValidation: {
                  minItems: 1,
                  minItemsMessage: "At least one address is required",
                  itemType: "address",
                },
              },
              weights: {
                type: "array",
                label: "weights",
                arrayValidation: {
                  minItems: 0,
                  maxItems: Number.MAX_SAFE_INTEGER,
                  itemType: "number",
                },
                isRequired: false,
              },
              isWeighted: {
                type: "boolean",
                label: "Weighted",
                isRequired: false,
              },
            },
          },
        },
      },
      component: "WeightedAllowlist",
    },
  ];

  const eligibilityData = pool?.eligibilityCriteria.data;

  const eligibilityCriteria = pool?.eligibilityCriteria.eligibilityType;

  const isWeighted = eligibilityCriteria === EligibilityType.Weighted.toLocaleUpperCase();

  const voterAllowlistArgs = {
    fields: voterAllowlistFields,
    defaultValues: {
      voterAllowlist: {
        addresses: isWeighted
          ? Object.keys(eligibilityData?.voters as Record<Hex, number>)
          : eligibilityData?.voters,
        weights: isWeighted ? Object.values(eligibilityData?.voters as Record<Hex, number>) : [],
        isWeighted: isWeighted,
      },
    },
  };

  const voterStep = {
    formProps: voterAllowlistArgs,
    stepProps: {
      formTitle: "Voters",
      formDescription:
        "Provide wallet addresses to grant voter access to the round, with the option to assign a weight to each voter's votes.",
    },
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  const handleSubmit = async (values: any) => {
    const eligibilityType = values.voterAllowlist.isWeighted
      ? EligibilityType.Weighted
      : EligibilityType.Linear;
    const data =
      eligibilityType === EligibilityType.Weighted
        ? {
            voters: values.voterAllowlist.addresses.reduce(
              (acc: Record<Hex, number>, voter: Hex) => {
                acc[voter] =
                  values.voterAllowlist.weights[values.voterAllowlist.addresses.indexOf(voter)];
                return acc;
              },
              {},
            ),
          }
        : {
            voters: values.voterAllowlist.addresses.map((voter: Hex) => voter.trim()),
          };

    await updatePoolEligibility(
      {
        alloPoolId: poolId,
        chainId: chainId,
        eligibilityType: eligibilityType,
        data,
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
