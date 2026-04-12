import { Box, Typography } from "@mui/material";

export default function GaugeCard({
  title,
  value = 0,
  unit = "%",
  accentColor = "#eab308",
}) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  const angle = (safeValue / 100) * 180;

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        p: 3,
        minHeight: 150,
        boxShadow: "0 2px 10px rgba(15, 23, 42, 0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
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

      <Box
        sx={{
          position: "relative",
          width: 150,
          height: 80,
          mx: "auto",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            borderTopLeftRadius: "150px",
            borderTopRightRadius: "150px",
            border: "12px solid #e5e7eb",
            borderBottom: 0,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            left: "50%",
            bottom: 0,
            width: 6,
            height: 64,
            backgroundColor: accentColor,
            borderRadius: 999,
            transformOrigin: "bottom center",
            transform: `translateX(-50%) rotate(${angle - 90}deg)`,
          }}
        />

        <Typography
          sx={{
            position: "absolute",
            left: "50%",
            bottom: 12,
            transform: "translateX(-50%)",
            fontSize: "18px",
            fontWeight: 800,
            color: "#111827",
          }}
        >
          {safeValue}
          {unit}
        </Typography>
      </Box>
    </Box>
  );
}