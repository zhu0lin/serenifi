"""FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import health, complaints, places, chat

# Create FastAPI app instance
app = FastAPI(
    title="NYC Quiet Spaces API",
    description="API for finding quiet spaces in NYC using 311 Noise Complaints data",
    version="1.0.0"
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Local development
        "https://*.vercel.app",   # Vercel preview and production deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health.router)
app.include_router(complaints.router)
app.include_router(places.router)
app.include_router(chat.router)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "NYC Quiet Spaces API",
        "version": "1.0.0",
        "docs": "/docs"
    }

