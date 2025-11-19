// Layout.jsx
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { Box, styled } from "@mui/material"; // Import 'styled'

// 1. Create a dynamic spacer using the theme's mixin
const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

export default function Layout() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Header />
      <Offset />
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
