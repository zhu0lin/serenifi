"""Places API endpoints - proxy to Google Places API."""

import logging
from typing import List, Optional

import httpx
from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import RedirectResponse
from pydantic import BaseModel

from app.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/places", tags=["places"])

# Google Places API endpoints
PLACES_NEARBY_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
PLACES_PHOTO_URL = "https://maps.googleapis.com/maps/api/place/photo"
PLACES_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json"
STREETVIEW_URL = "https://maps.googleapis.com/maps/api/streetview"


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


class OpeningHoursPeriod(BaseModel):
    """A single opening hours period."""
    open_day: int
    open_time: str
    close_day: Optional[int] = None
    close_time: Optional[str] = None


class PlaceReview(BaseModel):
    """A user review for a place."""
    author_name: str
    rating: int
    text: str
    time: int  # Unix timestamp
    relative_time_description: str


class PlaceDetails(BaseModel):
    """Detailed information about a place."""
    place_id: str
    name: str
    formatted_address: Optional[str] = None
    formatted_phone_number: Optional[str] = None
    website: Optional[str] = None
    url: Optional[str] = None  # Google Maps URL
    rating: Optional[float] = None
    user_ratings_total: Optional[int] = None
    location: PlaceLocation
    types: List[str]
    opening_hours: Optional[List[str]] = None  # Formatted weekday text
    is_open: Optional[bool] = None
    reviews: List[PlaceReview] = []
    photos: List[PlacePhoto] = []


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


@router.get("/streetview")
async def get_streetview_image(
    lat: float = Query(..., description="Latitude of the location"),
    lng: float = Query(..., description="Longitude of the location"),
    width: int = Query(400, description="Image width in pixels"),
    height: int = Query(200, description="Image height in pixels"),
):
    """
    Get a Street View image for a location.
    
    Redirects to the Google Street View Static API image.
    """
    if not settings.google_places_configured:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google Places API not configured.",
        )
    
    streetview_url = f"{STREETVIEW_URL}?size={width}x{height}&location={lat},{lng}&key={settings.GOOGLE_PLACES_API_KEY}"
    
    return RedirectResponse(url=streetview_url)


@router.get("/{place_id}/details", response_model=PlaceDetails)
async def get_place_details(place_id: str):
    """
    Get detailed information about a place.
    
    Returns extended info including phone, website, hours, and reviews.
    """
    if not settings.google_places_configured:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google Places API not configured.",
        )
    
    # Fields to request from Google Places API
    fields = [
        "place_id",
        "name",
        "formatted_address",
        "formatted_phone_number",
        "website",
        "url",
        "rating",
        "user_ratings_total",
        "geometry",
        "types",
        "opening_hours",
        "reviews",
        "photos",
    ]
    
    params = {
        "place_id": place_id,
        "fields": ",".join(fields),
        "key": settings.GOOGLE_PLACES_API_KEY,
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(PLACES_DETAILS_URL, params=params)
            response.raise_for_status()
            data = response.json()
            
            if data.get("status") != "OK":
                logger.error(f"Google Places Details API error: {data.get('status')} - {data.get('error_message', '')}")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Place not found: {data.get('status')}",
                )
            
            result = data.get("result", {})
            location = result.get("geometry", {}).get("location", {})
            
            # Parse reviews
            reviews = []
            for review_data in result.get("reviews", [])[:5]:  # Limit to 5 reviews
                reviews.append(PlaceReview(
                    author_name=review_data.get("author_name", "Anonymous"),
                    rating=review_data.get("rating", 0),
                    text=review_data.get("text", ""),
                    time=review_data.get("time", 0),
                    relative_time_description=review_data.get("relative_time_description", ""),
                ))
            
            # Parse photos
            photos = []
            for photo_data in result.get("photos", [])[:5]:  # Limit to 5 photos
                photos.append(PlacePhoto(
                    photo_reference=photo_data.get("photo_reference", ""),
                    height=photo_data.get("height", 0),
                    width=photo_data.get("width", 0),
                ))
            
            # Parse opening hours
            opening_hours = None
            is_open = None
            hours_data = result.get("opening_hours", {})
            if hours_data:
                opening_hours = hours_data.get("weekday_text", [])
                is_open = hours_data.get("open_now")
            
            return PlaceDetails(
                place_id=result.get("place_id", place_id),
                name=result.get("name", ""),
                formatted_address=result.get("formatted_address"),
                formatted_phone_number=result.get("formatted_phone_number"),
                website=result.get("website"),
                url=result.get("url"),
                rating=result.get("rating"),
                user_ratings_total=result.get("user_ratings_total"),
                location=PlaceLocation(
                    lat=location.get("lat", 0),
                    lng=location.get("lng", 0),
                ),
                types=result.get("types", []),
                opening_hours=opening_hours,
                is_open=is_open,
                reviews=reviews,
                photos=photos,
            )
            
    except httpx.HTTPError as e:
        logger.error(f"Error fetching place details: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch place details",
        )

