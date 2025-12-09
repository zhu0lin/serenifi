# Development Sprint - 12/09/25

## Overview

Enhanced the NYC Quiet Spaces app with improved place imagery, interactive map-sidebar linking, detailed place information modal, and refined noise visualization with green quiet zones.

---

## 1. Google Street View Images

### Problem
Place cards in the sidebar showed placeholder icons instead of actual location images because Google Places photo references were often missing or failing to load.

### Solution
Replaced Google Places photos with Google Street View Static API images, which reliably show the actual street-level view of each location.

### Backend Changes
**File:** `backend/app/routers/places.py`

Added new endpoint:
```
GET /places/streetview?lat=40.75&lng=-73.98&width=400&height=200
```
- Redirects to Google Street View Static API image
- Can be used directly as an `<img>` src

### Frontend Changes
**File:** `frontend/src/services/placesApi.ts`
- Added `getStreetViewImageUrl(lat, lng, width, height)` helper function

**File:** `frontend/src/features/MapPage/components/ListingsPanel.tsx`
- Place cards now display Street View images at 140px height
- Fallback to colored placeholder with emoji icon if image fails

---

## 2. Map-Sidebar Interaction

### Feature
When a marker is clicked on the map, the corresponding place card in the sidebar scrolls into view and gets highlighted.

### Implementation
**File:** `frontend/src/features/MapPage/components/ListingsPanel.tsx`
- Added `cardRefs` using `useRef<Map<string, HTMLDivElement>>`
- Each card stores its ref in the map keyed by `place_id`
- `useEffect` watches `selectedPlace` and calls `scrollIntoView({ behavior: "smooth", block: "center" })`

**File:** `frontend/src/features/MapPage/MapPage.tsx`
- Split selection handlers:
  - `handlePlaceSelect` (sidebar click) - opens detail modal
  - `handleMapMarkerSelect` (map click) - highlights and scrolls only

---

## 3. Place Detail Modal

### Feature
Clicking a place card in the sidebar opens a modal with extended information fetched from Google Place Details API.

### Backend Changes
**File:** `backend/app/routers/places.py`

Added new endpoint:
```
GET /places/{place_id}/details
```

**Response includes:**
```json
{
  "place_id": "ChIJ...",
  "name": "Brooklyn Public Library",
  "formatted_address": "10 Grand Army Plaza, Brooklyn, NY",
  "formatted_phone_number": "(718) 230-2100",
  "website": "https://www.bklynlibrary.org",
  "url": "https://maps.google.com/?cid=...",
  "rating": 4.6,
  "user_ratings_total": 1234,
  "opening_hours": ["Monday: 9:00 AM – 9:00 PM", ...],
  "is_open": true,
  "reviews": [...],
  "photos": [...]
}
```

### Frontend Changes
**File:** `frontend/src/services/placesApi.ts`
- Added `PlaceDetails` and `PlaceReview` interfaces
- Added `fetchPlaceDetails(placeId)` function

**File:** `frontend/src/features/MapPage/components/PlaceDetailModal.tsx` (new file)
- MUI Dialog component with:
  - Large Street View image header
  - Place name, type badge, rating
  - Phone number (clickable tel: link)
  - Website link
  - Google Maps directions link
  - Opening hours with open/closed status
  - Recent reviews (up to 3)

**File:** `frontend/src/features/MapPage/MapPage.tsx`
- Added `detailModalOpen` state
- Renders `PlaceDetailModal` component

---

## 4. Green Quiet Zone Visualization

### Problem
The heatmap only showed colors where complaints existed. Areas with no complaints were transparent, making it unclear which areas were quiet.

### Solution
Added a semi-transparent green overlay covering all of NYC as the "baseline quiet zone", with the complaint heatmap (yellow-to-red) overlaid on top.

### Implementation
**File:** `frontend/src/features/MapPage/components/MapPanel.tsx`

Added `QuietZoneOverlay` component:
```typescript
function QuietZoneOverlay() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const quietZone = new google.maps.Rectangle({
      bounds: {
        north: 40.92,
        south: 40.49,
        east: -73.70,
        west: -74.26,
      },
      fillColor: "#4CAF50",
      fillOpacity: 0.15,
      strokeWeight: 0,
      map,
      zIndex: 0,
    });

    return () => quietZone.setMap(null);
  }, [map]);

  return null;
}
```

Updated heatmap gradient to yellow-to-red only (removed green):
```typescript
gradient: [
  "rgba(255, 255, 0, 0)",      // Transparent (edge)
  "rgba(255, 255, 0, 0.6)",    // Yellow (few complaints)
  "rgba(255, 200, 0, 0.7)",    // Light orange
  "rgba(255, 150, 0, 0.75)",   // Orange
  "rgba(255, 100, 0, 0.8)",    // Dark orange
  "rgba(255, 50, 0, 0.85)",    // Light red
  "rgba(255, 0, 0, 0.9)",      // Red (many complaints)
]
```

### Visual Result
- **Green areas** = Quiet zones (no noise complaints)
- **Yellow/Orange/Red areas** = Noise complaint density overlaid on green

---

## 5. Updated Legend

**File:** `frontend/src/features/MapPage/MapPage.tsx`

Updated the map legend to reflect the new visualization:
- Gradient now shows: Green → Yellow → Orange → Red
- Width increased from 80px to 100px
- Labels: "Quiet" (left) to "Noisy" (right)

---

## 6. Files Modified Summary

### Backend
| File | Changes |
|------|---------|
| `backend/app/routers/places.py` | Added `/streetview` and `/{place_id}/details` endpoints |

### Frontend
| File | Changes |
|------|---------|
| `frontend/src/services/placesApi.ts` | Added `getStreetViewImageUrl`, `PlaceDetails`, `fetchPlaceDetails` |
| `frontend/src/features/MapPage/MapPage.tsx` | Added detail modal state, split selection handlers, updated legend |
| `frontend/src/features/MapPage/components/MapPanel.tsx` | Added `QuietZoneOverlay`, updated heatmap gradient |
| `frontend/src/features/MapPage/components/ListingsPanel.tsx` | Street View images, scroll-into-view on selection |
| `frontend/src/features/MapPage/components/PlaceDetailModal.tsx` | New file - place detail modal component |

---

## 7. Google Cloud APIs Used

The following APIs must be enabled in Google Cloud Console:
1. Maps JavaScript API
2. Places API
3. **Street View Static API** (new)

---

## 8. Next Steps / Future Work

- Add "Search this area" button to fetch places when user pans the map
- Filter places to prioritize those in green (quiet) zones
- Add POPS (Privately Owned Public Spaces) data source
- Implement search functionality in header
- Add user reviews/ratings for quiet spaces
- Production deployment configuration
