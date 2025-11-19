import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Collapse,
} from "@mui/material";

import ListingsPanelHeader from "./ListingsPanelHeader";
import FilterControlsUI from "./FilterControlsUI";
import type { Listing, PlaceType } from "../types/mapTypes";
import { LISTINGS_MAX_MILES, mainColor } from "../../../types";

interface ListingsPanelProps {
  listings?: Listing[];
  onSelect: (listing: Listing) => void;
  onClose: () => void;
  maxMiles: number | "";
  handleMilesChange: (event: Event, newValue: number | number[]) => void;
  allPlaceTypes: PlaceType[];
  selectedPlaceTypes: PlaceType[];
  onPlaceTypeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ListingsPanel({
  listings = [],
  onSelect,
  onClose,
  maxMiles,
  handleMilesChange,
  allPlaceTypes,
  selectedPlaceTypes,
  onPlaceTypeChange,
}: ListingsPanelProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <Box sx={{ overflowY: "auto", height: "100%" }}>
      {/* --- Header with Filter Button --- */}
      <ListingsPanelHeader
        listingCount={listings.length}
        onClose={onClose}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
      />

      {/* --- Filter Collapse Area (Remains here) --- */}
      <Collapse in={filterOpen} timeout="auto" unmountOnExit>
        {/* The filter UI component */}
        <Box sx={{ p: 2 }}>
          <FilterControlsUI
            maxMiles={maxMiles}
            handleMilesChange={handleMilesChange}
            allPlaceTypes={allPlaceTypes}
            selectedPlaceTypes={selectedPlaceTypes}
            onPlaceTypeChange={onPlaceTypeChange}
            sliderMax={LISTINGS_MAX_MILES}
          />
        </Box>
      </Collapse>

      {/* --- Listings Scroll Area (ALWAYS displayed below the filters) --- */}
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 3 }}>
        {listings.map((listing) => (
          <Card
            key={listing.id}
            onClick={() => onSelect(listing)}
            elevation={2}
            sx={{
              borderRadius: "12px",
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": {
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              },
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <CardMedia
              component="img"
              height="100"
              image={listing.image}
              alt={listing.title}
              sx={{ borderRadius: "12px 12px 0 0" }}
            />

            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {listing.title}
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}
              >
                <Rating
                  value={listing.rating}
                  precision={0.1}
                  size="small"
                  readOnly
                  sx={{ color: mainColor }}
                />
                <Typography variant="body2" sx={{ color: "gray" }}>
                  {listing.rating}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
        {listings.length === 0 && (
          <Typography
            variant="h6"
            color="text.secondary"
            align="center"
            sx={{ pt: 4 }}
          >
            No places match your current filters.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
