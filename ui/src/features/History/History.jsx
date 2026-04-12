import { Box, Grid, MenuItem, TextField } from "@mui/material";
import PageHeader from "../../components/common/PageHeader";
import HistoryChart from "../../components/common/HistoryChart";
import "./History.css";

export default function History() {
  const chartData = [
    { time: "8:00", temperature: 28, humidityAir: 76, soilMoisture: 60, lightIntensity: 20 },
    { time: "9:00", temperature: 28.5, humidityAir: 75, soilMoisture: 57, lightIntensity: 28 },
    { time: "10:00", temperature: 29, humidityAir: 74, soilMoisture: 54, lightIntensity: 35 },
    { time: "11:00", temperature: 29.4, humidityAir: 72, soilMoisture: 50, lightIntensity: 40 },
    { time: "12:00", temperature: 30, humidityAir: 70, soilMoisture: 46, lightIntensity: 48 },
    { time: "13:00", temperature: 30.2, humidityAir: 69, soilMoisture: 43, lightIntensity: 55 },
    { time: "14:00", temperature: 29.8, humidityAir: 68, soilMoisture: 41, lightIntensity: 62 },
    { time: "15:00", temperature: 29.1, humidityAir: 67, soilMoisture: 38, lightIntensity: 68 },
  ];

  return (
    <Box>
      <PageHeader
        title="History"
        subtitle="Theo dõi lịch sử dữ liệu cảm biến theo mốc thời gian."
      />

      <Box className="history-filter-bar">
        <TextField
          select
          size="small"
          label="Khoảng thời gian"
          defaultValue="today"
          className="history-filter"
        >
          <MenuItem value="today">Hôm nay</MenuItem>
          <MenuItem value="7days">7 ngày</MenuItem>
          <MenuItem value="30days">30 ngày</MenuItem>
        </TextField>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <HistoryChart
            title="Lịch sử nhiệt độ"
            data={chartData}
            dataKey="temperature"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <HistoryChart
            title="Lịch sử độ ẩm không khí"
            data={chartData}
            dataKey="humidityAir"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <HistoryChart
            title="Lịch sử độ ẩm đất"
            data={chartData}
            dataKey="soilMoisture"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <HistoryChart
            title="Lịch sử ánh sáng"
            data={chartData}
            dataKey="lightIntensity"
          />
        </Grid>
      </Grid>
    </Box>
  );
}