import { Alert, Box, CircularProgress, Grid, MenuItem, TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import HistoryChart from "../../components/common/HistoryChart";
import analyticsApi from "../../api/analyticsApi";
import { getDefaultAreaId } from "../../config/env";
import "./History.css";

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

function filterByRange(rows, range) {
  if (!rows.length) return rows;
  const now = Date.now();
  const day = 86400000;
  let cutoff = 0;
  if (range === "today") {
    cutoff = startOfDay(now);
  } else if (range === "7days") {
    cutoff = now - 7 * day;
  } else if (range === "30days") {
    cutoff = now - 30 * day;
  }
  return rows.filter((r) => {
    const t = r.date ? new Date(r.date).getTime() : 0;
    return t >= cutoff;
  });
}

export default function History() {
  const areaId = getDefaultAreaId();
  const [range, setRange] = useState("today");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [raw, setRaw] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setError(null);
      setLoading(true);
      try {
        const data = await analyticsApi.getHistoryChartData({
          area_id: areaId,
          limit: 2000,
        });
        if (!cancelled) setRaw(data);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Không tải được lịch sử");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [areaId]);

  const chartData = useMemo(
    () => filterByRange(raw, range),
    [raw, range]
  );

  const displayRows = useMemo(
    () =>
      chartData.map(({ date: _d, ...rest }) => rest),
    [chartData]
  );

  return (
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      <PageHeader
        title="History"
        subtitle="Theo dõi lịch sử dữ liệu cảm biến theo mốc thời gian."
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box className="history-filter-bar">
        <TextField
          select
          size="small"
          label="Khoảng thời gian"
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="history-filter"
        >
          <MenuItem value="today">Hôm nay</MenuItem>
          <MenuItem value="7days">7 ngày</MenuItem>
          <MenuItem value="30days">30 ngày</MenuItem>
        </TextField>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ width: "100%" }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <HistoryChart
              title="Lịch sử nhiệt độ"
              data={
                displayRows.length
                  ? displayRows
                  : [{ time: "—", temperature: 0 }]
              }
              dataKey="temperature"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <HistoryChart
              title="Lịch sử độ ẩm không khí"
              data={
                displayRows.length
                  ? displayRows
                  : [{ time: "—", humidityAir: 0 }]
              }
              dataKey="humidityAir"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <HistoryChart
              title="Lịch sử độ ẩm đất"
              data={
                displayRows.length
                  ? displayRows
                  : [{ time: "—", soilMoisture: 0 }]
              }
              dataKey="soilMoisture"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <HistoryChart
              title="Lịch sử ánh sáng"
              data={
                displayRows.length
                  ? displayRows
                  : [{ time: "—", lightIntensity: 0 }]
              }
              dataKey="lightIntensity"
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
