import {
  PredictDistributionBody,
  Distribution,
  SyncPoolBody,
  RetroVoteBody,
  PreparedCalculationData,
} from "@/types";

export async function syncPool(syncPoolBody: SyncPoolBody): Promise<boolean> {
  const url = `${import.meta.env.VITE_RETROFUNDING_ENDPOINT}/api/pool/sync`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...syncPoolBody,
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

export async function vote(voteBody: RetroVoteBody): Promise<boolean> {
  const url = `${import.meta.env.VITE_RETROFUNDING_ENDPOINT}/api/vote`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...voteBody,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${response.status} - ${errorData.message || "Unknown error"}`);
    }

    return true;
  } catch (error) {
    console.error("Error voting:", error);
    throw error;
  }
}

export async function predictDistribution(
  predictDistributionBody: PredictDistributionBody,
): Promise<Distribution[]> {
  const url = `${import.meta.env.VITE_RETROFUNDING_ENDPOINT}/api/vote/predict`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(predictDistributionBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${response.status} - ${errorData.message || "Unknown error"}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error predicting distribution:", error);
    throw error;
  }
}

export async function getDataToCalculateDistribution({
  chainId,
  alloPoolId,
}: {
  chainId?: number;
  alloPoolId?: string;
}): Promise<PreparedCalculationData> {
  const url = `${import.meta.env.VITE_RETROFUNDING_ENDPOINT}/api/vote/getCalculationData`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chainId,
        alloPoolId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${response.status} - ${errorData.message || "Unknown error"}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error getting data to calculate distribution:", error);
    throw error;
  }
}
