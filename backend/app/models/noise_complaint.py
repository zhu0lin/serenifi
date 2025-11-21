"""Pydantic models for NYC 311 Noise Complaints data."""

from typing import Optional

from pydantic import BaseModel, Field


class NoiseComplaint(BaseModel):
    """Model representing a NYC 311 Noise Complaint."""
    
    unique_key: str = Field(..., description="Unique identifier for the complaint")
    latitude: Optional[float] = Field(None, description="Latitude coordinate")
    longitude: Optional[float] = Field(None, description="Longitude coordinate")
    complaint_type: Optional[str] = Field(None, description="Type of complaint")


class NoiseComplaintCreate(NoiseComplaint):
    """Model for creating a noise complaint record."""
    pass


class NoiseComplaintResponse(NoiseComplaint):
    """Model for API response."""
    pass

