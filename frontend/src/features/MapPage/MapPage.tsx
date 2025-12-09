// MapPage.tsx
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ListingsPanel from "./components/ListingsPanel";
import MapPanel from "./components/MapPanel";
import PlaceDetailModal from "./components/PlaceDetailModal";
import ChatBot from "./components/ChatBot";
import type { HeatmapPoint } from "./components/MapPanel";
import { useUserLocation } from "./hooks/useUserLocation";
import { fetchPlaces, fetchDensity } from "../../services/placesApi";
import type { Place } from "../../services/placesApi";
import {
  mainColor,
  secondaryColor,
  DEFAULT_CENTER_LOCATION,
} from "../../types";

const sidebarWidth = 400;
const sidebarMaxWidth = "90%";

export default function MapPage() {
  const { userLocation } = useUserLocation();

  // Data state
  const [places, setPlaces] = useState<Place[]>([]);
  const [heatmapPoints, setHeatmapPoints] = useState<HeatmapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [mapCenterTarget, setMapCenterTarget] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Center map on user location when it first becomes available
  const [hasInitialCentered, setHasInitialCentered] = useState(false);
  useEffect(() => {
    if (userLocation && !hasInitialCentered) {
      setMapCenterTarget(userLocation);
      setHasInitialCentered(true);
    }
  }, [userLocation, hasInitialCentered]);

  // Fetch heatmap density data on mount
  useEffect(() => {
    async function loadDensity() {
      try {
        setLoading(true);
        const data = await fetchDensity(0.003, 5000);
        setHeatmapPoints(data.points);
      } catch (err) {
        console.error("Failed to fetch density:", err);
        setError("Failed to load noise data.");
      } finally {
        setLoading(false);
      }
    }

    loadDensity();
  }, []);

  // Fetch places when user location is available
  useEffect(() => {
    if (!userLocation) return;

    async function loadPlaces() {
      try {
        setPlacesLoading(true);
        const fetchedPlaces = await fetchPlaces(
          userLocation!.lat,
          userLocation!.lng,
          3000, // 3km radius
          4.0   // min rating
        );
        setPlaces(fetchedPlaces);
      } catch (err) {
        console.error("Failed to fetch places:", err);
        // Don't show error for places, just empty list
      } finally {
        setPlacesLoading(false);
      }
    }

    loadPlaces();
  }, [userLocation]);

  // Handle place selection from sidebar - opens detail modal
  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
    setMapCenterTarget(place.location);
    setDetailModalOpen(true);
  };

  // Handle place selection from map marker - just highlights and scrolls
  const handleMapMarkerSelect = (place: Place) => {
    setSelectedPlace(place);
    setMapCenterTarget(place.location);
  };

  const handleCenterMap = () => {
    if (userLocation) {
      setMapCenterTarget(userLocation);
    } else {
      setMapCenterTarget(DEFAULT_CENTER_LOCATION);
    }
  };

  // Show loading state for initial density load
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: mainColor }} />
        <Typography variant="body1" color="text.secondary">
          Loading noise data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        flexGrow: 1,
        height: "100%",
        position: "relative",
      }}
    >
      {/* Error banner */}
      {error && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bgcolor: "#fff3cd",
            color: "#856404",
            p: 1,
            textAlign: "center",
            zIndex: 100,
            borderBottom: "1px solid #ffc107",
          }}
        >
          <Typography variant="body2">{error}</Typography>
        </Box>
      )}

      {/* --- LISTINGS PANEL (Sidebar) --- */}
      <Box
        sx={{
          width: { xs: "100%", sm: sidebarOpen ? sidebarWidth : 0 },
          minWidth: { xs: "100%", sm: sidebarOpen ? sidebarWidth : 0 },
          height: { xs: sidebarOpen ? "100%" : 0, sm: "100%" },
          position: { xs: "absolute", sm: "relative" },
          top: error ? 40 : 0,
          left: 0,
          zIndex: 20,
          overflow: "hidden",
          borderRight: { sm: sidebarOpen ? "1px solid #eee" : "none" },
          transition: "all 0.3s ease-in-out",
          maxHeight: { xs: sidebarOpen ? "100%" : 0, sm: "100%" },
          boxShadow: sidebarOpen ? "5px 0 15px rgba(0, 0, 0, 0.3)" : "none",
        }}
      >
        <ListingsPanel
          places={places}
          loading={placesLoading}
          onSelect={handlePlaceSelect}
          onClose={() => setSidebarOpen(false)}
          selectedPlace={selectedPlace}
        />
      </Box>

      {/* --- SIDEBAR TOGGLE BUTTON (Desktop only) --- */}
      <Button
        variant="contained"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        sx={{
          display: { xs: "none", sm: "flex" },
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          left: sidebarOpen ? sidebarWidth : 0,
          zIndex: 25,
          width: 30,
          minWidth: 30,
          height: 60,
          padding: 0,
          borderRadius: "0 8px 8px 0",
          bgcolor: "#fff",
          color: mainColor,
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          transition: "left 0.3s ease-in-out",
          "&:hover": {
            bgcolor: "#f0f0f0",
          },
        }}
      >
        {sidebarOpen ? <NavigateBeforeIcon /> : <NavigateNextIcon />}
      </Button>

      {/* --- MAP PANEL --- */}
      <Box sx={{ flexGrow: 1, height: "100%", position: "relative" }}>
        <MapPanel
          heatmapPoints={heatmapPoints}
          places={places}
          selectedPlace={selectedPlace}
          onSelectPlace={handleMapMarkerSelect}
          userLocation={userLocation}
          centerTarget={mapCenterTarget}
        />

        {/* Center on location button */}
        <Button
          variant="outlined"
          onClick={handleCenterMap}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            background: "#fff",
            minWidth: 0,
            width: 40,
            height: 40,
            borderRadius: "50%",
            padding: 0,
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
            color: "black",
            zIndex: 9,
          }}
        >
          🏠
        </Button>

        {/* Legend */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: 70,
            bgcolor: "white",
            borderRadius: "8px",
            p: 1.5,
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            zIndex: 9,
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5, display: "block" }}>
            Noise Level
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                width: 100,
                height: 12,
                borderRadius: 1,
                background: "linear-gradient(to right, #4CAF50, #FFFF00, #FFA500, #FF0000)",
              }}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontSize: 10 }}>
              Quiet
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", fontSize: 10 }}>
              Noisy
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Mobile Close Button (VIEW MAP) */}
      <Button
        variant="contained"
        onClick={() => setSidebarOpen(false)}
        sx={{
          display: { xs: sidebarOpen ? "flex" : "none", sm: "none" },
          position: "fixed",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 30,
          bgcolor: mainColor,
          "&:hover": { bgcolor: secondaryColor },
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          width: "calc(100% - 32px)",
          maxWidth: sidebarMaxWidth,
        }}
      >
        View Map
      </Button>

      {/* Mobile Open Button (Show X Places) */}
      <Button
        variant="contained"
        onClick={() => setSidebarOpen(true)}
        sx={{
          display: { xs: sidebarOpen ? "none" : "flex", sm: "none" },
          position: "fixed",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 30,
          bgcolor: mainColor,
          "&:hover": { bgcolor: secondaryColor },
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          width: "calc(100% - 32px)",
          maxWidth: sidebarMaxWidth,
        }}
      >
        Show {places.length} Quiet Places
      </Button>

      {/* Place Detail Modal */}
      <PlaceDetailModal
        place={selectedPlace}
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
      />

      {/* Gemini Chatbot */}
      <ChatBot places={places} />
    </Box>
  );
}
