// components/ListingsPanelHeader.tsx
import React from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

interface ListingsPanelHeaderProps {
  listingCount: number;
  onClose: () => void;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
}

export default function ListingsPanelHeader({
  listingCount,
  onClose,
  filterOpen,
  setFilterOpen,
}: ListingsPanelHeaderProps) {

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #eee",
        position: "sticky",
        top: 0,
        zIndex: 10,
        bgcolor: "white",
      }}
    >
      {/* Left side: Title and Filter Button (placed side-by-side) */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {listingCount} Places Found
        </Typography>

        {/* Filter Toggle Button */}
        <Button
          onClick={() => setFilterOpen(!filterOpen)}
          startIcon={<FilterListIcon />}
          endIcon={
            filterOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
          }
          size="small"
          sx={{
            color: "black",
            textTransform: "none",
            fontWeight: 600,
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "4px 12px",
            height: "35px",
            "&:hover": {
              bgcolor: "#f5f5f5",
              borderColor: "#ccc",
            },
          }}
        >
          Filters
        </Button>
      </Box>

      {/* Mobile Close Button: Visible only on small screens */}
      <IconButton
        onClick={onClose}
        size="small"
        sx={{
          display: { xs: "flex", sm: "none" },
          color: "black",
        }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
}
