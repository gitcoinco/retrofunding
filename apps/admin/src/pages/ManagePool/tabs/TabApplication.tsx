import { useParams } from "react-router";
import { Checker, EvaluationBody } from "@gitcoin/ui/checker";
import { useAccount, useWalletClient } from "wagmi";
import { MessagePage } from "@/components/Message";
import { usePerformEvaluation } from "@/hooks/checker/usePerformEvaluation";
import { usePerformOnChainReview } from "@/hooks/checker/usePerformOnChainReview";

export const TabApplication = ({ chainId, poolId }: { chainId: number; poolId: string }) => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const { setEvaluationBody, isSuccess, isEvaluating, isError } = usePerformEvaluation();
  const { steps, setReviewBody, isReviewing } = usePerformOnChainReview();

  if (!address || !walletClient) {
    return (
      <MessagePage
        title="Wallet Not Connected"
        message="Please connect your wallet to access this feature. Connecting your wallet is required to interact with the application."
      />
    );
  }

  return (
    <Checker
      address={address}
      poolId={poolId}
      chainId={chainId}
      setEvaluationBody={(body: EvaluationBody) => setEvaluationBody(body)}
      isSuccess={isSuccess}
      isEvaluating={isEvaluating}
      isError={isError}
      steps={steps}
      setReviewBody={setReviewBody as any}
      isReviewing={isReviewing}
      isStandalone={false}
    />
  );
};
