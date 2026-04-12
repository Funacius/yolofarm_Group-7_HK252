import { Box, Switch, Typography } from "@mui/material";

export default function PumpSwitch({
  title,
  checked = false,
  subtitle,
  onChange,
}) {
  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        p: 3,
        boxShadow: "0 2px 10px rgba(15, 23, 42, 0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 92,
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#111827",
            mb: 0.5,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: "15px",
            color: "#6b7280",
          }}
        >
          {subtitle || (checked ? "Đang bật" : "Đang tắt")}
        </Typography>
      </Box>

      <Switch checked={checked} onChange={onChange} />
    </Box>
  );
}