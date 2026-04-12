import { Grid } from "@mui/material";
import HistoryChart from "../../../components/common/HistoryChart";

export default function DashboardCharts({ lightHistory, soilHistory }) {
  return (
    <Grid container spacing={3} sx={{ width: "100%" }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <HistoryChart
          title="Lịch sử ánh sáng"
          data={lightHistory}
          dataKey="lightIntensity"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <HistoryChart
          title="Lịch sử độ ẩm đất"
          data={soilHistory}
          dataKey="soilMoisture"
        />
      </Grid>
    </Grid>
  );
}