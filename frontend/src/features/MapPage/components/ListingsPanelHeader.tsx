// components/ListingsPanelHeader.tsx
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ParkIcon from "@mui/icons-material/Park";

interface ListingsPanelHeaderProps {
  listingCount: number;
  onClose: () => void;
  filterOpen?: boolean;
  setFilterOpen?: (open: boolean) => void;
}

export default function ListingsPanelHeader({
  listingCount,
  onClose,
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
      {/* Left side: Title */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <ParkIcon sx={{ color: "#4CAF50", fontSize: 28 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            Quiet Places
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {listingCount} places in low-noise areas
          </Typography>
        </Box>
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
