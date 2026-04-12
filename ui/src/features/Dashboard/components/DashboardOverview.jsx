import { Grid } from "@mui/material";
import SensorCard from "../../../components/common/SensorCard";
import StatusCard from "../../../components/common/StatusCard";
import GaugeCard from "../../../components/common/GaugeCard";

export default function DashboardOverview({
  temperature,
  humidityAir,
  lightIntensity,
  soilMoisture,
  soilStatus,
  soilDescription,
}) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <SensorCard
          title="Nhiệt độ"
          value={temperature}
          unit="°C"
          accentColor="#16a34a"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <SensorCard
          title="Độ ẩm không khí"
          value={humidityAir}
          unit="%"
          accentColor="#2563eb"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={2.4}>
        <StatusCard
          title="Tình trạng"
          status={soilStatus}
          description={soilDescription}
          accentColor="#f59e0b"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={6} lg={2.4}>
        <SensorCard
          title="Ánh sáng"
          value={lightIntensity}
          unit="%"
          accentColor="#c026d3"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={6} lg={2.4}>
        <GaugeCard
          title="Độ ẩm đất"
          value={soilMoisture}
          unit="%"
          accentColor="#eab308"
        />
      </Grid>
    </Grid>
  );
}