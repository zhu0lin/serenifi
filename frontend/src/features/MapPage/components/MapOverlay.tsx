import React from "react";
import { Box, Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import HomeIcon from "@mui/icons-material/Home";
import MapFilterPanel from "./MapFilterPanel";
import type { PlaceType } from "../types/mapTypes";
import { mainColor, secondaryColor } from "../../../types";

type PermissionState = "granted" | "denied" | "prompt";

interface MapOverlayProps {
  onCenterMap: () => void;
  userLocationExists: boolean;
  permission: PermissionState;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  sidebarOpen: boolean;
  maxMiles: number | "";
  handleMilesChange: (event: Event, newValue: number | number[]) => void;
  allPlaceTypes: PlaceType[];
  selectedPlaceTypes: PlaceType[];
  onPlaceTypeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function MapOverlay({
  onCenterMap,
  filterOpen,
  setFilterOpen,
  sidebarOpen,
  maxMiles,
  handleMilesChange,
  allPlaceTypes: ALL_PLACE_TYPES,
  selectedPlaceTypes,
  onPlaceTypeChange: handlePlaceTypeChange,
}: MapOverlayProps) {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 16,
        left: 16,
        right: 16,
        zIndex: 9,
        display: "flex",
        justifyContent: "space-between",
        pointerEvents: "none",
      }}
    >
      {/* Center Map Button */}
      <Button
        variant="outlined"
        onClick={onCenterMap}
        sx={{
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
          pointerEvents: "auto",
        }}

      >
        <HomeIcon sx={{ fontSize: 20 }} />
      </Button>

      {/* Filter Button (Toggles filter sidebar/modal) */}
      <Button
        variant="contained"
        onClick={() => setFilterOpen(!filterOpen)}
        sx={{
          minWidth: "auto",
          padding: "8px 12px",
          bgcolor: mainColor,
          "&:hover": { bgcolor: secondaryColor },
          pointerEvents: "auto",
          display: sidebarOpen ? "none" : "flex",
        }}
      >
        <FilterListIcon />
      </Button>

      <MapFilterPanel
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        maxMiles={maxMiles}
        handleMilesChange={handleMilesChange}
        allPlaceTypes={ALL_PLACE_TYPES}
        selectedPlaceTypes={selectedPlaceTypes}
        onPlaceTypeChange={handlePlaceTypeChange}
        sidebarOpen={sidebarOpen}
      />
    </Box>
  );
}
