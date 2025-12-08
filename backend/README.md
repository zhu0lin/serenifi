# NYC Quiet Spaces API - Backend

FastAPI backend for finding quiet spaces in NYC using 311 Noise Complaints data from NYC OpenData.

## Features

- Fetches 311 Noise Complaints data from NYC OpenData (past 7 days)
- Stores data in Supabase
- Health check endpoints
- Automatic data seeding script

## Setup

### Prerequisites

- Python 3.9+
- Supabase account and project
- (Optional) NYC OpenData Socrata App Token for higher rate limits

### Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key
NYC_OPENDATA_APP_TOKEN=your_socrata_app_token  # Optional
```

## Running the Application

### Start the FastAPI server:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc

### Seed Initial Data

To fetch and store this week's noise complaints data:

```bash
python scripts/seed_data.py
```

This script will:
1. Fetch all noise complaints from the past 7 days from NYC OpenData
2. Insert/update them in Supabase (using upsert on `unique_key`)

## API Endpoints

### Health Check

- `GET /health` - Basic health check
- `GET /health/ready` - Readiness check (verifies dependencies)

### Example Response

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00",
  "service": "nyc-quiet-spaces-api"
}
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app entry point
│   ├── config.py               # Configuration management
│   ├── database.py             # Supabase client setup
│   ├── models/
│   │   ├── __init__.py
│   │   └── noise_complaint.py  # Pydantic models
│   ├── routers/
│   │   ├── __init__.py
│   │   └── health.py           # Health check endpoints
│   ├── services/
│   │   ├── __init__.py
│   │   ├── nyc_opendata.py     # NYC OpenData API client
│   │   └── supabase_service.py # Supabase operations
│   └── utils/
│       ├── __init__.py
│       └── date_utils.py       # Date filtering utilities
├── scripts/
│   └── seed_data.py            # Data seeding script
├── requirements.txt            # Python dependencies
├── .env.example                # Environment variables template
└── README.md                   # This file
```

## Future Enhancements

- Weekly cron job to update data automatically
- Endpoints to query quiet areas based on noise complaint density
- Integration with libraries, parks, and POPS (Privately Owned Public Spaces) data
- Location-based search and filtering
- Geospatial queries for finding quiet areas near a location

## Notes

- The API fetches data from the past 7 days only
- Data is upserted based on `unique_key` to avoid duplicates
- The NYC OpenData API has rate limits; using an app token increases limits
- For production, update CORS origins in `main.py` to specific frontend URLs

