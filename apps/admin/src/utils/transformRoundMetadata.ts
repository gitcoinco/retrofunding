import { RoundSetupFormData } from "@/types";
import { RoundApplicationQuestion, RoundMetadata } from "@/types";

export const mapFormQuestionToApplicationQuestion = (
  question: RoundSetupFormData["applicationQuestions"]["questions"][0],
): RoundApplicationQuestion => {
  const baseQuestion = {
    id: question.id,
    title: question.title,
    required: question.required,
    hidden: question.hidden,
    encrypted: question.encrypted,
  };

  switch (question.type) {
    case "email":
      return { ...baseQuestion, type: "email" };
    case "address":
      return { ...baseQuestion, type: "address" };
    case "number":
      return { ...baseQuestion, type: "number" };
    case "text":
    case "short-answer":
    case "link":
      return { ...baseQuestion, type: question.type };
    case "paragraph":
      return { ...baseQuestion, type: "paragraph" };
    case "multiple-choice":
      return { ...baseQuestion, type: "multiple-choice", options: question.choices };
    case "checkbox":
      return { ...baseQuestion, type: "checkbox", options: question.choices };
    case "dropdown":
      return { ...baseQuestion, type: "dropdown", options: question.choices };
    default:
      throw new Error(`Unsupported question type: ${question.type}`);
  }
};

export const mapRequirements = (requirements: {
  twitter?: { required?: boolean; verification?: boolean };
  github?: { required?: boolean; verification?: boolean };
}) => {
  return {
    twitter: {
      required: requirements.twitter?.required ?? false,
      verification: requirements.twitter?.verification ?? false,
    },
    github: {
      required: requirements.github?.required ?? false,
      verification: requirements.github?.verification ?? false,
    },
  };
};

interface MappedRoundMetadata {
  round: RoundMetadata;
  application: {
    version: string;
    lastUpdatedOn: number;
    applicationSchema: {
      questions: RoundApplicationQuestion[];
      requirements: {
        github: {
          required: boolean;
          verification: boolean;
        };
        twitter: {
          required: boolean;
          verification: boolean;
        };
      };
    };
  };
}

export const mapFormDataToRoundMetadata = (
  formData: RoundSetupFormData,
  roundCoverImageCid: string,
): MappedRoundMetadata => {
  return {
    round: {
      name: formData.roundName,
      roundType: "private", // TODO: add to / get from form
      eligibility: {
        description: formData.description,
        requirements: formData.requirements.map((req: string) => ({ requirement: req })),
      },
      projectId: formData.program.programId,
      programContractAddress: formData.program.programId,
      retroFundingConfig: {
        program: {
          chainId: formData.program.chainId,
          programId: formData.program.programId,
          programName: formData.program.programName,
        },
        roundName: formData.roundName,
        payoutToken: formData.payoutToken,
        coverImage: roundCoverImageCid,
        impactMetrics: formData.impactMetrics,
      },
      feesAddress: "",
      feesPercentage: 0,
      // support: {
      //   // TODO: add to / get from form
      //   type: "",
      //   info: "",
      // },
    },
    application: {
      version: "2.0.0",
      lastUpdatedOn: Math.floor(Date.now() / 1000),
      applicationSchema: {
        questions: formData.applicationQuestions.questions.map(
          mapFormQuestionToApplicationQuestion,
        ),
        requirements: mapRequirements(formData.applicationQuestions.requirements),
      },
    },
  };
};
