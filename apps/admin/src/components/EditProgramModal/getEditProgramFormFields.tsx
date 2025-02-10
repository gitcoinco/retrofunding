import { FormField } from "@gitcoin/ui/types";
import { FormStep } from "@gitcoin/ui/types";
import { targetNetworks } from "@/services/web3/chains";
import { ChainIcon } from "../ChainIcon";

export const getEditProgramFormFields = (
  isProgramOwner: boolean,
  initialValues: Record<string, any>,
): FormStep => {
  const fields = [
    {
      field: {
        name: "name",
        label: "Program name",
        className: "border-grey-300",
      },
      component: "Input",
      placeholder: "My Program Name",
      disabled: !isProgramOwner,
    },
    {
      field: {
        name: "chainId",
        label: "Select network",
      },
      component: "Select",
      options: [
        {
          items: targetNetworks.map((network) => ({
            label: network.name,
            value: network.id.toString(),
            icon: <ChainIcon chainId={network.id} />,
            iconPosition: "left",
          })),
        },
      ],
      placeholder: "Select network",
      className: "bg-white border-grey-300 flex",
      size: "md",
      disabled: true,
    },
    {
      field: {
        name: "admins",
        label: "Add or remove admin wallet addresses",
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
      showImportButton: false,
    },
  ];
  const step = {
    formProps: {
      fields: fields as FormField[],
      defaultValues: initialValues,
    },
  } satisfies FormStep;
  return step;
};
