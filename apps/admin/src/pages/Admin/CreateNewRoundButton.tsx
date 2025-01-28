import { CreateButton } from "@gitcoin/ui";

export const CreateNewRoundButton = ({
  className,
  onClick,
}: {
  className?: string;
  onClick: () => void;
}) => {
  return (
    <div className={className} onClick={onClick}>
      <CreateButton variant="round">Create New Round</CreateButton>
    </div>
  );
};
