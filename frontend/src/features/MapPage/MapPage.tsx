// MapPage.tsx
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ListingsPanel from "./components/ListingsPanel";
import MapPanel from "./components/MapPanel";
import MapOverlay from "./components/MapOverlay";
import { useUserLocation } from "./hooks/useUserLocation";
import type { Listing, PlaceType } from "./types/mapTypes";
import { ALL_PLACE_TYPES, allListings } from "./types/mapTypes";
import { mainColor, secondaryColor, DEFAULT_MILES, DEFAULT_CENTER_LOCATION } from "../../types";

const getDistanceInMiles = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};


const sidebarWidth = 400;
const sidebarMaxWidth = "90%";


export default function MapPage() {
  const { userLocation, permission } = useUserLocation();

  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [mapCenterTarget, setMapCenterTarget] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [maxMiles, setMaxMiles] = useState<number | "">(DEFAULT_MILES);
  const [selectedPlaceTypes, setSelectedPlaceTypes] =
    useState<PlaceType[]>(ALL_PLACE_TYPES);


  const handleListingSelect = (listing: Listing) => {
    setSelectedListing(listing);
    setMapCenterTarget(listing.location);
  };

  const handlePlaceTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = event.target;
    setSelectedPlaceTypes((prev) =>
      checked
        ? [...prev, name as PlaceType]
        : prev.filter((type) => type !== name)
    );
  };

  const handleCenterMap = () => {
    if (userLocation) {
      setMapCenterTarget(userLocation);
    } else {
      setMapCenterTarget(DEFAULT_CENTER_LOCATION)
    }
  };

  const handleMilesChange = (event: Event, newValue: number | number[]) => {
    setMaxMiles(newValue as number);
  };

  const isListingFiltered = (listing: Listing): boolean => {
    const maxMilesNum =
      typeof maxMiles === "number" ? maxMiles : DEFAULT_MILES;

    const matchesType = selectedPlaceTypes.includes(listing.type);

    if (!matchesType) return false;

    if (userLocation) {
      const distance = getDistanceInMiles(
        userLocation.lat,
        userLocation.lng,
        listing.location.lat,
        listing.location.lng
      );
      if (distance > maxMilesNum) return false;
      return true;
    }

    return true;
  };

  const filteredListings = allListings.filter(isListingFiltered);

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
      {/* --- LISTINGS PANEL (Sidebar) --- */}
      <Box
        sx={{
          width: { xs: "100%", sm: sidebarOpen ? sidebarWidth : 0 },
          minWidth: { xs: "100%", sm: sidebarOpen ? sidebarWidth : 0 },
          height: { xs: sidebarOpen ? "100%" : 0, sm: "100%" },
          position: { xs: "absolute", sm: "relative" },
          top: 0,
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
          listings={filteredListings}
          onSelect={handleListingSelect}
          onClose={() => setSidebarOpen(false)}
          maxMiles={maxMiles}
          handleMilesChange={handleMilesChange}
          allPlaceTypes={ALL_PLACE_TYPES}
          selectedPlaceTypes={selectedPlaceTypes}
          onPlaceTypeChange={handlePlaceTypeChange}
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
          listings={filteredListings}
          selectedListing={selectedListing}
          onSelect={handleListingSelect}
          userLocation={userLocation}
          centerTarget={mapCenterTarget}
        />

        <MapOverlay
          onCenterMap={handleCenterMap}
          userLocationExists={!!userLocation}
          permission={permission}
          sidebarOpen={sidebarOpen}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          maxMiles={maxMiles}
          handleMilesChange={handleMilesChange}
          allPlaceTypes={ALL_PLACE_TYPES}
          selectedPlaceTypes={selectedPlaceTypes}
          onPlaceTypeChange={handlePlaceTypeChange}
        />
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
        Show {filteredListings.length} Places
      </Button>
    </Box>
  );
}
