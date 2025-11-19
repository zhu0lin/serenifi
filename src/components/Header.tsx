import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Paper,
  Box,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import HouseIcon from "@mui/icons-material/House";
import { useNavigate } from "react-router-dom";
import { mainColor } from "../types";

export default function Header() {
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        bgcolor: "white",
        color: "black",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        {/* START: LOGO SECTION */}
        <Box
          onClick={() => navigate("/")}
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <HouseIcon sx={{ fontSize: 32, color: mainColor, mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#484848" }}>
            Serenifi
          </Typography>
        </Box>
        {/* END: LOGO SECTION */}

        {/* START: SEARCH BAR */}
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            borderRadius: 20,
            px: 1,
            py: 0.5,
            width: "350px",
            maxWidth: "50%",
            border: "1px solid #ddd",
            position: "relative",
          }}
        >
          <InputBase
            placeholder="Search city or location"
            sx={{ ml: 1, flex: 1, fontSize: 14 }}
          />

          <IconButton>
            <SearchIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Paper>
      </Toolbar>
    </AppBar>
  );
}
