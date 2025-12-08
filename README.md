# NYC Quiet Spaces

A web application for finding quiet spaces in New York City. The app uses 311 Noise Complaints data from NYC OpenData to help users discover peaceful locations like libraries, parks, cafes, and privately owned public spaces (POPS) away from noisy areas.

## Features

- Interactive map interface powered by Google Maps
- Filter quiet spaces by type (Cafe, Library, Park, POPS)
- Filter by distance from your current location
- Responsive design with mobile friendly sidebar
- Real time location detection

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite for build tooling
- Material UI (MUI) for components
- Google Maps API integration
- React Router for navigation

### Backend
- FastAPI (Python)
- Supabase for database
- NYC OpenData API for 311 noise complaints data

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.9+
- Docker and Docker Compose (recommended)
- Supabase account
- Google Maps API key

### Environment Variables

Create a `.env` file in the project root:

```env
# Supabase Configuration (Required)
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key

# NYC OpenData API (Optional - increases rate limits)
NYC_OPENDATA_APP_TOKEN=your_socrata_app_token
```

### Running with Docker (Recommended)

Start both frontend and backend with a single command:

```bash
docker-compose up
```

Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

To stop the services:

```bash
docker-compose down
```

### Running Locally (Without Docker)

#### Frontend

```bash
npm install
npm run dev
```

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Seeding Data

To populate the database with recent noise complaints:

```bash
cd backend
python scripts/seed_data.py
```

## Project Structure

```
fall-ctp/
├── src/                    # Frontend source code
│   ├── components/         # Shared components
│   ├── features/           # Feature modules
│   │   └── MapPage/        # Main map interface
│   └── types/              # TypeScript type definitions
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── models/         # Pydantic models
│   │   ├── routers/        # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   └── scripts/            # Data seeding scripts
├── docker-compose.yml      # Docker orchestration
├── Dockerfile              # Frontend container
└── backend/Dockerfile      # Backend container
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info |
| GET | `/health` | Health check |
| GET | `/health/ready` | Readiness check |
| GET | `/docs` | Interactive API documentation |

## License

This project is private.
