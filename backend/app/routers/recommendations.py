"""Router for place recommendations based on noise levels."""

import asyncio
import logging
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel

from app.services.google_maps import GoogleMapsService
from app.services.supabase_service import supabase_service

router = APIRouter(
    prefix="/recommendations",
    tags=["recommendations"]
)

logger = logging.getLogger(__name__)


class RecommendationRequest(BaseModel):
    """Request model for recommendations."""
    latitude: float
    longitude: float
    preferences: List[str]
    radius_miles: float = 2.0


class PlaceRecommendation(BaseModel):
    """Model for a recommended place."""
    name: str
    address: str
    latitude: float
    longitude: float
    place_id: str
    noise_score: int
    type: str


class RecommendationResponse(BaseModel):
    """Response model for recommendations."""
    recommendations: List[PlaceRecommendation]


@router.post("/", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest = Body(...)):
    """
    Get place recommendations based on user preferences and noise levels.
    Returns the top 5 quietest places.
    """
    logger.info(f"Received recommendation request: {request}")
    google_maps = GoogleMapsService()
    
    # Convert miles to meters for Google Maps API
    radius_meters = int(request.radius_miles * 1609.34)
    
    # Calculate bounding box for fetching complaints (approximate)
    # 1 degree lat ~= 69 miles, 1 degree lng ~= 53 miles (at NYC lat)
    lat_delta = request.radius_miles / 69.0
    lng_delta = request.radius_miles / 53.0
    
    try:
        # 1. Fetch all relevant complaints in parallel with Google Maps calls
        complaints_task = asyncio.to_thread(
            supabase_service.get_complaints_in_area,
            min_lat=request.latitude - lat_delta,
            max_lat=request.latitude + lat_delta,
            min_lng=request.longitude - lng_delta,
            max_lng=request.longitude + lng_delta
        )
        
        # 2. Create tasks for Google Maps searches
        # Add "keyword" to refine searches for cafes and libraries
        places_tasks = []
        for pref in request.preferences:
            search_type = pref
            keyword = None
            
            if pref == "cafe":
                keyword = "coffee shop"
            elif pref == "library":
                keyword = "public library"
            elif pref == "pops":
                # Map "pops" to parks/plazas since Google doesn't have a POPS type
                search_type = "park"
                keyword = "public plaza"
                
            places_tasks.append(
                google_maps.search_nearby_places(
                    latitude=request.latitude,
                    longitude=request.longitude,
                    radius=radius_meters,
                    place_type=search_type,
                    keyword=keyword
                )
            )
        
        # 3. Execute all tasks concurrently
        results = await asyncio.gather(complaints_task, *places_tasks)
        
        complaints_in_area = results[0]
        places_results = results[1:]
        
        # Flatten places list
        all_raw_places = []
        for p_list in places_results:
            all_raw_places.extend(p_list)
            
        # Deduplicate places by place_id
        seen_place_ids = set()
        unique_places = []
        for place in all_raw_places:
            pid = place.get("place_id")
            if pid and pid not in seen_place_ids:
                seen_place_ids.add(pid)
                unique_places.append(place)
        
        # Process places
        all_places = []
        for place in unique_places:
            # Filter out unwanted types that might be miscategorized
            place_types = place.get("types", [])
            excluded_types = {
                "clothing_store", "department_store", "shoe_store", 
                "electronics_store", "furniture_store", "lawyer", 
                "accounting", "real_estate_agency", "dentist", 
                "doctor", "gym", "beauty_salon", "hair_care",
                "car_dealer", "gas_station", "convenience_store",
                "grocery_or_supermarket", "supermarket"
            }
            
            if any(t in excluded_types for t in place_types):
                continue

            # Special handling for libraries: Filter out private/university libraries if possible
            # We check if the name contains "Public Library" or if it's a known public system
            if "library" in place_types:
                name_lower = place.get("name", "").lower()
                # Keywords that suggest a library is likely private or restricted
                private_keywords = ["university", "college", "school", "law", "medical", "institute", "society", "foundation", "archive", "center for"]
                # Keywords that suggest a library is public
                public_keywords = ["public library", "branch", "reading room"]
                
                # If it has a private keyword and NOT a public keyword, skip it
                if any(k in name_lower for k in private_keywords) and not any(k in name_lower for k in public_keywords):
                    continue

            # Extract location
            loc = place.get("geometry", {}).get("location", {})
            lat = loc.get("lat")
            lng = loc.get("lng")
            
            if lat and lng:
                # Calculate noise score in memory
                # Check for complaints within ~150m (0.0015 degrees)
                noise_score = 0
                radius_sq = 0.0015 ** 2
                
                for complaint in complaints_in_area:
                    c_lat = complaint.get("latitude")
                    c_lng = complaint.get("longitude")
                    if c_lat and c_lng:
                        # Simple squared euclidean distance check for speed
                        dist_sq = (c_lat - lat) ** 2 + (c_lng - lng) ** 2
                        if dist_sq <= radius_sq:
                            noise_score += 1
                
                # Determine the display type
                # Prioritize types that match user preferences
                display_type = place.get("types", ["unknown"])[0]
                for pref in request.preferences:
                    if pref in place_types:
                        display_type = pref
                        break

                all_places.append(PlaceRecommendation(
                    name=place.get("name", "Unknown"),
                    address=place.get("vicinity", "Unknown"),
                    latitude=lat,
                    longitude=lng,
                    place_id=place.get("place_id", ""),
                    noise_score=noise_score,
                    type=display_type
                ))
        
        # Sort by noise score (ascending) and take top 10
        sorted_places = sorted(all_places, key=lambda x: x.noise_score)
        top_places = sorted_places[:10]
        
        return RecommendationResponse(recommendations=top_places)
        
    except Exception as e:
        logger.error(f"Error generating recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await google_maps.close()
