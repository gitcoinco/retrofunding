import { useEffect, useState } from "react";
import { getTokenByChainIdAndAddress } from "@gitcoin/gitcoin-chain-data";
import { Button } from "@gitcoin/ui";
import { Form, FormProps } from "@gitcoin/ui/client";
import { deleteDBValues } from "@gitcoin/ui/lib";
import { FormField } from "@gitcoin/ui/types";
import { Hex } from "viem";
import { MessagePage } from "@/components/Message";
import { RetroRound } from "@/types";

const persistKey = "round-edit-round-details";
const dbName = "round-edit-db";
const storeName = "round-edit-store";

export const TabRoundDetail = ({ poolData }: { poolData: RetroRound }) => {
  const [roundDetailArgs, setRoundDetailArgs] = useState<FormProps | null>(null);
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

  useEffect(() => {
    if (poolData) {
      deleteDBValues([persistKey], dbName, storeName);
      setRoundDetailArgs({
        fields: roundEditDetailsFields,
        persistKey: persistKey,
        dbName: dbName,
        storeName: storeName,
        defaultValues: {
          roundName: poolData.roundMetadata.name,
          program: {
            programId: poolData.project.id,
            chainId: poolData.project.chainId,
            programName: poolData.project.name,
          },
          payoutToken: token.code,
          description: poolData.roundMetadata.eligibility.description,
        },
      } as FormProps);
    }
  }, [poolData]);

  if (!roundDetailArgs) {
    return <MessagePage title="Loading Pool Data" message="Loading pool data..." />;
  }
  // store round details in db
  return (
    <div className="flex flex-col gap-6 bg-[#f7f7f7] p-6">
      <div className="text-2xl font-medium leading-loose text-black">Round details</div>
      <Form {...roundDetailArgs} />
      <Button>Save</Button>
    </div>
  );
};
