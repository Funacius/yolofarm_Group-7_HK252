import { Box, Typography } from "@mui/material";

export default function SensorCard({
  title,
  value,
  unit,
  accentColor = "#16a34a",
}) {
  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        p: 3,
        minHeight: 150,
        boxShadow: "0 2px 10px rgba(15, 23, 42, 0.06)",
        borderTop: `6px solid ${accentColor}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Typography
        sx={{
          fontSize: "18px",
          fontWeight: 700,
          color: "#374151",
        }}
      >
        {title}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "flex-end", gap: 0.5 }}>
        <Typography
          sx={{
            fontSize: "34px",
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1,
          }}
        >
          {value}
        </Typography>

        {unit ? (
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#111827",
              mb: "2px",
            }}
          >
            {unit}
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
}