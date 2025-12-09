# Development Sprint - 12/09/25

## Overview

Transformed the NYC Quiet Spaces app from a basic map with noise complaint markers to a full-featured quiet places discovery app with:
- Noise density heatmap visualization
- Google Places integration for finding quiet spaces
- Docker containerization for easy deployment

---

## 1. Docker Setup

### Files Created
- `docker-compose.yml` - Orchestrates frontend and backend services
- `frontend/Dockerfile` - Node 20 Alpine container for Vite React app
- `backend/Dockerfile` - Python 3.11 slim container for FastAPI
- `.dockerignore` files for both frontend and backend

### Usage
```bash
# Start both services
docker-compose up

# Rebuild after changes
docker-compose down && docker-compose build && docker-compose up
```

### Ports
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## 2. Project Reorganization

Moved frontend files from root into dedicated `frontend/` folder for cleaner structure:

```
fall-ctp/
├── frontend/           # React/Vite frontend
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── backend/            # FastAPI backend
│   ├── app/
│   ├── Dockerfile
│   └── requirements.txt
├── docs/
├── docker-compose.yml
└── README.md
```

---

## 3. Backend API Endpoints

### Existing Endpoints
- `GET /health` - Health check
- `GET /complaints` - Fetch noise complaints from Supabase
- `POST /complaints/refresh` - Refresh data from NYC OpenData

### New Endpoints Added

#### `GET /complaints/density`
Returns aggregated noise complaint data for heatmap visualization.

**Query Parameters:**
- `grid_size` (float, default: 0.005) - Grid cell size in degrees
- `limit` (int, default: 5000) - Max complaints to process

**Response:**
```json
{
  "points": [
    {"lat": 40.75, "lng": -73.98, "weight": 15.0}
  ],
  "total_complaints": 1234,
  "max_density": 45
}
```

#### `GET /places`
Proxies Google Places API to find quiet places (libraries, parks).

**Query Parameters:**
- `lat` (float, required) - Latitude
- `lng` (float, required) - Longitude
- `radius` (int, default: 2000) - Search radius in meters
- `min_rating` (float, default: 4.0) - Minimum rating filter

**Response:**
```json
{
  "places": [
    {
      "place_id": "ChIJ...",
      "name": "Brooklyn Public Library",
      "rating": 4.5,
      "user_ratings_total": 1234,
      "address": "123 Main St",
      "location": {"lat": 40.75, "lng": -73.98},
      "types": ["library"],
      "photo": {"photo_reference": "...", "height": 400, "width": 600},
      "is_open": true
    }
  ],
  "total": 15
}
```

#### `GET /places/photo`
Returns photo URL for a place.

**Query Parameters:**
- `photo_reference` (string, required) - Photo reference from Google
- `max_width` (int, default: 400) - Max photo width

---

## 4. Frontend Changes

### Map Visualization

**Before:** Individual red markers for each noise complaint

**After:** Heatmap overlay showing noise density
- Green/Yellow = Quiet areas (few complaints)
- Orange/Red = Noisy areas (many complaints)

**Implementation:** `MapPanel.tsx`
- Uses Google Maps Visualization library
- `HeatmapLayer` component with custom gradient
- `maxIntensity: 10` for visible color differentiation

### Sidebar

**Before:** List of noise complaints with type badges

**After:** List of quiet places (libraries, parks) with:
- Photos from Google Places
- Star ratings
- Address
- Open/Closed status
- Type badges (Library, Park)

**Implementation:** `ListingsPanel.tsx`
- Fetches places from `/places` endpoint
- Displays place cards with images
- Click to select and center map

### Data Flow

```
Page Load
    ├── Fetch /complaints/density → Heatmap overlay
    └── User location acquired
            └── Fetch /places (near user) → Sidebar places list
```

---

## 5. Environment Variables

### Root `.env` (for backend via Docker)
```env
SUPABASE_URL=...
SUPABASE_KEY=...
NYC_OPENDATA_APP_TOKEN=...
GOOGLE_PLACES_API_KEY=...
```

### `frontend/.env` (for Vite)
```env
VITE_GOOGLE_MAP_API_KEY=...
VITE_API_URL=http://localhost:8000
```

---

## 6. Key Files Modified

### Backend
- `backend/app/config.py` - Added GOOGLE_PLACES_API_KEY
- `backend/app/main.py` - Registered places router
- `backend/app/routers/complaints.py` - Added /density endpoint
- `backend/app/routers/places.py` - New file for Google Places proxy

### Frontend
- `frontend/src/features/MapPage/MapPage.tsx` - Integrated heatmap and places
- `frontend/src/features/MapPage/components/MapPanel.tsx` - Heatmap layer
- `frontend/src/features/MapPage/components/ListingsPanel.tsx` - Places display
- `frontend/src/services/placesApi.ts` - New API service for places

---

## 7. Google Cloud Setup Required

Enable these APIs in Google Cloud Console:
1. Maps JavaScript API
2. Places API

The same API key can be used for both if properly configured.

---

## 8. Next Steps / Future Work

- Filter places to only show those in "yellow" (quiet) zones
- Add POPS (Privately Owned Public Spaces) data source
- Implement search functionality in header
- Add user reviews/ratings for quiet spaces
- Weekly cron job to refresh noise complaint data
- Production deployment configuration

