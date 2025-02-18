import { Checker, EvaluationBody } from "@gitcoin/ui/checker";
import { useAccount } from "wagmi";
import { usePerformEvaluation } from "@/hooks/checker/usePerformEvaluation";
import { usePerformOnChainReview } from "@/hooks/checker/usePerformOnChainReview";

export const TabApplication = ({ chainId, poolId }: { chainId: number; poolId: string }) => {
  const { address } = useAccount();

  const { setEvaluationBody, isSuccess, isEvaluating, isError } = usePerformEvaluation();
  const { steps, setReviewBody, isReviewing } = usePerformOnChainReview();

  return (
    <Checker
      address={address!}
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
