"""NYC OpenData API client for fetching 311 Noise Complaints."""

import logging
from typing import List, Optional

import httpx

from app.config import settings
from app.models.noise_complaint import NoiseComplaint
from app.utils.date_utils import get_past_week_timestamp_range

logger = logging.getLogger(__name__)


class NYCOpenDataClient:
    """Client for interacting with NYC OpenData Socrata API."""
    
    def __init__(self):
        """Initialize the NYC OpenData client."""
        self.base_url = settings.NYC_OPENDATA_BASE_URL
        self.app_token = settings.NYC_OPENDATA_APP_TOKEN
        self.client = httpx.AsyncClient(timeout=30.0)
    
    def _get_headers(self) -> dict:
        """Get HTTP headers for API requests."""
        headers = {"Accept": "application/json"}
        if self.app_token:
            headers["X-App-Token"] = self.app_token
        return headers
    
    async def fetch_past_week_complaints(
        self,
        limit: int = 5000,
        offset: int = 0,
        use_token: bool = True
    ) -> List[NoiseComplaint]:
        """
        Fetch noise complaints from the past 7 days.
        
        Args:
            limit: Maximum number of records to fetch per request
            offset: Offset for pagination
            use_token: Whether to use the app token (for retry without token)
            
        Returns:
            List of NoiseComplaint objects
        """
        start_date, end_date = get_past_week_timestamp_range()
        
        # Socrata API query parameters
        params = {
            "$where": f"created_date >= '{start_date}' AND created_date <= '{end_date}'",
            "$limit": limit,
            "$offset": offset,
            "$order": "created_date DESC"
        }
        
        # Get headers - optionally skip token if retrying
        headers = {"Accept": "application/json"}
        if use_token and self.app_token:
            headers["X-App-Token"] = self.app_token
        
        try:
            response = await self.client.get(
                self.base_url,
                headers=headers,
                params=params
            )
            response.raise_for_status()
            
            data = response.json()
            
            # Parse and validate data - extract only the fields we need
            complaints = []
            for item in data:
                try:
                    # Extract only the fields we care about
                    filtered_item = {
                        "unique_key": item.get("unique_key"),
                        "latitude": item.get("latitude"),
                        "longitude": item.get("longitude"),
                        "complaint_type": item.get("complaint_type")
                    }
                    
                    # Skip if unique_key is missing (required field)
                    if not filtered_item["unique_key"]:
                        continue
                    
                    complaint = NoiseComplaint(**filtered_item)
                    complaints.append(complaint)
                except Exception as e:
                    logger.warning(f"Failed to parse complaint record: {e}")
                    continue
            
            logger.info(f"Fetched {len(complaints)} noise complaints (offset: {offset})")
            return complaints
            
        except httpx.HTTPStatusError as e:
            # If we get a 403 with invalid token error and we're using a token, retry without it
            if (e.response.status_code == 403 and 
                use_token and 
                self.app_token and
                "Invalid app_token" in e.response.text):
                logger.warning("Invalid app token detected, retrying without token...")
                return await self.fetch_past_week_complaints(limit=limit, offset=offset, use_token=False)
            
            logger.error(f"HTTP error fetching complaints: {e.response.status_code} - {e.response.text}")
            raise
        except Exception as e:
            logger.error(f"Error fetching complaints: {e}")
            raise
    
    async def fetch_all_past_week_complaints(self) -> List[NoiseComplaint]:
        """
        Fetch all noise complaints from the past 7 days with pagination.
        
        Returns:
            List of all NoiseComplaint objects from the past week
        """
        all_complaints = []
        limit = 5000
        offset = 0
        
        while True:
            complaints = await self.fetch_past_week_complaints(limit=limit, offset=offset)
            
            if not complaints:
                break
            
            all_complaints.extend(complaints)
            
            # If we got fewer than the limit, we've reached the end
            if len(complaints) < limit:
                break
            
            offset += limit
        
        logger.info(f"Total complaints fetched: {len(all_complaints)}")
        return all_complaints
    
    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()


# Global client instance
nyc_opendata_client = NYCOpenDataClient()

