import { CalculatePoolBody, CalculatePoolResponse, CreatePoolBody, SyncPoolBody } from "./types";

export async function createPool(createPoolBody: CreatePoolBody): Promise<boolean> {
  const url = `${process.env.NEXT_PUBLIC_RETROFUNDING_URL}/api/pool`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...createPoolBody,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${response.status} - ${errorData.message || "Unknown error"}`);
    }

    return true;
  } catch (error) {
    console.error("Error creating pool:", error);
    throw error;
  }
}

export async function syncPool(syncPoolBody: SyncPoolBody): Promise<boolean> {
  const url = `${process.env.NEXT_PUBLIC_RETROFUNDING_URL}/api/pool/sync`;
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

export async function calculatePool(
  calculatePoolBody: CalculatePoolBody,
): Promise<CalculatePoolResponse> {
  const url = `${process.env.NEXT_PUBLIC_RETROFUNDING_URL}/api/pool/calculate`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...calculatePoolBody,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${response.status} - ${errorData.message || "Unknown error"}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error calculating pool:", error);
    throw error;
  }
}
