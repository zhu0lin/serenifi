"""Chat router for Gemini AI chatbot."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import google.generativeai as genai

from app.config import settings

router = APIRouter(prefix="/chat", tags=["chat"])


class PlaceContext(BaseModel):
    """Place information for context."""
    name: str
    address: Optional[str] = None
    type: Optional[str] = None
    rating: Optional[float] = None


class ChatRequest(BaseModel):
    """Chat request model."""
    message: str
    places: Optional[list[PlaceContext]] = None


class ChatResponse(BaseModel):
    """Chat response model."""
    response: str


SYSTEM_PROMPT = """You are a helpful assistant for NYC Quiet Spaces, an app that helps people find quiet places in New York City to study, work, or relax.

Your role is to:
1. Answer questions about finding quiet spaces in NYC
2. Recommend specific places from the user's nearby locations when relevant
3. Provide tips about studying, working remotely, or finding peaceful spots in the city
4. Be friendly, concise, and helpful

Guidelines:
- Keep responses brief and to the point (2-4 sentences usually)
- When recommending places, mention specific names from the provided list if available
- If asked about places not in the provided list, give general NYC advice
- Be encouraging and positive about helping users find their perfect quiet spot
"""


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Send a message to the Gemini chatbot.
    
    Optionally include nearby places for context-aware recommendations.
    """
    if not settings.gemini_configured:
        raise HTTPException(
            status_code=503,
            detail="Gemini API is not configured. Please set GOOGLE_GEMINI_API_KEY."
        )
    
    try:
        # Configure Gemini
        genai.configure(api_key=settings.GOOGLE_GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-flash-latest")
        
        # Build context with places if provided
        context = SYSTEM_PROMPT
        if request.places:
            places_info = "\n".join([
                f"- {p.name} ({p.type or 'unknown type'}): {p.address or 'address unknown'}, Rating: {p.rating or 'N/A'}"
                for p in request.places
            ])
            context += f"\n\nNearby quiet places the user can see:\n{places_info}"
        
        # Generate response
        chat = model.start_chat(history=[])
        response = chat.send_message(f"{context}\n\nUser: {request.message}")
        
        return ChatResponse(response=response.text)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate response: {str(e)}"
        )
