/**
 * API service for communicating with the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface NoiseComplaint {
  unique_key: string;
  latitude: number | null;
  longitude: number | null;
  complaint_type: string | null;
}

export interface RefreshResponse {
  status: string;
  fetched: number;
  inserted: number;
}

/**
 * Fetch noise complaints from the backend API
 * @param limit Maximum number of complaints to fetch
 * @param hasLocation Only return complaints with location data
 * @returns Array of noise complaints
 */
export async function fetchComplaints(
  limit: number = 1000,
  hasLocation: boolean = true
): Promise<NoiseComplaint[]> {
  const params = new URLSearchParams({
    limit: limit.toString(),
    has_location: hasLocation.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/complaints?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch complaints: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Trigger a refresh of complaints data from NYC OpenData
 * @returns Refresh operation summary
 */
export async function refreshComplaints(): Promise<RefreshResponse> {
  const response = await fetch(`${API_BASE_URL}/complaints/refresh`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh complaints: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Check if the backend API is healthy
 * @returns True if healthy
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

