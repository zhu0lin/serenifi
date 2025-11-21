"""Script to seed noise complaints data from NYC OpenData into Supabase."""

import asyncio
import logging
import sys
from pathlib import Path

# Add parent directory to path to import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.nyc_opendata import NYCOpenDataClient
from app.services.supabase_service import SupabaseService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


async def seed_data():
    """Fetch past week's noise complaints and store them in Supabase."""
    logger.info("Starting data seeding process...")
    
    # Initialize clients
    opendata_client = NYCOpenDataClient()
    supabase_service = SupabaseService()
    
    try:
        # Ensure table exists
        supabase_service.ensure_table_exists()
        
        # Fetch all complaints from the past week
        logger.info("Fetching noise complaints from NYC OpenData...")
        complaints = await opendata_client.fetch_all_past_week_complaints()
        
        if not complaints:
            logger.warning("No complaints found for the past week")
            return
        
        logger.info(f"Found {len(complaints)} complaints to insert")
        
        # Insert complaints into Supabase
        logger.info("Inserting complaints into Supabase...")
        inserted_count = supabase_service.insert_complaints(complaints)
        
        logger.info(f"Successfully seeded {inserted_count} noise complaints")
        
        # Get final count
        total_count = supabase_service.get_complaints_count()
        logger.info(f"Total complaints in database: {total_count}")
        
    except Exception as e:
        logger.error(f"Error during data seeding: {e}", exc_info=True)
        sys.exit(1)
    finally:
        # Clean up
        await opendata_client.close()


if __name__ == "__main__":
    asyncio.run(seed_data())

