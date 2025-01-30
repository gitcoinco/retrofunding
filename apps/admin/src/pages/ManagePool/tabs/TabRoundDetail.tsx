import React from "react";
import { getTokenByChainIdAndAddress } from "@gitcoin/gitcoin-chain-data";
import { Form, ProgressModal } from "@gitcoin/ui/client";
import { toast } from "@gitcoin/ui/hooks/useToast";
import { FormField } from "@gitcoin/ui/types";
import { Hex } from "viem";
import { config } from "@/config";
import { useUpdateRoundMetadata } from "@/hooks/contracts/useUpdateRoundMetadata/useUpdateRoundMetadata";
import { RetroRound } from "@/types";
import { MappedRoundMetadata } from "@/utils/transformRoundMetadata";

export const TabRoundDetail = ({
  poolData,
  poolId,
  onUpdate,
}: {
  poolData: RetroRound;
  poolId: string;
  onUpdate: () => void;
}) => {
  const { steps, updateRoundMetadataMutation } = useUpdateRoundMetadata();
  const { mutateAsync: updateRoundMetadata, isPending: isUpdating } = updateRoundMetadataMutation;
  const roundEditDetailsFields: FormField[] = [
    {
      field: {
        name: "roundName",
        label: "Round name",
        className: "border-grey-300",
        validation: {
          required: true,
          stringValidation: { minLength: 5 },
        },
      },
      component: "Input",
    },
    {
      field: {
        name: "program",
        label: "Program",
        validation: { isObject: true },
      },
      component: "DisabledProgramInput",
    },
    {
      field: {
        name: "payoutToken",
        label: "Payout token",
        className: "border-grey-300",
        validation: {
          required: true,
        },
      },
      disabled: true,
      component: "Input",
      // options: [
      // {
      //   // TODO: populate from chain-data
      //   items: [{ label: "Ethereum", value: "ethereum" }],
      // },
      // ],
      // placeholder: "Select",
      // className: "bg-white border-grey-300",
      // size: "md",
    },
    {
      field: {
        name: "coverImage",
        label: "Cover image",
        className: "border-grey-300",
        validation: {
          isObject: true,
          required: true,
        },
      },
      component: "FileUpload",
    },
    {
      field: {
        name: "description",
        label: "Round description",
        validation: { required: true },
        className: "border-grey-300",
      },
      component: "MarkdownEditor",
    },
  ];

  // TODO: convert to file and pass as default
  const tokenAddress = poolData.matchTokenAddress as Hex;
  const token = getTokenByChainIdAndAddress(poolData.project.chainId, tokenAddress);

  const roundDetailsArgs = {
    fields: roundEditDetailsFields,

    defaultValues: {
      roundName: poolData.roundMetadata.name,
      program: {
        programId: poolData.project.id,
        chainId: poolData.project.chainId,
        programName: poolData.project.name,
      },
      payoutToken: token.code, // TODO: use token name
      coverImage: `${config.pinataBaseUrl}/${poolData.roundMetadata.retroFundingConfig?.coverImage}`,
      description: poolData.roundMetadata.eligibility.description,
    },
  };
  const roundStep = {
    formProps: roundDetailsArgs,
    stepProps: {
      formTitle: "Round details",
      formDescription:
        "Fill out the details about your round. You can change most of these at any time.",
    },
  };
  // store round details in db
  return (
    <>
      <Form
        step={roundStep}
        onSubmit={async (values: any) => {
          const updatedMetadata: MappedRoundMetadata = {
            round: {
              ...poolData.roundMetadata,
              name: values.roundName,
              eligibility: {
                ...poolData.roundMetadata.eligibility,
                description: values.description,
              },
              retroFundingConfig: {
                ...poolData.roundMetadata.retroFundingConfig,
                coverImage: values.coverImage,
              },
            },
            application: {
              ...poolData.applicationMetadata,
            },
          };
          await updateRoundMetadata({
            data: updatedMetadata,
            poolId: BigInt(poolId),
          });

          toast({
            status: "success",
            description: "Round updated successfully",
          });

          onUpdate();
        }}
      />
      <ProgressModal isOpen={isUpdating} steps={steps} />
    </>
  );
};
