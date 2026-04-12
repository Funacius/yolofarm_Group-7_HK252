import { Box, Typography } from "@mui/material";

export default function PageHeader({ title, subtitle }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#1f2937",
          mb: 0.5,
        }}
      >
        {title}
      </Typography>

      {subtitle ? (
        <Typography
          sx={{
            fontSize: "16px",
            color: "#6b7280",
          }}
        >
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  );
}