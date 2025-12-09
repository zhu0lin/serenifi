"""Complaints API endpoints."""

import logging
from typing import List, Optional
from collections import defaultdict

from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel

from app.models.noise_complaint import NoiseComplaint
from app.services.supabase_service import supabase_service
from app.services.nyc_opendata import nyc_opendata_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/complaints", tags=["complaints"])


class HeatmapPoint(BaseModel):
    """A point for the heatmap with lat, lng, and weight."""
    lat: float
    lng: float
    weight: float


class DensityResponse(BaseModel):
    """Response containing heatmap data."""
    points: List[HeatmapPoint]
    total_complaints: int
    max_density: int


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


@router.get("/density", response_model=DensityResponse)
async def get_complaint_density(
    grid_size: float = Query(0.005, description="Grid cell size in degrees (default ~500m)"),
    limit: int = Query(5000, description="Maximum complaints to process"),
) -> DensityResponse:
    """
    Get noise complaint density data for heatmap visualization.
    
    Returns aggregated complaint data grouped by geographic grid cells,
    suitable for rendering as a heatmap overlay.
    
    Args:
        grid_size: Size of grid cells in degrees (0.001 ≈ 100m, 0.01 ≈ 1km)
        limit: Maximum number of complaints to fetch and process
        
    Returns:
        Heatmap points with lat, lng, and weight (complaint count)
    """
    try:
        # Fetch complaints with location data
        complaints = supabase_service.get_all_complaints(
            limit=limit,
            has_location=True
        )
        
        if not complaints:
            return DensityResponse(points=[], total_complaints=0, max_density=0)
        
        # Group complaints by grid cell
        grid_counts: dict[tuple[float, float], int] = defaultdict(int)
        
        for complaint in complaints:
            if complaint.latitude is not None and complaint.longitude is not None:
                # Round to grid cell
                grid_lat = round(complaint.latitude / grid_size) * grid_size
                grid_lng = round(complaint.longitude / grid_size) * grid_size
                grid_counts[(grid_lat, grid_lng)] += 1
        
        # Find max density for normalization
        max_density = max(grid_counts.values()) if grid_counts else 0
        
        # Convert to heatmap points
        points = []
        for (lat, lng), count in grid_counts.items():
            # Weight is the count - higher count = more weight = more red
            points.append(HeatmapPoint(
                lat=lat,
                lng=lng,
                weight=float(count),
            ))
        
        return DensityResponse(
            points=points,
            total_complaints=len(complaints),
            max_density=max_density,
        )
        
    except Exception as e:
        logger.error(f"Error calculating density: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate complaint density: {str(e)}"
        )

