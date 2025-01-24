"use client";

import { Typography } from "gitcoin-ui";
import { cn } from "gitcoin-ui/lib";
import { CreateNewProgramButton } from "./CreateNewProgramButton";

export const AdminContent = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex w-full flex-col items-center", className)}>
      <div className={cn("flex w-[954px] flex-col gap-4", className)}>
        <CreateNewProgramButton />
        <Typography className="text-2xl font-medium">
          To get Started, create a funding program.
        </Typography>
      </div>
    </div>
  );
};
