import { Box, Grid } from "@mui/material";
import PageHeader from "../../components/common/PageHeader";
import SensorCard from "../../components/common/SensorCard";
import StatusCard from "../../components/common/StatusCard";
import GaugeCard from "../../components/common/GaugeCard";
import HistoryChart from "../../components/common/HistoryChart";
import PumpSwitch from "../../components/common/PumpSwitch";
import "./Dashboard.css";
import { useState } from "react";

export default function Dashboard() {
  const [pump1, setPump1] = useState(false);
  const [pump2, setPump2] = useState(false);

  const lightHistory = [
    { time: "8:00", lightIntensity: 20 },
    { time: "9:00", lightIntensity: 28 },
    { time: "10:00", lightIntensity: 35 },
    { time: "11:00", lightIntensity: 40 },
    { time: "12:00", lightIntensity: 48 },
    { time: "13:00", lightIntensity: 55 },
    { time: "14:00", lightIntensity: 62 },
    { time: "15:00", lightIntensity: 68 },
  ];

  const soilHistory = [
    { time: "8:00", soilMoisture: 60 },
    { time: "9:00", soilMoisture: 57 },
    { time: "10:00", soilMoisture: 54 },
    { time: "11:00", soilMoisture: 50 },
    { time: "12:00", soilMoisture: 46 },
    { time: "13:00", soilMoisture: 43 },
    { time: "14:00", soilMoisture: 41 },
    { time: "15:00", soilMoisture: 38 },
  ];

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Theo dõi dữ liệu môi trường và trạng thái hệ thống theo thời gian thực."
      />

      <Grid container spacing={3} className="dashboard-grid">
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <SensorCard
            title="Nhiệt độ"
            value="29.4"
            unit="°C"
            accentColor="#16a34a"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <SensorCard
            title="Độ ẩm không khí"
            value="72"
            unit="%"
            accentColor="#2563eb"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatusCard
            title="Tình trạng"
            status="Đất khô"
            description="Độ ẩm đất đang thấp hơn ngưỡng."
            accentColor="#f59e0b"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={2.4}>
          <SensorCard
            title="Ánh sáng"
            value="68"
            unit="%"
            accentColor="#c026d3"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={2.4}>
          <GaugeCard
            title="Độ ẩm đất"
            value={38}
            unit="%"
            accentColor="#eab308"
          />
        </Grid>

        <Grid item xs={12} md={6} lg={5}>
          <HistoryChart
            title="Lịch sử ánh sáng"
            data={lightHistory}
            dataKey="lightIntensity"
          />
        </Grid>

        <Grid item xs={12} md={6} lg={5}>
          <HistoryChart
            title="Lịch sử độ ẩm đất"
            data={soilHistory}
            dataKey="soilMoisture"
          />
        </Grid>

        <Grid item xs={12} lg={2}>
          <Box className="dashboard-pump-column">
            <PumpSwitch
              title="Máy bơm 1"
              checked={pump1}
              subtitle={pump1 ? "Đang bật" : "Đang tắt"}
              onChange={() => setPump1((prev) => !prev)}
            />

            <PumpSwitch
              title="Máy bơm 2"
              checked={pump2}
              subtitle={pump2 ? "Đang bật" : "Đang tắt"}
              onChange={() => setPump2((prev) => !prev)}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}