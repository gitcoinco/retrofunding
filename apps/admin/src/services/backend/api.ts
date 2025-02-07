import {
  CalculatePoolBody,
  DistributionItem,
  CreatePoolBody,
  SyncPoolBody,
  UpdatePoolEligibilityBody,
  UpdateCustomDistributionBody,
  DeleteCustomDistributionBody,
} from "@/types";

export async function createPool(createPoolBody: CreatePoolBody): Promise<boolean> {
  const url = `${import.meta.env.VITE_RETROFUNDING_URL}/api/pool`;
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
  const url = `${import.meta.env.VITE_RETROFUNDING_URL}/api/pool/sync`;
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
): Promise<DistributionItem[]> {
  const url = `${import.meta.env.VITE_RETROFUNDING_URL}/api/pool/calculate`;
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

export async function updatePoolEligibility(
  updatePoolEligibilityBody: UpdatePoolEligibilityBody,
): Promise<boolean> {
  const url = `${import.meta.env.VITE_RETROFUNDING_URL}/api/pool/eligibility`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...updatePoolEligibilityBody,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${response.status} - ${errorData.message || "Unknown error"}`);
    }

    return true;
  } catch (error) {
    console.error("Error updating pool eligibility:", error);
    throw error;
  }
}

export async function updateCustomDistribution(
  updateCustomDistributionBody: UpdateCustomDistributionBody,
): Promise<boolean> {
  const url = `${import.meta.env.VITE_RETROFUNDING_URL}/api/pool/set-distribution`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...updateCustomDistributionBody,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${response.status} - ${errorData.message || "Unknown error"}`);
    }

    return true;
  } catch (error) {
    console.error("Error updating custom distribution:", error);
    throw error;
  }
}

export async function deleteCustomDistribution(
  deleteCustomDistributionBody: DeleteCustomDistributionBody,
): Promise<boolean> {
  const url = `${import.meta.env.VITE_RETROFUNDING_URL}/api/pool/delete-distribution`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...deleteCustomDistributionBody,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${response.status} - ${errorData.message || "Unknown error"}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting custom distribution:", error);
    throw error;
  }
}
