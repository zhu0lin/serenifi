"""Places API endpoints - proxy to Google Places API."""

import logging
from typing import List, Optional

import httpx
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel

from app.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/places", tags=["places"])

# Google Places API endpoints
PLACES_NEARBY_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
PLACES_PHOTO_URL = "https://maps.googleapis.com/maps/api/place/photo"


class PlaceLocation(BaseModel):
    """Location coordinates for a place."""
    lat: float
    lng: float


class PlacePhoto(BaseModel):
    """Photo reference for a place."""
    photo_reference: str
    height: int
    width: int


class Place(BaseModel):
    """A quiet place (library, park, POPS)."""
    place_id: str
    name: str
    rating: Optional[float] = None
    user_ratings_total: Optional[int] = None
    address: Optional[str] = None
    location: PlaceLocation
    types: List[str]
    photo: Optional[PlacePhoto] = None
    is_open: Optional[bool] = None


class PlacesResponse(BaseModel):
    """Response containing list of places."""
    places: List[Place]
    total: int


def parse_place(place_data: dict) -> Place:
    """Parse a place from Google Places API response."""
    location = place_data.get("geometry", {}).get("location", {})
    
    # Get first photo if available
    photo = None
    photos = place_data.get("photos", [])
    if photos:
        photo = PlacePhoto(
            photo_reference=photos[0].get("photo_reference", ""),
            height=photos[0].get("height", 0),
            width=photos[0].get("width", 0),
        )
    
    # Check if open
    is_open = None
    opening_hours = place_data.get("opening_hours", {})
    if opening_hours:
        is_open = opening_hours.get("open_now")
    
    return Place(
        place_id=place_data.get("place_id", ""),
        name=place_data.get("name", ""),
        rating=place_data.get("rating"),
        user_ratings_total=place_data.get("user_ratings_total"),
        address=place_data.get("vicinity"),
        location=PlaceLocation(
            lat=location.get("lat", 0),
            lng=location.get("lng", 0),
        ),
        types=place_data.get("types", []),
        photo=photo,
        is_open=is_open,
    )


async def search_places_by_type(
    lat: float,
    lng: float,
    radius: int,
    place_type: str,
    min_rating: float,
    client: httpx.AsyncClient,
) -> List[Place]:
    """Search for places of a specific type near a location."""
    params = {
        "location": f"{lat},{lng}",
        "radius": radius,
        "type": place_type,
        "key": settings.GOOGLE_PLACES_API_KEY,
    }
    
    try:
        response = await client.get(PLACES_NEARBY_URL, params=params)
        response.raise_for_status()
        data = response.json()
        
        if data.get("status") not in ["OK", "ZERO_RESULTS"]:
            logger.error(f"Google Places API error: {data.get('status')} - {data.get('error_message', '')}")
            return []
        
        places = []
        for place_data in data.get("results", []):
            place = parse_place(place_data)
            # Filter by minimum rating
            if place.rating is not None and place.rating >= min_rating:
                places.append(place)
        
        return places
        
    except Exception as e:
        logger.error(f"Error searching for {place_type}: {e}")
        return []


@router.get("", response_model=PlacesResponse)
async def get_places(
    lat: float = Query(..., description="Latitude of the search center"),
    lng: float = Query(..., description="Longitude of the search center"),
    radius: int = Query(2000, description="Search radius in meters (max 50000)"),
    min_rating: float = Query(4.0, description="Minimum rating filter (1-5)"),
) -> PlacesResponse:
    """
    Get quiet places (libraries, parks, POPS) near a location.
    
    Returns places with good reviews that are suitable for quiet activities.
    """
    if not settings.google_places_configured:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google Places API not configured. Set GOOGLE_PLACES_API_KEY environment variable.",
        )
    
    # Clamp radius to Google's limit
    radius = min(radius, 50000)
    
    # Place types to search for
    place_types = ["library", "park"]
    
    all_places: List[Place] = []
    seen_place_ids = set()
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        for place_type in place_types:
            places = await search_places_by_type(
                lat=lat,
                lng=lng,
                radius=radius,
                place_type=place_type,
                min_rating=min_rating,
                client=client,
            )
            
            # Deduplicate by place_id
            for place in places:
                if place.place_id not in seen_place_ids:
                    seen_place_ids.add(place.place_id)
                    all_places.append(place)
    
    # Sort by rating (highest first)
    all_places.sort(key=lambda p: p.rating or 0, reverse=True)
    
    return PlacesResponse(
        places=all_places,
        total=len(all_places),
    )


@router.get("/photo")
async def get_place_photo(
    photo_reference: str = Query(..., description="Photo reference from Google Places"),
    max_width: int = Query(400, description="Maximum width of the photo"),
):
    """
    Get a place photo URL.
    
    Returns a redirect to the actual photo URL.
    """
    if not settings.google_places_configured:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google Places API not configured.",
        )
    
    photo_url = f"{PLACES_PHOTO_URL}?maxwidth={max_width}&photo_reference={photo_reference}&key={settings.GOOGLE_PLACES_API_KEY}"
    
    return {"photo_url": photo_url}

