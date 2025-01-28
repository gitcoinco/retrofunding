"use client";

import { Typography } from "@gitcoin/ui";
import { ProgramList } from "@gitcoin/ui/client";
import { PoolList } from "@gitcoin/ui/client";
import { cn } from "@gitcoin/ui/lib";
import { PoolCardProps } from "@gitcoin/ui/pool";
import { ProgramCardProps } from "@gitcoin/ui/program";
import { CreateNewProgramButton } from "./CreateNewProgramButton";
import { CreateNewRoundButton } from "./CreateNewRoundButton";

export const AdminContent = ({
  className,
  programs,
  pools,
}: {
  className?: string;
  programs: ProgramCardProps[];
  pools: PoolCardProps[];
}) => {
  const handleCreateNewRound = () => {
    // Todo the picker program modal
    console.log("create new round");
  };

  const programsLength = programs.length;
  return (
    <div className={cn("flex w-full max-w-[960px] flex-col gap-8", className)}>
      {programsLength === 0 ? (
        <div className="flex flex-col gap-4">
          <CreateNewProgramButton />
          <Typography className="text-2xl font-medium">
            To get Started, create a funding program.
          </Typography>
        </div>
      ) : (
        <div className="flex gap-8">
          <CreateNewProgramButton className="w-1/2" />
          <CreateNewRoundButton className="w-1/2" onClick={handleCreateNewRound} />
        </div>
      )}
      {programsLength > 0 && (
        <PoolList pools={pools} noPoolsPlaceholder="No rounds found" title="Rounds" />
      )}
      {programsLength > 0 && (
        <ProgramList
          programs={programs}
          noProgramsPlaceholder="No programs found"
          title="Programs"
        />
      )}
    </div>
  );
};
