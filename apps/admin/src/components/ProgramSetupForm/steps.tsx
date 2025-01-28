import { FormField, FormStep } from "@gitcoin/ui/types";
import { ChainIcon } from "@/components/ChainIcon";
import { targetNetworks } from "@/services/web3/chains";

const programDetailsFields: FormField[] = [
  {
    field: {
      name: "name",
      label: "Program name",
      className: "border-grey-300",
      validation: {
        required: true,
        stringValidation: { minLength: 5 },
      },
    },
    component: "Input",
    placeholder: "My Program Name",
  },
  {
    field: {
      name: "chainId",
      label: "Select network",
      validation: { required: true },
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
  },
] satisfies FormField[];

const programDetailsArgs = {
  fields: programDetailsFields,
  persistKey: "program-setup-program-details",
};

const manageAdminsFields: FormField[] = [
  {
    field: {
      name: "admins",
      label: "",
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

const manageAdminsArgs = {
  fields: manageAdminsFields,
  persistKey: "program-setup-manage-admins",
};

const publishProgramArgs = {
  fields: [],
  persistKey: "",
};

export const programSetupSteps: FormStep[] = [
  {
    name: "Program details",
    formProps: programDetailsArgs,
    stepProps: {
      formTitle: "Program details",
      formDescription: "A grants program will house and organize your retrofunding rounds.",
    },
  },
  {
    name: "Manage admins",
    formProps: manageAdminsArgs,
    stepProps: {
      formTitle: "Manage admins",
      formDescription:
        "Program admins will automatically have admin addcess to all of the rounds nexted under this program.",
    },
  },
  {
    name: "Publish program",
    formProps: publishProgramArgs,
    stepProps: {
      formTitle: "Publish program",
      formDescription: "Publish your program to the public.",
    },
  },
] satisfies FormStep[];
