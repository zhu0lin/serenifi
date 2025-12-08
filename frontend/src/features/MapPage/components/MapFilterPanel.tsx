import React from "react";
import { Box, Typography, Button } from "@mui/material";
import FilterControlsUI from "./FilterControlsUI";
import type { PlaceType } from "../types/mapTypes";
import { LISTINGS_MAX_MILES } from "../../../types";
interface MapFilterPanelProps {
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  maxMiles: number | "";
  handleMilesChange: (event: Event, newValue: number | number[]) => void;
  allPlaceTypes: PlaceType[];
  selectedPlaceTypes: PlaceType[];
  onPlaceTypeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sidebarOpen?: boolean;
}

export default function MapFilterPanel(props: MapFilterPanelProps) {
  const { filterOpen, setFilterOpen } = props;

  if (!filterOpen) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 50,
        right: { xs: 0, sm: 0 },
        zIndex: 10,
        width: { xs: "calc(100% - 32px)", sm: 320 },
        bgcolor: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        p: 2,
        maxHeight: "80vh",
        overflowY: "auto",
        display: props.sidebarOpen ? "none" : "block",
      }}
    >
      {/* Header and Close Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
          mb: 1,
          borderBottom: "1px solid #eee",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Filters
        </Typography>
      </Box>

      <FilterControlsUI {...props} sliderMax={LISTINGS_MAX_MILES} />

      <Button
        variant="contained"
        fullWidth
        sx={{
          mt: 2,
          bgcolor: "#7890faff",
          "&:hover": { bgcolor: "#5e6df7ff" },
        }}
        onClick={() => setFilterOpen(false)}
      >
        Apply Filters
      </Button>
    </Box>
  );
}
