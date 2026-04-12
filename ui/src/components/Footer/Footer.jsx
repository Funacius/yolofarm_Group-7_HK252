import { Box, Toolbar, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box component="footer" sx={{ mt: "auto" }}>
      <Toolbar
        sx={{
          backgroundColor: "#0e8bb3",
          color: "#fff",
          minHeight: "56px !important",
          display: "flex",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            textAlign: "center",
            fontWeight: 400,
          }}
        >
          © 2026 YoloFarm - Trường Đại học Bách Khoa TP.HCM
        </Typography>
      </Toolbar>
    </Box>
  );
}