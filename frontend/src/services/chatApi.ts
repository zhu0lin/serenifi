/**
 * Chat API service for Gemini chatbot
 */

import type { Place } from "./placesApi";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface PlaceContext {
  name: string;
  address?: string;
  type?: string;
  rating?: number;
}

interface ChatRequest {
  message: string;
  places?: PlaceContext[];
}

interface ChatResponse {
  response: string;
}

/**
 * Send a message to the Gemini chatbot
 * @param message User's message
 * @param places Optional array of nearby places for context
 * @returns AI response text
 */
export async function sendChatMessage(
  message: string,
  places?: Place[]
): Promise<string> {
  const requestBody: ChatRequest = {
    message,
  };

  // Convert places to context format if provided
  if (places && places.length > 0) {
    requestBody.places = places.map((p) => ({
      name: p.name,
      address: p.address ?? undefined,
      type: p.types?.[0],
      rating: p.rating ?? undefined,
    }));
  }

  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Failed to send message: ${response.statusText}`);
  }

  const data: ChatResponse = await response.json();
  return data.response;
}
