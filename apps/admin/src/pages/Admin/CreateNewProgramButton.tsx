import { Link } from "react-router";
import { CreateButton } from "@gitcoin/ui";

export const CreateNewProgramButton = ({ className }: { className?: string }) => {
  return (
    <Link to="/create-program" className={className}>
      <CreateButton variant="program">Create New Program</CreateButton>
    </Link>
  );
};
