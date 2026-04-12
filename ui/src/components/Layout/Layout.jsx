import { Box } from "@mui/material";
import Menu from "../Menu/Menu";
import Footer from "../Footer/Footer";

export default function Layout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f4f7fb",
      }}
    >
      <Menu />

      <Box
        component="main"
        sx={{
          flex: 1,
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          px: { xs: 2, md: 3 },
          py: 3,
        }}
      >
        {children}
      </Box>

      <Footer />
    </Box>
  );
}