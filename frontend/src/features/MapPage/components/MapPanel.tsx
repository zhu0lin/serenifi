import { useEffect, useState } from "react";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import { Box } from "@mui/material";
import { DEFAULT_CENTER_LOCATION } from "../../../types";

type LatLngLiteral = { lat: number; lng: number };
import type { Listing } from "../types/mapTypes";

function MarkersLayer({
  listings,
  onSelect,
  userLocation,
  isUserLocationCentered,
}: {
  listings: Listing[];
  onSelect: (listing: Listing) => void;
  userLocation: LatLngLiteral;
  isUserLocationCentered: boolean;
}) {
  return (
    <>
      {listings.map((listing) => (
        <AdvancedMarker
          key={listing.id}
          position={listing.location}
          onClick={() => onSelect(listing)}
        />
      ))}
      {isUserLocationCentered ? (
        <AdvancedMarker position={userLocation} zIndex={100}>
          <div
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: "#4285F4",
              border: "2px solid #ffffff",
              borderRadius: "50%",
              boxSizing: "border-box",
            }}
          />
        </AdvancedMarker>
      ) : (
        <AdvancedMarker position={userLocation} zIndex={100}>
          <div
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: "#00FF00",
              border: "2px solid #ffffff",
              borderRadius: "50%",
              boxSizing: "border-box",
            }}
          />
        </AdvancedMarker>
      )}
    </>
  );
}

// --- ControlledMap Component (No change, as it receives guaranteed valid location) ---
interface ControlledMapProps {
  listings: Listing[];
  selectedListing: Listing | null;
  onSelect: (listing: Listing) => void;
  userLocation: LatLngLiteral | null;
  centerTarget: LatLngLiteral | null;
}

function ControlledMap({
  listings,
  selectedListing,
  onSelect,
  userLocation,
  centerTarget,
}: ControlledMapProps) {
  const map = useMap();
  const [initialUserCenterDone, setInitialUserCenterDone] = useState(false);

  useEffect(() => {
    if (!map || !selectedListing) return;
    map.panTo(selectedListing.location);
    map.setZoom(14);
  }, [selectedListing, map]);

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
      defaultZoom={11}
      defaultCenter={center}
      gestureHandling="greedy"
      disableDefaultUI
      mapId={"id"}
    >
      <MarkersLayer
        listings={listings}
        onSelect={onSelect}
        userLocation={center}
        isUserLocationCentered={!!userLocation}
      />
    </Map>
  );
}

// --- MapPanel Component (With Fallback Logic) ---
interface MapPanelProps {
  listings: Listing[];
  selectedListing: Listing | null;
  onSelect: (listing: Listing) => void;
  userLocation: LatLngLiteral | null; // Can be null from hook
  centerTarget: LatLngLiteral | null;
}

export default function MapPanel({
  listings,
  selectedListing,
  onSelect,
  userLocation,
  centerTarget,
}: MapPanelProps) {
  return (
    <Box style={{ width: "100%", height: "100%" }}>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY || ""}>
        <ControlledMap
          listings={listings}
          selectedListing={selectedListing}
          onSelect={onSelect}
          userLocation={userLocation} // Pass the guaranteed valid center
          centerTarget={centerTarget}
        />
      </APIProvider>
    </Box>
  );
}
