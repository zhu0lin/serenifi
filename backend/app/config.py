"""Configuration management for the application."""

import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv

# Load environment variables from .env file
# Look for .env in the backend directory (parent of app/)
backend_dir = Path(__file__).parent.parent
env_path = backend_dir / ".env"
load_dotenv(dotenv_path=env_path)


class Settings:
    """Application settings loaded from environment variables."""
    
    # Supabase configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    
    # NYC OpenData API configuration
    NYC_OPENDATA_APP_TOKEN: Optional[str] = os.getenv("NYC_OPENDATA_APP_TOKEN")
    
    # NYC OpenData API endpoint
    NYC_OPENDATA_BASE_URL: str = "https://data.cityofnewyork.us/resource/p5f6-bkga.json"
    
    # Google Places API configuration
    GOOGLE_PLACES_API_KEY: Optional[str] = os.getenv("GOOGLE_PLACES_API_KEY")
    
    @property
    def supabase_configured(self) -> bool:
        """Check if Supabase is properly configured."""
        return bool(self.SUPABASE_URL and self.SUPABASE_KEY)
    
    @property
    def google_places_configured(self) -> bool:
        """Check if Google Places API is properly configured."""
        return bool(self.GOOGLE_PLACES_API_KEY)


# Global settings instance
settings = Settings()

