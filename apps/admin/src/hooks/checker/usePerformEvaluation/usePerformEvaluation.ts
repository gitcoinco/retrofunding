import { useState, useEffect } from "react";
import { EvaluationBody } from "@gitcoin/ui/checker";
import { useMutation } from "@tanstack/react-query";
import { Hex } from "viem";
import { useAccount, useWalletClient } from "wagmi";
import { deterministicKeccakHash, submitEvaluation } from "./utils";

export const usePerformEvaluation = () => {
  const [evaluationBody, setEvaluationBody] = useState<EvaluationBody | null>(null);
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const handleSetEvaluationBody = (data: EvaluationBody) => {
    setEvaluationBody(data);
  };

  const signEvaluationBody = async (): Promise<Hex> => {
    if (!walletClient) {
      throw new Error("No wallet client found");
    }

    if (!evaluationBody) {
      throw new Error("No evaluation body found");
    }

    const hash = await deterministicKeccakHash({
      chainId: evaluationBody.chainId,
      alloPoolId: evaluationBody.alloPoolId,
      alloApplicationId: evaluationBody.alloApplicationId,
      cid: evaluationBody.cid,
      evaluator: address,
      summaryInput: evaluationBody.summaryInput,
      evaluationStatus: evaluationBody.evaluationStatus,
    });

    const signature = await walletClient.signMessage({ message: hash });

    return signature;
  };

  // Evaluation mutation
  const evaluationMutation = useMutation({
    mutationFn: async (data: EvaluationBody) => {
      if (!address) {
        throw new Error("No address found");
      }
      const signature = await signEvaluationBody();
      await submitEvaluation({ ...data, signature, evaluator: address });
    },
  });

  // Trigger the signing mutation when evaluationBody is set
  useEffect(() => {
    if (evaluationBody) {
      evaluationMutation.mutateAsync(evaluationBody);
    }
  }, [evaluationBody]);

  return {
    setEvaluationBody: handleSetEvaluationBody,
    isEvaluating: evaluationMutation.isPending,
    isError: evaluationMutation.isError,
    isSuccess: evaluationMutation.isSuccess,
  };
};
