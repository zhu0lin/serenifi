"""Supabase service for database operations."""

import logging
from typing import List, Optional

from supabase import Client

from app.database import get_supabase_client
from app.models.noise_complaint import NoiseComplaint

logger = logging.getLogger(__name__)


class SupabaseService:
    """Service for interacting with Supabase database."""
    
    def __init__(self, client: Optional[Client] = None):
        """
        Initialize the Supabase service.
        
        Args:
            client: Optional Supabase client. If not provided, creates a new one.
        """
        self.client = client or get_supabase_client()
        self.table_name = "noise_complaints"
    
    def ensure_table_exists(self) -> None:
        """
        Ensure the noise_complaints table exists in Supabase.
        Note: This assumes the table is created via Supabase dashboard or migrations.
        For now, we'll just log a warning if operations fail.
        """
        # In a production setup, you would use Supabase migrations
        # For now, we assume the table exists or will be created manually
        logger.info(f"Using table: {self.table_name}")
    
    def insert_complaints(self, complaints: List[NoiseComplaint]) -> int:
        """
        Insert noise complaints into Supabase.
        
        Args:
            complaints: List of NoiseComplaint objects to insert
            
        Returns:
            Number of successfully inserted records
        """
        if not complaints:
            return 0
        
        # Convert Pydantic models to dictionaries
        records = [complaint.model_dump(exclude_none=True) for complaint in complaints]
        
        try:
            # Use upsert to handle duplicates based on unique_key
            response = self.client.table(self.table_name).upsert(
                records,
                on_conflict="unique_key"
            ).execute()
            
            inserted_count = len(response.data) if response.data else 0
            logger.info(f"Inserted/updated {inserted_count} noise complaints")
            return inserted_count
            
        except Exception as e:
            logger.error(f"Error inserting complaints: {e}")
            raise
    
    def get_complaint_by_key(self, unique_key: str) -> Optional[NoiseComplaint]:
        """
        Get a noise complaint by its unique key.
        
        Args:
            unique_key: Unique identifier for the complaint
            
        Returns:
            NoiseComplaint object if found, None otherwise
        """
        try:
            response = self.client.table(self.table_name).select("*").eq(
                "unique_key", unique_key
            ).execute()
            
            if response.data and len(response.data) > 0:
                return NoiseComplaint(**response.data[0])
            return None
            
        except Exception as e:
            logger.error(f"Error fetching complaint: {e}")
            raise
    
    def get_complaints_count(self) -> int:
        """
        Get the total count of noise complaints in the database.
        
        Returns:
            Total count of complaints
        """
        try:
            response = self.client.table(self.table_name).select(
                "unique_key", count="exact"
            ).execute()
            
            return response.count if response.count is not None else 0
            
        except Exception as e:
            logger.error(f"Error counting complaints: {e}")
            raise
    
    def get_all_complaints(
        self,
        limit: int = 1000,
        has_location: bool = True
    ) -> List[NoiseComplaint]:
        """
        Get all noise complaints from the database.
        
        Args:
            limit: Maximum number of complaints to return
            has_location: If True, only return complaints with lat/lng coordinates
            
        Returns:
            List of NoiseComplaint objects
        """
        try:
            query = self.client.table(self.table_name).select("*")
            
            # Filter for complaints that have location data
            if has_location:
                query = query.not_.is_("latitude", "null").not_.is_("longitude", "null")
            
            query = query.limit(limit)
            response = query.execute()
            
            if response.data:
                return [NoiseComplaint(**item) for item in response.data]
            return []
            
        except Exception as e:
            logger.error(f"Error fetching all complaints: {e}")
            raise


# Global service instance
supabase_service = SupabaseService()

