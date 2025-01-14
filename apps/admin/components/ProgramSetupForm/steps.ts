import { FormStep } from "gitcoin-ui/setup-progress-form";
import { FormField } from "gitcoin-ui/form";

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
      name: "network",
      label: "Select network",
      validation: { required: true },
    },
    component: "Select",
    options: [
      {
        items: [
          { label: "Ethereum", value: "ethereum" },
          { label: "Optimism", value: "optimism" },
          { label: "Base", value: "base" },
          { label: "Polygon", value: "polygon" },
          { label: "Arbitrum", value: "arbitrum" },
        ],
      },
    ],
    placeholder: "Select",
    className: "bg-white border-grey-300",
    size: "md",
  },
];

const programDetailsArgs = {
  fields: programDetailsFields,
  persistKey: "program-setup-program-details",
  defaultValues: {
    network: "ethereum",
  },
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

const deployArgs = {
  fields: [],
  persistKey: "program-setup-deploy",
};

export const programSetupSteps = [
  {
    name: "Program details",
    formProps: programDetailsArgs,
    stepProps: {
      formTitle: "Program details",
      formDescription:
        "A grants program will house and organize your retrofunding rounds.",
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
    name: "Review",
    formProps: deployArgs,
    stepProps: {
      formTitle: "Review your program and deploy onchain",
      formDescription:
        "Use the sidebar menu to edit any part of your program. Changes can also be made after your program has been deployed.",
    },
  },
] satisfies FormStep[];
