import { Button } from "@gitcoin/ui";
import { Icon, IconType } from "@gitcoin/ui";
import moment from "moment";

export const RoundCard = ({
  roundName,
  roundDescription,
  roundDonationsStartTime,
  roundDonationsEndTime,
  roundChainId,
  roundChainName,
  roundChainIcon,
  roundId,
}: {
  roundName: string;
  roundDescription: string;
  roundDonationsStartTime: string;
  roundDonationsEndTime: string;
  roundChainId: string;
  roundChainName: string;
  roundChainIcon: IconType;
  roundId: string;
}) => {
  const daysLeft = moment(roundDonationsEndTime).diff(moment(), "days");
  return (
    <div className="inline-flex w-full flex-col items-start justify-start gap-4 px-2 md:px-0">
      <div className="inline-flex flex-col items-center justify-between self-stretch pr-6 md:flex-row">
        <div className="inline-flex flex-1 flex-col items-start justify-start gap-4">
          <div className="flex flex-col items-start justify-start gap-2">
            <div className="flex flex-col items-start justify-start gap-1">
              <div className="inline-flex items-center justify-center gap-4">
                <div className="font-ui-sans justify-center text-3xl font-semibold leading-9 text-text-primary">
                  {roundName}
                </div>
                <div
                  data-state="Default"
                  data-type="default"
                  className="flex items-center justify-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5"
                >
                  <div className="font-ui-mono justify-start text-sm font-medium leading-normal text-text-primary">
                    {daysLeft} days left
                  </div>
                </div>
              </div>
              <div className="inline-flex items-center justify-start gap-2">
                <div className="flex items-center justify-start gap-2">
                  <div className="font-ui-sans justify-center text-base font-normal leading-7 text-text-secondary">
                    on
                  </div>
                  <div className="flex items-center justify-start gap-1">
                    <div data-property-1="Optimism" className="relative h-5 w-5">
                      <Icon type={roundChainIcon} />
                    </div>
                    <div className="font-ui-sans justify-center text-base font-normal leading-7 text-text-secondary">
                      {roundChainName}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="inline-flex w-[458px] items-center justify-start gap-2">
              <div className="font-ui-sans justify-center text-base font-medium leading-normal text-text-primary">
                Vote
              </div>
              <div className="flex items-center justify-start gap-1.5">
                <Icon type={IconType.CALENDAR} />
                <div className="font-ui-sans justify-center text-base font-normal leading-7 text-text-primary">
                  {`${moment(roundDonationsStartTime).utc().format("YYYY/MM/DD HH:mm [UTC]")} - ${moment(roundDonationsEndTime).utc().format("YYYY/MM/DD HH:mm [UTC]")}`}
                </div>
              </div>
            </div>
          </div>
          <div className="font-ui-sans justify-center text-base font-normal leading-7 text-text-primary">
            {roundDescription}
          </div>
        </div>
        <Button
          size="lg"
          variant="light-purple"
          value="Vote here!"
          onClick={() => {
            window.open(`https://beta.rf.vote.gitcoin.co/#/${roundChainId}/${roundId}`, "_blank");
          }}
        />
      </div>
      <div className="h-0.5 w-full bg-grey-100" />
    </div>
  );
};
