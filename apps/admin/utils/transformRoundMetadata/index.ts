import { RoundSetupFormData } from "@/components/RoundSetupForm/types";
import { RoundApplicationQuestion, RoundMetadata } from "./types";

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

interface MappedRoundMetadata {
  roundMetadata: RoundMetadata;
  applicationQuestions: RoundApplicationQuestion[];
}

export const mapFormDataToRoundMetadata = (formData: RoundSetupFormData): MappedRoundMetadata => {
  return {
    roundMetadata: {
      name: formData.roundName,
      roundType: "public", // TODO: add to / get from form
      eligibility: {
        description: formData.description,
        requirements: formData.requirements.map((req: string) => ({ requirement: req })),
      },
      projectId: formData.program.programId,
      retroFundingConfig: {
        program: {
          chainId: formData.program.chainId,
          programId: formData.program.programId,
          programName: formData.program.programName,
        },
        roundName: formData.roundName,
        payoutToken: formData.payoutToken,
        coverImage: formData.coverImage, // TODO: get/upload image
        impactMetrics: formData.impactMetrics,
      },
      support: {
        // TODO: add to / get from form
        type: "",
        info: "",
      },
    },
    applicationQuestions: formData.applicationQuestions.questions.map(
      mapFormQuestionToApplicationQuestion,
    ),
  };
};
