"""Date utility functions for filtering data by date ranges."""

from datetime import datetime, timedelta
from typing import Tuple


def get_past_week_range() -> Tuple[str, str]:
    """
    Get the date range for the past 7 days.
    
    Returns:
        Tuple of (start_date, end_date) as ISO format strings (YYYY-MM-DD)
    """
    end_date = datetime.now()
    start_date = end_date - timedelta(days=7)
    
    return start_date.strftime("%Y-%m-%d"), end_date.strftime("%Y-%m-%d")


def get_past_week_timestamp_range() -> Tuple[str, str]:
    """
    Get the timestamp range for the past 7 days in Socrata API format.
    
    Returns:
        Tuple of (start_timestamp, end_timestamp) as ISO format strings
    """
    end_date = datetime.now()
    start_date = end_date - timedelta(days=7)
    
    return start_date.isoformat(), end_date.isoformat()

