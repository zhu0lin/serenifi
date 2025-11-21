"""Health check endpoints."""

from datetime import datetime
from typing import Any, Dict

from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from app.config import settings

router = APIRouter(prefix="/health", tags=["health"])


@router.get("", status_code=status.HTTP_200_OK)
async def health_check() -> Dict[str, str]:
    """
    Basic health check endpoint.
    
    Returns:
        Dictionary with health status and timestamp
    """
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "nyc-quiet-spaces-api"
    }


@router.get("/ready")
async def readiness_check() -> JSONResponse:
    """
    Readiness check endpoint that verifies service dependencies.
    
    Returns:
        JSONResponse with readiness status and dependency checks
    """
    checks = {
        "supabase_configured": settings.supabase_configured,
    }
    
    all_ready = all(checks.values())
    
    response_data: Dict[str, Any] = {
        "status": "ready" if all_ready else "not_ready",
        "timestamp": datetime.utcnow().isoformat(),
        "checks": checks
    }
    
    status_code = status.HTTP_200_OK if all_ready else status.HTTP_503_SERVICE_UNAVAILABLE
    
    return JSONResponse(content=response_data, status_code=status_code)

