import type { NoiseComplaint } from "../../../services/api";

// Noise complaint types from 311 data
export type ComplaintType =
  | "Noise - Residential"
  | "Noise - Commercial"
  | "Noise - Street/Sidewalk"
  | "Noise - Vehicle"
  | "Noise - Park"
  | "Noise - Helicopter"
  | "Noise"
  | "Other";

export const ALL_COMPLAINT_TYPES: ComplaintType[] = [
  "Noise - Residential",
  "Noise - Commercial",
  "Noise - Street/Sidewalk",
  "Noise - Vehicle",
  "Noise - Park",
  "Noise - Helicopter",
];

// Map complaint type strings to our defined types
export function normalizeComplaintType(type: string | null): ComplaintType {
  if (!type) return "Other";
  
  const normalizedTypes: Record<string, ComplaintType> = {
    "Noise - Residential": "Noise - Residential",
    "Noise - Commercial": "Noise - Commercial",
    "Noise - Street/Sidewalk": "Noise - Street/Sidewalk",
    "Noise - Vehicle": "Noise - Vehicle",
    "Noise - Park": "Noise - Park",
    "Noise - Helicopter": "Noise - Helicopter",
    "Noise": "Noise",
  };
  
  return normalizedTypes[type] || "Other";
}

// Display-friendly complaint type labels
export const COMPLAINT_TYPE_LABELS: Record<ComplaintType, string> = {
  "Noise - Residential": "Residential",
  "Noise - Commercial": "Commercial",
  "Noise - Street/Sidewalk": "Street/Sidewalk",
  "Noise - Vehicle": "Vehicle",
  "Noise - Park": "Park",
  "Noise - Helicopter": "Helicopter",
  "Noise": "General Noise",
  "Other": "Other",
};

// Listing type for UI display
export type Listing = {
  id: string;
  title: string;
  location: { lat: number; lng: number };
  type: ComplaintType;
  complaintType: string | null;
};

export type LatLngLiteral = {
  lat: number;
  lng: number;
};

/**
 * Transform a NoiseComplaint from the API into a Listing for display
 */
export function complaintToListing(complaint: NoiseComplaint): Listing | null {
  // Skip complaints without location
  if (complaint.latitude === null || complaint.longitude === null) {
    return null;
  }
  
  const type = normalizeComplaintType(complaint.complaint_type);
  
  return {
    id: complaint.unique_key,
    title: complaint.complaint_type || "Noise Complaint",
    location: {
      lat: complaint.latitude,
      lng: complaint.longitude,
    },
    type,
    complaintType: complaint.complaint_type,
  };
}

/**
 * Transform an array of NoiseComplaints into Listings, filtering out invalid ones
 */
export function complaintsToListings(complaints: NoiseComplaint[]): Listing[] {
  return complaints
    .map(complaintToListing)
    .filter((listing): listing is Listing => listing !== null);
}

// Keep some mock data for fallback/testing
export const mockListings: Listing[] = [
  {
    id: "mock-1",
    title: "Noise - Residential",
    location: { lat: 40.75, lng: -73.98 },
    type: "Noise - Residential",
    complaintType: "Noise - Residential",
  },
  {
    id: "mock-2",
    title: "Noise - Commercial",
    location: { lat: 40.7712, lng: -73.9742 },
    type: "Noise - Commercial",
    complaintType: "Noise - Commercial",
  },
  {
    id: "mock-3",
    title: "Noise - Street/Sidewalk",
    location: { lat: 40.76, lng: -73.95 },
    type: "Noise - Street/Sidewalk",
    complaintType: "Noise - Street/Sidewalk",
  },
];
