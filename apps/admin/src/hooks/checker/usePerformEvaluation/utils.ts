// CHECKER
import { EvaluationBody, SyncPoolBody } from "@gitcoin/ui/checker";
import stringify from "json-stringify-deterministic";
import { type Hex, keccak256, toHex } from "viem";

export const CHECKER_ENDPOINT = "https://api.checker.gitcoin.co";

export async function submitEvaluation(
  evaluationBody: EvaluationBody,
): Promise<{ evaluationId: string }> {
  const url = `${CHECKER_ENDPOINT}/api/evaluate`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...evaluationBody, evaluatorType: "human" }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${response.status} - ${errorData.message || "Unknown error"}`);
    }

    const data = await response.json();
    return data.evaluationId;
  } catch (error) {
    console.error("Error submitting evaluation:", error);
    throw error;
  }
}

export async function syncPool(syncPoolBody: SyncPoolBody): Promise<boolean> {
  const url = `${CHECKER_ENDPOINT}/api/pools`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...syncPoolBody,
        skipEvaluation: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${response.status} - ${errorData.message || "Unknown error"}`);
    }

    return true;
  } catch (error) {
    console.error("Error syncing pool:", error);
    throw error;
  }
}

export async function deterministicKeccakHash<T>(obj: T): Promise<Hex> {
  const deterministicString = stringify(obj);
  return keccak256(toHex(deterministicString));
}
