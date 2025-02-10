import { getTokensByChainId } from "@gitcoin/gitcoin-chain-data";
import { Icon } from "@gitcoin/ui";
import { Label } from "@gitcoin/ui";
import { IconLabel } from "@gitcoin/ui";
import { IconType } from "@gitcoin/ui";
import { RoundSetupFormData } from "@/types/roundSetupForm";
import { useGetFormValues } from "../hooks";

const questionTypeToIconEnum = {
  email: IconType.MENU_ALT_4,
  address: IconType.MENU_ALT_4,
  number: IconType.MENU_ALT_4,
  text: IconType.MENU_ALT_4,
  "short-answer": IconType.MENU_ALT_4,
  paragraph: IconType.MENU_ALT_2,
  "multiple-choice": IconType.DOTS_CIRCLE_HORIZONTAL,
  checkbox: IconType.CHECK,
  dropdown: IconType.CHEVRON_DOWN,
  link: IconType.LINK,
};

export const LastStepFormSummary = ({
  getValues,
}: {
  getValues: () => Promise<Record<string, any>>;
}) => {
  const { data, isLoading } = useGetFormValues(getValues);
  if (isLoading || !data) {
    return null;
  }
  const values = data as RoundSetupFormData;
  const tokens = getTokensByChainId(Number(values.program.chainId));
  const tokenTicker = tokens.find((token) => token.address === values.payoutToken)?.code;
  return (
    <div className="flex max-h-[700px] flex-col gap-6 overflow-y-auto">
      <span className="text-[16px]/[24px] font-medium">Round details</span>
      <div className="flex w-[223px] justify-between">
        <span className="text-sm font-normal">Round name</span>
        <span className="text-sm font-normal">{values.roundName}</span>
      </div>
      <div className="flex w-[223px] justify-between">
        <span className="text-sm font-normal">Payment token</span>
        <span className="text-sm font-normal">{tokenTicker}</span>
      </div>
      <div className="flex w-[223px] justify-between">
        <span className="text-sm font-normal">Payment amount</span>
        <span className="text-sm font-normal">{`${values.fundingAmount} ${tokenTicker}`}</span>
      </div>
      <div className="flex w-[458px] flex-col gap-4">
        <Label className="text-[16px]/[24px] font-medium">Round dates</Label>
        <div className="flex items-center justify-between">
          <Label className="text-sm font-normal">Applications</Label>
          <IconLabel
            type="roundPeriod"
            startDate={new Date(values.roundDates.applications.start)}
            endDate={new Date(values.roundDates.applications.end)}
            label=""
            iconType={IconType.CALENDAR}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-sm font-normal">Voting</Label>
          <IconLabel
            type="roundPeriod"
            startDate={new Date(values.roundDates.round.start)}
            endDate={new Date(values.roundDates.round.end)}
            label=""
            iconType={IconType.CALENDAR}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Label className="text-[16px]/[24px] font-medium">Default questions</Label>
        <div className="flex w-64 items-center justify-between">
          <Label className="text-sm font-normal">Project name</Label>
          <div className="flex items-center gap-2">
            <Label className="text-sm font-normal text-moss-700">*Required</Label>
          </div>
        </div>
        <div className="flex w-64 items-center justify-between">
          <Label className="text-sm font-normal">Project website</Label>
          <div className="flex items-center gap-2">
            <Label className="text-sm font-normal text-moss-700">*Required</Label>
          </div>
        </div>
        <div className="flex w-64 items-center justify-between">
          <Label className="text-sm font-normal">Project logo</Label>
          <div className="flex items-center gap-2">
            <Label className="text-sm font-normal text-grey-900">Optional</Label>
          </div>
        </div>
        <div className="flex w-64 items-center justify-between">
          <Label className="text-sm font-normal">Project banner</Label>
          <div className="flex items-center gap-2">
            <Label className="text-sm font-normal text-grey-900">Optional</Label>
          </div>
        </div>
        <div className="flex w-64 items-center justify-between">
          <Label className="text-sm font-normal">Project description</Label>
          <div className="flex items-center gap-2">
            <Label className="text-sm font-normal text-moss-700">*Required</Label>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Label className="text-[16px]/[24px] font-medium">Project socials</Label>
        <div className="flex w-64 items-center justify-between">
          <Label className="text-sm font-normal">Project X</Label>
          <div className="flex items-center gap-2">
            <Label className="text-sm font-normal text-moss-700">
              {values.applicationQuestions.requirements.twitter.verification
                ? "*Required"
                : "Optional"}
            </Label>
          </div>
        </div>
        <div className="flex w-64 items-center justify-between">
          <Label className="text-sm font-normal">Project Github</Label>
          <div className="flex items-center gap-2">
            <Label className="text-sm font-normal text-moss-700">
              {values.applicationQuestions.requirements.github.verification
                ? "*Required"
                : "Optional"}
            </Label>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Label className="text-[16px]/[24px] font-medium">Application questions</Label>
        <div className="flex flex-col gap-4">
          {values.applicationQuestions.questions.map((question) => (
            <div
              className="flex items-center justify-between"
              key={`${question.title}-${question.type}`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Icon
                    type={
                      questionTypeToIconEnum[question.type as keyof typeof questionTypeToIconEnum]
                    }
                  />
                  <Label className="font-ui-sans text-sm font-normal leading-tight">
                    {question.type}
                  </Label>
                </div>
                <Label className="font-ui-sans text-sm font-normal leading-tight">
                  {question.title}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                {question.required ? (
                  <Label className="text-sm font-normal text-moss-700">*Required</Label>
                ) : (
                  <Label className="text-sm font-normal text-grey-900">Optional</Label>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
