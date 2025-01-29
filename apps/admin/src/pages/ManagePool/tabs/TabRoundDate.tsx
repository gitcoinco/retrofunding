import { Form } from "@gitcoin/ui/client";
import { FormField } from "@gitcoin/ui/types";
import moment from "moment-timezone";
import { RetroRound } from "@/types";

export const TabRoundDate = ({ poolData }: { poolData: RetroRound }) => {
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
    defaultValues: {
      roundDates: {
        timezone: moment.tz.guess(),
        applications: {
          start: poolData.applicationsStartTime,
          end: poolData.applicationsEndTime,
        },
        round: {
          start: poolData.donationsStartTime,
          end: poolData.donationsEndTime,
        },
      },
    },
  };

  const roundStep = {
    formProps: roundDatesArgs,
    stepProps: {
      formTitle: "Round dates",
      formDescription: "Set the application and funding period dates for your round.",
    },
  };

  return <Form step={roundStep} onSubmit={async (values: any) => console.log(values)} />;
};
