"""Supabase database client setup."""

from supabase import create_client, Client

from app.config import settings


def get_supabase_client() -> Client:
    """
    Create and return a Supabase client instance.
    
    Returns:
        Supabase client instance
        
    Raises:
        ValueError: If Supabase credentials are not configured
    """
    if not settings.supabase_configured:
        raise ValueError(
            "Supabase credentials not configured. "
            "Set SUPABASE_URL and SUPABASE_KEY environment variables."
        )
    
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


