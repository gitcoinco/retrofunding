import { useNavigate } from "react-router";
import { NotFoundPage } from "@gitcoin/ui";

const description = "Looks like the page you are looking for has been moved or removed.";

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <NotFoundPage
      description={description}
      button={{ label: "Go to home", onClick: () => navigate("/") }}
    />
  );
};
