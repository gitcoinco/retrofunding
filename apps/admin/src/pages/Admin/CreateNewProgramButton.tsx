import { Link } from "react-router";
import { CreateButton } from "gitcoin-ui";

export const CreateNewProgramButton = () => {
  return (
    <Link to="/create-program">
      <CreateButton>Create New Program</CreateButton>
    </Link>
  );
};
