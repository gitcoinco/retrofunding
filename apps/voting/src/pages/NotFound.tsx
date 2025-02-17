import { useParams } from "react-router";
import { NotFoundPage } from "@gitcoin/ui";

const description =
  "Oops! We couldn’t find this voting page. Double-check the round ID/chain ID or reach out to your round admin for the correct link.";

export const NotFound = () => {
  const { chainId, roundId } = useParams();
  console.log(chainId, roundId);
  return (
    <NotFoundPage
      description={description}
      button={
        chainId && roundId
          ? { label: "Refresh page", onClick: () => window.location.reload() }
          : undefined
      }
    />
  );
};
