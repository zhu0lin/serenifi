import React from "react";
import { Box } from "@mui/material";
import FilterControlsUI from "./FilterControlsUI";

import type { PlaceType } from "../types/mapTypes";
import { LISTINGS_MAX_MILES } from "../../../types";

interface FilterControlsProps {
  maxMiles: number | "";
  handleMilesChange: (event: Event, newValue: number | number[]) => void;
  allPlaceTypes: PlaceType[];
  selectedPlaceTypes: PlaceType[];
  onPlaceTypeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FilterControls(props: FilterControlsProps) {
  return (
    <Box sx={{ p: 2 }}>
      <FilterControlsUI {...props} sliderMax={LISTINGS_MAX_MILES} />
    </Box>
  );
}
