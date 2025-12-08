import React from "react";
import {
  Box,
  Typography,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import type { PlaceType } from "../types/mapTypes";
import { mainColor, secondaryColor } from "../../../types";

interface FilterControlsUIProps {
  maxMiles: number | "";
  handleMilesChange: (event: Event, newValue: number | number[]) => void;
  allPlaceTypes: PlaceType[];
  selectedPlaceTypes: PlaceType[];
  onPlaceTypeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sliderMax: number;
}

export default function FilterControlsUI({
  maxMiles,
  handleMilesChange,
  allPlaceTypes,
  selectedPlaceTypes,
  onPlaceTypeChange,
  sliderMax,
}: FilterControlsUIProps) {
  const sliderValue = typeof maxMiles === "number" ? maxMiles : 1;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* --- Property Type Filter (Now first) --- */}
      <Box>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
          Property Type
        </Typography>
        <FormGroup row sx={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
          {allPlaceTypes.map((type) => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  checked={selectedPlaceTypes.includes(type)}
                  onChange={onPlaceTypeChange}
                  name={type}
                  size="small"
                  sx={{
                    color: mainColor,
                    "&.Mui-checked": { color: secondaryColor },
                    p: 0,
                    pl: 1,
                  }}
                />
              }
              label={<Typography variant="body2">{type}</Typography>}
              sx={{ m: 0, mr: 1, mb: 0.5 }}
            />
          ))}
        </FormGroup>
      </Box>

      {/* --- Max Distance Filter (Now second) --- */}
      <Box>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Max Distance (Miles)
          <Typography
            component="span"
            variant="subtitle1"
            sx={{ fontWeight: 700, color: secondaryColor }}
          >
            {sliderValue}{" "}
            <span
              style={{ fontSize: "0.9rem", fontWeight: 500, color: "inherit" }}
            >
              miles
            </span>
          </Typography>
        </Typography>

        <Slider
          aria-label="Max Distance"
          value={sliderValue}
          onChange={handleMilesChange}
          step={1}
          min={1}
          max={sliderMax}
          valueLabelDisplay="auto"
          sx={{
            color: secondaryColor,
            px: "0 !important",
            py: 1,
          }}
        />
      </Box>
    </Box>
  );
}
