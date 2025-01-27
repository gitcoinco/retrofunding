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
    persistKey: "round-edit-round-dates",
    dbName: "round-edit-db",
    storeName: "round-edit-store",
    defaultValues: {
      timezone: moment.tz.guess(),
      roundDates: {
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

  return (
    <div className="inline-flex w-full flex-col justify-start gap-6 rounded-3xl bg-[#f7f7f7] p-6">
      <div className="text-2xl font-medium leading-loose text-black">Round Dates</div>
      <Form {...roundDatesArgs} />
    </div>
  );
};
