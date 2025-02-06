import { getTokenByChainIdAndAddress, getTokensByChainId } from "@gitcoin/gitcoin-chain-data";
import { Form, ProgressModal } from "@gitcoin/ui/client";
import { toast } from "@gitcoin/ui/hooks/useToast";
import { FormField } from "@gitcoin/ui/types";
import { Hex } from "viem";
import { config } from "@/config";
import { useUpdateRoundMetadata } from "@/hooks/contracts/useUpdateRoundMetadata/useUpdateRoundMetadata";
import { RetroRound } from "@/types";
import { MappedRoundMetadata, supportTypes } from "@/utils/transformRoundMetadata";

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
  const tokens = getTokensByChainId(poolData.project.chainId);

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
        validation: {
          required: true,
        },
      },
      component: "Select",
      options: [
        {
          items: tokens.map((token) => ({
            label: token.code,
            value: token.address,
            icon: token.icon,
          })),
        },
      ],
      disabled: true,
      placeholder: "Select",
      size: "md",
    },
    {
      field: {
        name: "fundingAmount",
        label: `Round funding amount`,
        validation: {
          required: true,
          numberValidation: {
            min: 0,
            minMessage: "Minimum funding amount is 0",
          },
        },
      },
      component: "Input",
      type: "number",
      min: 0,
      defaultValue: 0,
    },
    {
      field: {
        name: "supportType",
        label: "Preferred grantee contact method",
        className: "border-grey-300",
        validation: {
          required: true,
        },
      },
      component: "Select",
      options: [
        {
          items: supportTypes,
        },
      ],
      placeholder: "Select",
      className: "bg-white border-grey-300",
      size: "md",
    },
    {
      field: {
        name: "supportInfo",
        label: "Contact details",
        className: "border-grey-300",
        validation: {
          required: true,
          stringValidation: {
            pattern:
              /^(?:(?:https?:\/\/)(?:[\da-z.-]+)\.(?:[a-z.]{2,})(?:[/\w .-]*)*\/?|[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
            patternMessage: "Invalid email or URL",
          },
        },
      },
      component: "Input",
      placeholder:
        "Enter your email, Telegram group link, or website link based on your selected contact method.",
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
      fundingAmount: poolData.roundMetadata.retroFundingConfig.fundingAmount ?? 0,
      supportType: poolData.roundMetadata?.support?.type,
      supportInfo: poolData.roundMetadata?.support?.info,
      payoutToken: token.address,
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
                fundingAmount: values.fundingAmount,
              },
              support: {
                ...poolData.roundMetadata.support,
                info: values.supportInfo,
                type: values.supportType,
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
