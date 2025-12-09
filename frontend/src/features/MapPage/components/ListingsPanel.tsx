import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Collapse,
  Chip,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import ListingsPanelHeader from "./ListingsPanelHeader";
import FilterControlsUI from "./FilterControlsUI";
import type { Listing, ComplaintType } from "../types/mapTypes";
import { COMPLAINT_TYPE_LABELS } from "../types/mapTypes";
import { LISTINGS_MAX_MILES, mainColor } from "../../../types";

interface ListingsPanelProps {
  listings?: Listing[];
  onSelect: (listing: Listing) => void;
  onClose: () => void;
  maxMiles: number | "";
  handleMilesChange: (event: Event, newValue: number | number[]) => void;
  allComplaintTypes: ComplaintType[];
  selectedComplaintTypes: ComplaintType[];
  onComplaintTypeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// Color mapping for complaint types
const COMPLAINT_TYPE_COLORS: Record<string, string> = {
  "Noise - Residential": "#e57373",
  "Noise - Commercial": "#64b5f6",
  "Noise - Street/Sidewalk": "#ffb74d",
  "Noise - Vehicle": "#81c784",
  "Noise - Park": "#4db6ac",
  "Noise - Helicopter": "#ba68c8",
  "Noise": "#90a4ae",
  "Other": "#bdbdbd",
};

export default function ListingsPanel({
  listings = [],
  onSelect,
  onClose,
  maxMiles,
  handleMilesChange,
  allComplaintTypes,
  selectedComplaintTypes,
  onComplaintTypeChange,
}: ListingsPanelProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <Box sx={{ overflowY: "auto", height: "100%", bgcolor: "#fafafa" }}>
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
        <Box sx={{ p: 2, bgcolor: "white", borderBottom: "1px solid #eee" }}>
          <FilterControlsUI
            maxMiles={maxMiles}
            handleMilesChange={handleMilesChange}
            allComplaintTypes={allComplaintTypes}
            selectedComplaintTypes={selectedComplaintTypes}
            onComplaintTypeChange={onComplaintTypeChange}
            sliderMax={LISTINGS_MAX_MILES}
          />
        </Box>
      </Collapse>

      {/* --- Listings Scroll Area (ALWAYS displayed below the filters) --- */}
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        {listings.map((listing) => (
          <Card
            key={listing.id}
            onClick={() => onSelect(listing)}
            elevation={1}
            sx={{
              borderRadius: "8px",
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": {
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                transform: "translateY(-2px)",
              },
              width: "100%",
              boxSizing: "border-box",
              borderLeft: `4px solid ${COMPLAINT_TYPE_COLORS[listing.type] || mainColor}`,
            }}
          >
            <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 1,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, flex: 1 }}
                >
                  {listing.title}
                </Typography>
                <Chip
                  label={COMPLAINT_TYPE_LABELS[listing.type] || listing.type}
                  size="small"
                  sx={{
                    bgcolor: COMPLAINT_TYPE_COLORS[listing.type] || mainColor,
                    color: "white",
                    fontSize: "0.7rem",
                    height: 20,
                    ml: 1,
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "text.secondary",
                }}
              >
                <LocationOnIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption">
                  {listing.location.lat.toFixed(4)},{" "}
                  {listing.location.lng.toFixed(4)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
        {listings.length === 0 && (
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ pt: 4 }}
          >
            No complaints match your current filters.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
