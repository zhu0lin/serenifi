"""Google Maps API client for fetching places."""

import logging
from typing import Dict, List, Optional, Any

import httpx

from app.config import settings

logger = logging.getLogger(__name__)


class GoogleMapsService:
    """Service for interacting with Google Maps API."""

    def __init__(self):
        """Initialize the Google Maps service."""
        self.api_key = settings.GOOGLE_MAPS_API_KEY
        self.base_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        self.client = httpx.AsyncClient(timeout=10.0)

    async def search_nearby_places(
        self,
        latitude: float,
        longitude: float,
        radius: int = 1000,  # meters
        place_type: str = "cafe",
        keyword: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Search for nearby places using Google Places API.

        Args:
            latitude: Latitude of the center point
            longitude: Longitude of the center point
            radius: Search radius in meters
            place_type: Type of place to search for (e.g., 'cafe', 'library')
            keyword: Optional keyword to refine search

        Returns:
            List of place dictionaries
        """
        if not self.api_key:
            logger.warning("Google Maps API key not configured.")
            return []

        params = {
            "location": f"{latitude},{longitude}",
            "radius": radius,
            "type": place_type,
            "key": self.api_key
        }

        if keyword:
            params["keyword"] = keyword

        try:
            response = await self.client.get(self.base_url, params=params)
            response.raise_for_status()
            data = response.json()

            if data.get("status") not in ["OK", "ZERO_RESULTS"]:
                logger.error(f"Google Maps API error: {data.get('status')} - {data.get('error_message')}")
                return []

            return data.get("results", [])

        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error calling Google Maps API: {e}")
            return []
        except Exception as e:
            logger.error(f"Error calling Google Maps API: {e}")
            return []

    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()
