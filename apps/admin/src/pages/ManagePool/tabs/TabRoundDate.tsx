import { Form, ProgressModal } from "@gitcoin/ui/client";
import { toast } from "@gitcoin/ui/hooks/useToast";
import { FormField } from "@gitcoin/ui/types";
import moment from "moment-timezone";
import { useUpdateTimestamps } from "@/hooks";
import { RetroRound, RoundDates } from "@/types";
import { UINT64_MAX } from "@/utils";

export const TabRoundDate = ({
  poolData,
  onUpdate,
}: {
  poolData: RetroRound;
  onUpdate: () => void;
}) => {
  const { steps, updateTimestampsMutation } = useUpdateTimestamps();
  const { mutateAsync: updateTimestamps, isPending: isUpdating } = updateTimestampsMutation;

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
          noEndDate: BigInt(moment(poolData.donationsEndTime).unix()) === UINT64_MAX,
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

  return (
    <>
      <Form
        step={roundStep}
        onSubmit={async (values: any) => {
          const roundDates: RoundDates = values.roundDates;
          await updateTimestamps({
            data: {
              ...roundDates,
            },
            poolId: poolData.id,
            chainId: poolData.chainId,
            strategyAddress: poolData.strategyAddress,
          });

          toast({
            status: "success",
            description: "Round dates updated successfully",
          });

          onUpdate();
        }}
      />
      <ProgressModal isOpen={isUpdating} steps={steps} />
    </>
  );
};
