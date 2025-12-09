import { useEffect, useState } from "react";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { Box } from "@mui/material";
import { DEFAULT_CENTER_LOCATION } from "../../../types";
import type { Place, HeatmapPoint } from "../../../services/placesApi";

type LatLngLiteral = { lat: number; lng: number };

export type { HeatmapPoint, Place };

// Heatmap Layer Component
function HeatmapLayer({ points }: { points: HeatmapPoint[] }) {
  const map = useMap();
  const visualization = useMapsLibrary("visualization");
  const [heatmap, setHeatmap] = useState<google.maps.visualization.HeatmapLayer | null>(null);

  useEffect(() => {
    if (!visualization || !map) return;

    // Create heatmap layer
    const heatmapLayer = new visualization.HeatmapLayer({
      map,
      data: [],
      radius: 50,
      opacity: 0.7,
      maxIntensity: 10,  // Force red at 10+ complaints per cell
      dissipating: true,
      gradient: [
        "rgba(255, 255, 0, 0)",      // Transparent (edge of heatmap)
        "rgba(255, 255, 0, 0.6)",    // Yellow (few complaints)
        "rgba(255, 200, 0, 0.7)",    // Light orange
        "rgba(255, 150, 0, 0.75)",   // Orange
        "rgba(255, 100, 0, 0.8)",    // Dark orange
        "rgba(255, 50, 0, 0.85)",    // Light red
        "rgba(255, 0, 0, 0.9)",      // Red (many complaints)
      ],
    });

    setHeatmap(heatmapLayer);

    return () => {
      heatmapLayer.setMap(null);
    };
  }, [visualization, map]);

  // Update heatmap data when points change
  useEffect(() => {
    if (!heatmap || !points.length) return;

    const data = points.map((point) => ({
      location: new google.maps.LatLng(point.lat, point.lng),
      weight: point.weight,
    }));

    heatmap.setData(data);
  }, [heatmap, points]);

  return null;
}

// Quiet Zone Overlay - Green base layer representing quiet areas
function QuietZoneOverlay() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Cover NYC area with green overlay to represent quiet zones
    const quietZone = new google.maps.Rectangle({
      bounds: {
        north: 40.92,
        south: 40.49,
        east: -73.70,
        west: -74.26,
      },
      fillColor: "#4CAF50",
      fillOpacity: 0.15,
      strokeWeight: 0,
      map,
      zIndex: 0,
    });

    return () => quietZone.setMap(null);
  }, [map]);

  return null;
}

// Places Markers Layer
function PlacesMarkersLayer({
  places,
  selectedPlace,
  onSelectPlace,
  userLocation,
}: {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  userLocation: LatLngLiteral | null;
}) {
  return (
    <>
      {places.map((place) => (
        <AdvancedMarker
          key={place.place_id}
          position={place.location}
          onClick={() => onSelectPlace(place)}
          zIndex={selectedPlace?.place_id === place.place_id ? 50 : 10}
        >
          <div
            style={{
              width: selectedPlace?.place_id === place.place_id ? "32px" : "24px",
              height: selectedPlace?.place_id === place.place_id ? "32px" : "24px",
              backgroundColor: selectedPlace?.place_id === place.place_id ? "#2E7D32" : "#4CAF50",
              border: "3px solid #ffffff",
              borderRadius: "50%",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ color: "white", fontSize: selectedPlace?.place_id === place.place_id ? "14px" : "10px", fontWeight: "bold" }}>
              {getPlaceIcon(place.types)}
            </span>
          </div>
        </AdvancedMarker>
      ))}
      {/* User location marker */}
      {userLocation && (
        <AdvancedMarker position={userLocation} zIndex={100}>
          <div
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: "#4285F4",
              border: "2px solid #ffffff",
              borderRadius: "50%",
              boxSizing: "border-box",
              boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          />
        </AdvancedMarker>
      )}
    </>
  );
}

function getPlaceIcon(types: string[]): string {
  if (types.includes("library")) return "📚";
  if (types.includes("park")) return "🌳";
  if (types.includes("plaza") || types.includes("point_of_interest")) return "🏛️";
  return "📍";
}

// Controlled Map Component
interface ControlledMapProps {
  heatmapPoints: HeatmapPoint[];
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  userLocation: LatLngLiteral | null;
  centerTarget: LatLngLiteral | null;
}

function ControlledMap({
  heatmapPoints,
  places,
  selectedPlace,
  onSelectPlace,
  userLocation,
  centerTarget,
}: ControlledMapProps) {
  const map = useMap();
  const [initialUserCenterDone, setInitialUserCenterDone] = useState(false);

  useEffect(() => {
    if (!map || !selectedPlace) return;
    map.panTo(selectedPlace.location);
    map.setZoom(15);
  }, [selectedPlace, map]);

  useEffect(() => {
    if (!map || !centerTarget) return;
    map.panTo(centerTarget);
    map.setZoom(13);
    setInitialUserCenterDone(true);
  }, [centerTarget, map]);

  useEffect(() => {
    if (map && userLocation && !initialUserCenterDone) {
      map.panTo(userLocation);
      setInitialUserCenterDone(true);
    }
  }, [map, userLocation, initialUserCenterDone]);

  const center = userLocation || DEFAULT_CENTER_LOCATION;

  return (
    <Map
      style={{ width: "100%", height: "100%" }}
      defaultZoom={12}
      defaultCenter={center}
      gestureHandling="greedy"
      disableDefaultUI
      mapId={"id"}
    >
      <QuietZoneOverlay />
      <HeatmapLayer points={heatmapPoints} />
      <PlacesMarkersLayer
        places={places}
        selectedPlace={selectedPlace}
        onSelectPlace={onSelectPlace}
        userLocation={userLocation}
      />
    </Map>
  );
}

// Main MapPanel Component
interface MapPanelProps {
  heatmapPoints: HeatmapPoint[];
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  userLocation: LatLngLiteral | null;
  centerTarget: LatLngLiteral | null;
}

export default function MapPanel({
  heatmapPoints,
  places,
  selectedPlace,
  onSelectPlace,
  userLocation,
  centerTarget,
}: MapPanelProps) {
  return (
    <Box style={{ width: "100%", height: "100%" }}>
      <APIProvider
        apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY || ""}
        libraries={["visualization"]}
      >
        <ControlledMap
          heatmapPoints={heatmapPoints}
          places={places}
          selectedPlace={selectedPlace}
          onSelectPlace={onSelectPlace}
          userLocation={userLocation}
          centerTarget={centerTarget}
        />
      </APIProvider>
    </Box>
  );
}
