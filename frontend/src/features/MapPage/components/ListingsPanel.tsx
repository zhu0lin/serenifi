import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Chip,
  Skeleton,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import ListingsPanelHeader from "./ListingsPanelHeader";
import type { Place } from "../../../services/placesApi";
import { mainColor } from "../../../types";

interface ListingsPanelProps {
  places: Place[];
  loading: boolean;
  onSelect: (place: Place) => void;
  onClose: () => void;
  selectedPlace: Place | null;
}

// Get place type display name
function getPlaceTypeLabel(types: string[]): string {
  if (types.includes("library")) return "Library";
  if (types.includes("park")) return "Park";
  if (types.includes("plaza")) return "Plaza";
  return "Quiet Space";
}

// Get place type color
function getPlaceTypeColor(types: string[]): string {
  if (types.includes("library")) return "#1976D2";
  if (types.includes("park")) return "#388E3C";
  if (types.includes("plaza")) return "#7B1FA2";
  return mainColor;
}

// Get place type icon
function getPlaceTypeIcon(types: string[]): string {
  if (types.includes("library")) return "📚";
  if (types.includes("park")) return "🌳";
  if (types.includes("plaza")) return "🏛️";
  return "📍";
}

// Construct photo URL
function getPhotoUrl(photoReference: string): string {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  return `${apiUrl}/places/photo?photo_reference=${encodeURIComponent(photoReference)}&max_width=400`;
}

export default function ListingsPanel({
  places,
  loading,
  onSelect,
  onClose,
  selectedPlace,
}: ListingsPanelProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (placeId: string) => {
    setImageErrors((prev) => new Set(prev).add(placeId));
  };

  return (
    <Box sx={{ overflowY: "auto", height: "100%", bgcolor: "#fafafa" }}>
      {/* Header */}
      <ListingsPanelHeader
        listingCount={places.length}
        onClose={onClose}
        filterOpen={false}
        setFilterOpen={() => {}}
      />

      {/* Loading skeletons */}
      {loading && (
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} elevation={1} sx={{ borderRadius: "12px" }}>
              <Skeleton variant="rectangular" height={120} />
              <CardContent>
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="40%" height={20} />
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Places list */}
      {!loading && (
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {places.map((place) => (
            <Card
              key={place.place_id}
              onClick={() => onSelect(place)}
              elevation={selectedPlace?.place_id === place.place_id ? 4 : 1}
              sx={{
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  transform: "translateY(-2px)",
                },
                border: selectedPlace?.place_id === place.place_id 
                  ? `2px solid ${mainColor}` 
                  : "2px solid transparent",
              }}
            >
              {/* Place photo */}
              {place.photo && !imageErrors.has(place.place_id) ? (
                <CardMedia
                  component="img"
                  height="120"
                  image={getPhotoUrl(place.photo.photo_reference)}
                  alt={place.name}
                  onError={() => handleImageError(place.place_id)}
                  sx={{ objectFit: "cover" }}
                />
              ) : (
                <Box
                  sx={{
                    height: 120,
                    bgcolor: getPlaceTypeColor(place.types),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h2" sx={{ opacity: 0.3 }}>
                    {getPlaceTypeIcon(place.types)}
                  </Typography>
                </Box>
              )}

              <CardContent sx={{ pb: 2 }}>
                {/* Place type chip */}
                <Chip
                  label={getPlaceTypeLabel(place.types)}
                  size="small"
                  sx={{
                    bgcolor: getPlaceTypeColor(place.types),
                    color: "white",
                    fontSize: "0.7rem",
                    height: 20,
                    mb: 1,
                  }}
                />

                {/* Place name */}
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, lineHeight: 1.3, mb: 0.5 }}
                >
                  {place.name}
                </Typography>

                {/* Rating */}
                {place.rating && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                    <Rating
                      value={place.rating}
                      precision={0.1}
                      size="small"
                      readOnly
                      sx={{ color: "#FFB400" }}
                    />
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {place.rating.toFixed(1)}
                      {place.user_ratings_total && (
                        <span style={{ marginLeft: 4 }}>
                          ({place.user_ratings_total.toLocaleString()})
                        </span>
                      )}
                    </Typography>
                  </Box>
                )}

                {/* Address */}
                {place.address && (
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5, color: "text.secondary" }}>
                    <LocationOnIcon sx={{ fontSize: 16, mt: 0.2 }} />
                    <Typography variant="body2" sx={{ lineHeight: 1.3 }}>
                      {place.address}
                    </Typography>
                  </Box>
                )}

                {/* Open status */}
                {place.is_open !== null && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 14, color: place.is_open ? "#4CAF50" : "#F44336" }} />
                    <Typography
                      variant="caption"
                      sx={{ color: place.is_open ? "#4CAF50" : "#F44336", fontWeight: 500 }}
                    >
                      {place.is_open ? "Open now" : "Closed"}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Empty state */}
          {places.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No quiet places found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your location or search radius.
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
