import { Grid } from "@mui/material";
import SensorCard from "../../../components/common/SensorCard";

export default function HistorySummary() {
  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <SensorCard
          title="Nhiệt độ TB"
          value="29.1"
          unit="°C"
          accentColor="#16a34a"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <SensorCard
          title="Độ ẩm KK TB"
          value="71"
          unit="%"
          accentColor="#2563eb"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <SensorCard
          title="Độ ẩm đất TB"
          value="48"
          unit="%"
          accentColor="#f59e0b"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <SensorCard
          title="Ánh sáng TB"
          value="45"
          unit="%"
          accentColor="#c026d3"
        />
      </Grid>
    </Grid>
  );
}