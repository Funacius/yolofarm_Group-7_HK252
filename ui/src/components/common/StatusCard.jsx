import { Box, Typography } from "@mui/material";

export default function StatusCard({
  title = "Tình trạng",
  status = "Bình thường",
  description = "",
  accentColor = "#f59e0b",
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

      <Box>
        <Typography
          sx={{
            fontSize: "30px",
            fontWeight: 800,
            color: accentColor,
            lineHeight: 1.1,
            mb: 1,
          }}
        >
          {status}
        </Typography>

        <Typography
          sx={{
            fontSize: "15px",
            color: "#6b7280",
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
}