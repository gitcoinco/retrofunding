import { getTokenByChainIdAndAddress } from "@gitcoin/gitcoin-chain-data";
import { Form } from "@gitcoin/ui/client";
import { FormField } from "@gitcoin/ui/types";
import { Hex } from "viem";
import { config } from "@/config";
import { RetroRound } from "@/types";

export const TabRoundDetail = ({ poolData }: { poolData: RetroRound }) => {
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
  return <Form step={roundStep} onSubmit={async (values: any) => console.log(values)} />;
};
