import { NATIVE } from "@allo-team/allo-v2-sdk";
import { getTokensByChainId } from "@gitcoin/gitcoin-chain-data";
import { FormField, FormWithPersistStep as FormStep } from "@gitcoin/ui/types";
import moment from "moment-timezone";
import { Hex, getAddress, zeroAddress } from "viem";
import { getProgramByIdAndChainId } from "@/services/allo-indexer/dataLayer";
import { getMetrics } from "@/services/backend/dataLayer";
import { supportTypes } from "@/utils/transformRoundMetadata";

export const getRoundSetupSteps = async ({
  programId,
  chainId,
  address,
}: {
  programId: string;
  chainId: number;
  address?: Hex;
}): Promise<{ roundSetupSteps: FormStep[]; managers: Hex[] }> => {
  const program = await getProgramByIdAndChainId(programId, chainId);
  const tokens = getTokensByChainId(chainId).filter(
    (token) => token.address.toLowerCase() !== zeroAddress.toLowerCase(),
  );

  const poolMembers = program.members
    .map((member) => getAddress(member))
    .filter((member) => !address || member !== getAddress(address));

  const roundDetailsFields: FormField[] = [
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
        "Enter your email, Telegram handle, or website link based on your selected contact method.",
    },
    {
      field: {
        name: "coverImage",
        label: "Cover image",
        className: "border-grey-300",
        validation: {
          fileValidation: {
            allowedTypesMessage: "Only PNG and JPEG images are allowed",
          },
          required: true,
        },
      },
      component: "FileUpload",
      mimeTypes: ["image/*"],
    },
  ];

  const roundDetailsArgs = {
    fields: roundDetailsFields,
    persistKey: "round-setup-round-details",
    defaultValues: {
      program: program,
      managers: poolMembers,
      roundFundingAmount: 0,
    },
  };

  const fundRoundFields: FormField[] = [
    {
      field: {
        name: "payoutToken",
        label: "Payout token",
        className: "border-grey-300",
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
      placeholder: "Select",
      className: "bg-white border-grey-300",
      size: "md",
    },
    {
      field: {
        name: "fundingAmount",
        label: `Funding amount`,
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
      placeholder: "Set funding amount",
    },
  ];

  const fundRoundArgs = {
    fields: fundRoundFields,
    persistKey: "round-setup-fund-round",
    defaultValues: {
      payoutToken: tokens[0].address,
    },
  };

  const roundDatesFields: FormField[] = [
    {
      field: {
        name: "roundDates",
        label: "Round dates",
        validation: { isRoundDates: true },
      },
      component: "RoundDates",
    },
  ];

  const roundDatesArgs = {
    fields: roundDatesFields,
    persistKey: "round-setup-round-dates",
    defaultValues: {
      roundDates: {
        timezone: moment.tz.guess(),
        round: {
          noEndDate: false,
        },
      },
    },
  };

  const roundDescriptionRequirementsFields: FormField[] = [
    {
      field: {
        name: "description",
        label: "Round description",
        validation: { required: true },
        className: "border-grey-300",
      },
      component: "MarkdownEditor",
    },
    {
      field: {
        name: "requirements",
        label: "What requirements do you have from applicants?",
        className: "border-grey-300",
        validation: { arrayValidation: { minItems: 0 } },
      },
      component: "FieldArray",
      placeholder: "Enter an eligibility requirement",
      addButtonLabel: "Add requirement",
      removeIconType: "x",
      itemName: "Requirement",
    },
  ];

  const roundDescriptionRequirementsArgs = {
    fields: roundDescriptionRequirementsFields,
    persistKey: "round-setup-round-description-requirements",
  };

  const metricsData = await getMetrics();
  const metrics = metricsData.map((metric) => ({
    title: metric.title,
    description: metric.description,
    identifier: metric.identifier,
    onReadMore: () => {},
  }));

  const impactMetricsFields: FormField[] = [
    {
      field: {
        name: "impactMetrics",
        label: "Impact metrics",
        validation: { arrayValidation: { minItems: 1 } },
      },
      component: "Metrics",
      metrics,
    },
  ];

  const impactMetricsArgs = {
    fields: impactMetricsFields,
    persistKey: "round-setup-impact-metrics",
  };

  const applicationQuestionsFields: FormField[] = [
    {
      field: {
        name: "applicationQuestions",
        label: "Application questions",
        validation: { isObject: true },
      },
      component: "ApplicationQuestions",
    },
  ];

  const applicationQuestionsArgs = {
    fields: applicationQuestionsFields,
    persistKey: "round-setup-application-questions",
  };

  const voterAllowlistFields: FormField[] = [
    {
      field: {
        name: "voterAllowlist",
        label: "Voter allowlist",
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
    persistKey: "round-setup-voter-allowlist",
  };
  const reviewDeployArgs = {
    fields: [],
    persistKey: "round-setup-review-deploy",
  };

  const roundSetupSteps: FormStep[] = [
    {
      name: "Round details",
      formProps: roundDetailsArgs,
      stepProps: {
        formTitle: "Round details",
        formDescription:
          "Fill out the details about your round. You can change most of these at any time.",
      },
    },
    {
      name: "Fund round",
      formProps: fundRoundArgs,
      stepProps: {
        formTitle: "Fund your round",
        formDescription: "Set the total funding amount to be distributed to grantees.",
      },
    },
    {
      name: "Round dates",
      formProps: roundDatesArgs,
      stepProps: {
        formTitle: "Round dates",
        formDescription:
          "Configure the dates for the application and payout periods for the round.",
      },
    },
    {
      name: "Round description & requirements",
      formProps: roundDescriptionRequirementsArgs,
      stepProps: {
        formTitle: "Round description and requirements",
        formDescription:
          "Provide details about your round and specify the requirements for applicants.",
      },
    },
    {
      name: "Impact metrics",
      formProps: impactMetricsArgs,
      stepProps: {
        formTitle: "Impact Metrics",
        formDescription: "Define your impact categories for the round application form.",
      },
    },
    {
      name: "Application questions",
      formProps: applicationQuestionsArgs,
      stepProps: {
        formTitle: "Application Questions",
        formDescription: "Add questions for project owners to complete their round application.",
      },
    },
    {
      name: "Voter allowlist",
      formProps: voterAllowlistArgs,
      stepProps: {
        formTitle: "Voter allowlist",
        formDescription: "Provide wallet addresses to grant voter access to the round.",
      },
    },
    {
      name: "Review & deploy",
      formProps: reviewDeployArgs,
      stepProps: {
        formTitle: "Review your round and deploy onchain",
        formDescription: "You can edit your round after it's been deployed.",
      },
    },
  ] satisfies FormStep[];

  return { roundSetupSteps, managers: poolMembers };
};
