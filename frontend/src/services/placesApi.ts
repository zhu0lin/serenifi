/**
 * Places API service for fetching quiet places
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface PlaceLocation {
  lat: number;
  lng: number;
}

export interface PlacePhoto {
  photo_reference: string;
  height: number;
  width: number;
}

export interface Place {
  place_id: string;
  name: string;
  rating: number | null;
  user_ratings_total: number | null;
  address: string | null;
  location: PlaceLocation;
  types: string[];
  photo: PlacePhoto | null;
  is_open: boolean | null;
}

export interface PlacesResponse {
  places: Place[];
  total: number;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  weight: number;
}

export interface DensityResponse {
  points: HeatmapPoint[];
  total_complaints: number;
  max_density: number;
}

/**
 * Fetch quiet places (libraries, parks, POPS) near a location
 * @param lat Latitude of search center
 * @param lng Longitude of search center
 * @param radius Search radius in meters
 * @param minRating Minimum rating filter
 * @returns List of places
 */
export async function fetchPlaces(
  lat: number,
  lng: number,
  radius: number = 2000,
  minRating: number = 4.0
): Promise<Place[]> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lng: lng.toString(),
    radius: radius.toString(),
    min_rating: minRating.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/places?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch places: ${response.statusText}`);
  }

  const data: PlacesResponse = await response.json();
  return data.places;
}

/**
 * Fetch noise complaint density data for heatmap
 * @param gridSize Grid cell size in degrees
 * @param limit Maximum complaints to process
 * @returns Density data with heatmap points
 */
export async function fetchDensity(
  gridSize: number = 0.005,
  limit: number = 5000
): Promise<DensityResponse> {
  const params = new URLSearchParams({
    grid_size: gridSize.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/complaints/density?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch density: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get the photo URL for a place
 * @param photoReference Photo reference from Google Places
 * @param maxWidth Maximum width of the photo
 * @returns Photo URL
 */
export async function getPlacePhotoUrl(
  photoReference: string,
  maxWidth: number = 400
): Promise<string> {
  const params = new URLSearchParams({
    photo_reference: photoReference,
    max_width: maxWidth.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/places/photo?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to get photo URL: ${response.statusText}`);
  }

  const data = await response.json();
  return data.photo_url;
}

