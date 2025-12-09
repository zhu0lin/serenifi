"""Complaints API endpoints."""

import logging
from typing import List

from fastapi import APIRouter, HTTPException, status

from app.models.noise_complaint import NoiseComplaint
from app.services.supabase_service import supabase_service
from app.services.nyc_opendata import nyc_opendata_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/complaints", tags=["complaints"])


@router.get("", response_model=List[NoiseComplaint])
async def get_complaints(
    limit: int = 1000,
    has_location: bool = True
) -> List[NoiseComplaint]:
    """
    Get noise complaints from the database.
    
    Args:
        limit: Maximum number of complaints to return (default 1000)
        has_location: If True, only return complaints with lat/lng coordinates
        
    Returns:
        List of NoiseComplaint objects
    """
    try:
        complaints = supabase_service.get_all_complaints(
            limit=limit,
            has_location=has_location
        )
        return complaints
    except Exception as e:
        logger.error(f"Error fetching complaints: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch complaints: {str(e)}"
        )


@router.post("/refresh")
async def refresh_complaints():
    """
    Fetch fresh complaints from NYC OpenData and store in database.
    
    Returns:
        Summary of the refresh operation
    """
    try:
        # Fetch complaints from NYC OpenData
        complaints = await nyc_opendata_client.fetch_all_past_week_complaints()
        
        # Store in Supabase
        inserted_count = supabase_service.insert_complaints(complaints)
        
        return {
            "status": "success",
            "fetched": len(complaints),
            "inserted": inserted_count
        }
    except Exception as e:
        logger.error(f"Error refreshing complaints: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to refresh complaints: {str(e)}"
        )

