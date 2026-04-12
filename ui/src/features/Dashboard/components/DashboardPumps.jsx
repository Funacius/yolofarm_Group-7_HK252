import { Box } from "@mui/material";
import PumpSwitch from "../../../components/common/PumpSwitch";

export default function DashboardPumps({
  pump1,
  pump2,
  onTogglePump1,
  onTogglePump2,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "column" },
        gap: 2,
        height: "100%",
      }}
    >
      <PumpSwitch
        title="Máy bơm 1"
        checked={pump1}
        subtitle={pump1 ? "Đang bật" : "Đang tắt"}
        onChange={onTogglePump1}
      />

      <PumpSwitch
        title="Máy bơm 2"
        checked={pump2}
        subtitle={pump2 ? "Đang bật" : "Đang tắt"}
        onChange={onTogglePump2}
      />
    </Box>
  );
}