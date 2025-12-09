import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Rating,
  Chip,
  Divider,
  Link,
  CircularProgress,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhoneIcon from "@mui/icons-material/Phone";
import LanguageIcon from "@mui/icons-material/Language";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsIcon from "@mui/icons-material/Directions";

import {
  fetchPlaceDetails,
  getStreetViewImageUrl,
} from "../../../services/placesApi";
import type { Place, PlaceDetails } from "../../../services/placesApi";
import { mainColor } from "../../../types";

interface PlaceDetailModalProps {
  place: Place | null;
  open: boolean;
  onClose: () => void;
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

export default function PlaceDetailModal({
  place,
  open,
  onClose,
}: PlaceDetailModalProps) {
  const [details, setDetails] = useState<PlaceDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!place || !open) {
      setDetails(null);
      return;
    }

    async function loadDetails() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPlaceDetails(place!.place_id);
        setDetails(data);
      } catch (err) {
        console.error("Failed to fetch place details:", err);
        setError("Failed to load place details");
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
  }, [place, open]);

  if (!place) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          maxHeight: "80vh",
        },
      }}
    >
      {/* Close button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 10,
          bgcolor: "rgba(255,255,255,0.9)",
          "&:hover": { bgcolor: "rgba(255,255,255,1)" },
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Street View Image */}
      <Box
        component="img"
        src={getStreetViewImageUrl(place.location.lat, place.location.lng, 600, 250)}
        alt={place.name}
        sx={{
          width: "100%",
          height: 200,
          objectFit: "cover",
        }}
      />

      <DialogContent sx={{ p: 3 }}>
        {/* Type chip */}
        <Chip
          label={getPlaceTypeLabel(place.types)}
          size="small"
          sx={{
            bgcolor: getPlaceTypeColor(place.types),
            color: "white",
            fontSize: "0.75rem",
            mb: 1,
          }}
        />

        {/* Name */}
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          {place.name}
        </Typography>

        {/* Rating */}
        {place.rating && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
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
                <span> ({place.user_ratings_total.toLocaleString()} reviews)</span>
              )}
            </Typography>
          </Box>
        )}

        {/* Loading state */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={32} sx={{ color: mainColor }} />
          </Box>
        )}

        {/* Error state */}
        {error && (
          <Typography color="error" sx={{ py: 2 }}>
            {error}
          </Typography>
        )}

        {/* Details content */}
        {details && !loading && (
          <>
            <Divider sx={{ my: 2 }} />

            {/* Address */}
            {details.formatted_address && (
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2 }}>
                <LocationOnIcon sx={{ color: "text.secondary", mt: 0.3 }} />
                <Typography variant="body2">{details.formatted_address}</Typography>
              </Box>
            )}

            {/* Phone */}
            {details.formatted_phone_number && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <PhoneIcon sx={{ color: "text.secondary" }} />
                <Link
                  href={`tel:${details.formatted_phone_number}`}
                  underline="hover"
                  sx={{ color: mainColor }}
                >
                  {details.formatted_phone_number}
                </Link>
              </Box>
            )}

            {/* Website */}
            {details.website && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <LanguageIcon sx={{ color: "text.secondary" }} />
                <Link
                  href={details.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{ color: mainColor }}
                >
                  Visit website
                </Link>
              </Box>
            )}

            {/* Google Maps link */}
            {details.url && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <DirectionsIcon sx={{ color: "text.secondary" }} />
                <Link
                  href={details.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{ color: mainColor }}
                >
                  Get directions
                </Link>
              </Box>
            )}

            {/* Opening Hours */}
            {details.opening_hours && details.opening_hours.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2 }}>
                  <AccessTimeIcon sx={{ color: details.is_open ? "#4CAF50" : "#F44336", mt: 0.3 }} />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: details.is_open ? "#4CAF50" : "#F44336",
                        mb: 1,
                      }}
                    >
                      {details.is_open ? "Open now" : "Closed"}
                    </Typography>
                    {details.opening_hours.map((hours, idx) => (
                      <Typography
                        key={idx}
                        variant="caption"
                        sx={{ display: "block", color: "text.secondary", lineHeight: 1.6 }}
                      >
                        {hours}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </>
            )}

            {/* Reviews */}
            {details.reviews && details.reviews.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Recent Reviews
                </Typography>
                {details.reviews.slice(0, 3).map((review, idx) => (
                  <Box key={idx} sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: mainColor, fontSize: 12 }}>
                        {review.author_name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {review.author_name}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Rating value={review.rating} size="small" readOnly sx={{ fontSize: 14 }} />
                          <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            {review.relative_time_description}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        pl: 4.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {review.text}
                    </Typography>
                  </Box>
                ))}
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
