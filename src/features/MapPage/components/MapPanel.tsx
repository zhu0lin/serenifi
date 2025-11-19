import { useEffect, useState } from "react";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";

import type { Listing, LatLngLiteral } from "../types/mapTypes";

function MarkersLayer({
  listings,
  onSelect,
  userLocation,
}: {
  listings: Listing[];
  onSelect: (listing: Listing) => void;
  userLocation: LatLngLiteral;
}) {
  return (
    <>
      {listings.map((listing) => (
        <Marker
          key={listing.id}
          position={listing.location}
          onClick={() => onSelect(listing)}
        />
      ))}
      {userLocation && (
        <Marker
          position={userLocation}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: 8,
          }}
          zIndex={100}
        />
      )}
    </>
  );
}

interface ControlledMapProps {
  listings: Listing[];
  selectedListing: Listing | null;
  onSelect: (listing: Listing) => void;
  userLocation: LatLngLiteral;
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

  return (
    <Map
      style={{ width: "100%", height: "100%" }}
      defaultZoom={11}
      defaultCenter={userLocation}
      gestureHandling="greedy"
      disableDefaultUI
    >
      <MarkersLayer
        listings={listings}
        onSelect={onSelect}
        userLocation={userLocation}
      />
    </Map>
  );
}

interface MapPanelProps {
  listings: Listing[];
  selectedListing: Listing | null;
  onSelect: (listing: Listing) => void;
  userLocation: LatLngLiteral;
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
    <div style={{ width: "100%", height: "100%" }}>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY || ""}>
        <ControlledMap
          listings={listings}
          selectedListing={selectedListing}
          onSelect={onSelect}
          userLocation={userLocation}
          centerTarget={centerTarget}
        />
      </APIProvider>
    </div>
  );
}
