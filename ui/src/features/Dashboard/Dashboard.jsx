import { Alert, Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import SensorCard from "../../components/common/SensorCard";
import StatusCard from "../../components/common/StatusCard";
import GaugeCard from "../../components/common/GaugeCard";
import HistoryChart from "../../components/common/HistoryChart";
import PumpSwitch from "../../components/common/PumpSwitch";
import environmentApi from "../../api/environmentApi";
import irrigationApi from "../../api/irrigationApi";
import manualControlApi from "../../api/manualControlApi";
import { getDefaultAreaId } from "../../config/env";
import "./Dashboard.css";

const POLL_MS = 12000;
const CHART_POINTS = 14;

function formatSensorValue(v) {
  if (v == null || Number.isNaN(Number(v))) return "—";
  return Number(v).toFixed(1);
}

export default function Dashboard() {
  const areaId = getDefaultAreaId();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [env, setEnv] = useState(null);
  const [lightHistory, setLightHistory] = useState([]);
  const [soilHistory, setSoilHistory] = useState([]);
  const [soilThreshold, setSoilThreshold] = useState(40);
  const [pumps, setPumps] = useState([]);
  const [pumpOn, setPumpOn] = useState([false, false]);
  const [toggleError, setToggleError] = useState(null);

  const pumpPollHoldUntil = useRef([0, 0]);
  const pumpToggleInProgress = useRef([false, false]);

  const loadData = useCallback(async () => {
    setError(null);
    try {
      const [current, hist, pumpList, cfg] = await Promise.all([
        environmentApi.getCurrentEnvironment(areaId),
        environmentApi.getEnvironmentHistory({
          area_id: areaId,
          limit: 120,
        }),
        irrigationApi.getPumpsByArea(areaId).catch(() => []),
        irrigationApi.getThresholds(areaId).catch(() => ({})),
      ]);

      setEnv(current);
      const slice = hist.slice(-CHART_POINTS);
      setLightHistory(
        slice.map((h) => ({ time: h.time, lightIntensity: h.lightIntensity }))
      );
      setSoilHistory(
        slice.map((h) => ({ time: h.time, soilMoisture: h.soilMoisture }))
      );

      if (cfg?.soilMoistureOnBelow != null) {
        setSoilThreshold(Number(cfg.soilMoistureOnBelow));
      }

      setPumps(pumpList);

      const snap = await manualControlApi.getManualState(areaId).catch(() => null);
      if (snap) {
        const now = Date.now();
        const hold0 = now < pumpPollHoldUntil.current[0];
        const hold1 = now < pumpPollHoldUntil.current[1];
        setPumpOn((prev) => {
          const p1 = hold0 ? prev[0] : snap.pump1;
          const p2 = hold1 ? prev[1] : snap.pump2;
          return [p1, p2];
        });
      } else if (pumpList[0] || pumpList[1]) {
        const now = Date.now();
        setPumpOn((prev) => {
          const p1 =
            now < pumpPollHoldUntil.current[0]
              ? prev[0]
              : Boolean(pumpList[0]?.status);
          const p2 =
            now < pumpPollHoldUntil.current[1]
              ? prev[1]
              : Boolean(pumpList[1]?.status);
          return [p1, p2];
        });
      }
    } catch (e) {
      setError(e?.message || "Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [areaId]);

  useEffect(() => {
    loadData();
    const id = setInterval(loadData, POLL_MS);
    return () => clearInterval(id);
  }, [loadData]);

  const soil = env?.soilMoisture ?? 0;
  const dry =
    soil < soilThreshold
      ? {
          status: "Đất khô",
          description: "Độ ẩm đất thấp hơn ngưỡng tưới.",
        }
      : {
          status: "Đủ ẩm",
          description: "Độ ẩm đất trong ngưỡng an toàn.",
        };

  const handlePumpToggle = async (index, wantOn) => {
    setToggleError(null);
    if (pumpToggleInProgress.current[index]) return;
    const pump = pumps[index];
    if (!pump?.id) {
      setToggleError("Chưa có máy bơm trong CSDL — không gửi lệnh.");
      return;
    }
    pumpToggleInProgress.current[index] = true;
    pumpPollHoldUntil.current[index] = Date.now() + 5000;
    try {
      await manualControlApi.setPumpState(pump.id, wantOn);
      const snap = await manualControlApi.getManualState(areaId);
      setPumpOn([snap.pump1, snap.pump2]);
      pumpPollHoldUntil.current[index] = 0;
    } catch (e) {
      setToggleError(e?.message || "Không đổi được trạng thái bơm");
      pumpPollHoldUntil.current[index] = 0;
    } finally {
      pumpToggleInProgress.current[index] = false;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      <PageHeader
        title="Dashboard"
        subtitle="Theo dõi dữ liệu môi trường và trạng thái hệ thống theo thời gian thực."
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {toggleError && (
        <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setToggleError(null)}>
          {toggleError}
        </Alert>
      )}

      <Grid container spacing={3} className="dashboard-grid" sx={{ width: "100%" }}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <SensorCard
            title="Nhiệt độ"
            value={formatSensorValue(env?.temperature)}
            unit="°C"
            accentColor="#16a34a"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <SensorCard
            title="Độ ẩm không khí"
            value={formatSensorValue(env?.humidityAir)}
            unit="%"
            accentColor="#2563eb"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatusCard
            title="Tình trạng"
            status={dry.status}
            description={dry.description}
            accentColor="#f59e0b"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 2.4 }}>
          <SensorCard
            title="Ánh sáng"
            value={formatSensorValue(env?.lightIntensity)}
            unit="%"
            accentColor="#c026d3"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 2.4 }}>
          <GaugeCard
            title="Độ ẩm đất"
            value={Number(env?.soilMoisture ?? 0).toFixed(1)}
            unit="%"
            accentColor="#eab308"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 5 }}>
          <HistoryChart
            title="Lịch sử ánh sáng"
            data={lightHistory.length ? lightHistory : [{ time: "—", lightIntensity: 0 }]}
            dataKey="lightIntensity"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 5 }}>
          <HistoryChart
            title="Lịch sử độ ẩm đất"
            data={soilHistory.length ? soilHistory : [{ time: "—", soilMoisture: 0 }]}
            dataKey="soilMoisture"
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 2 }}>
          <Box className="dashboard-pump-column">
            <PumpSwitch
              title="Máy bơm 1"
              checked={pumpOn[0]}
              subtitle={pumpOn[0] ? "Đang bật" : "Đang tắt"}
              onChange={(_e, checked) => handlePumpToggle(0, checked)}
            />

            <PumpSwitch
              title="Máy bơm 2"
              checked={pumpOn[1]}
              subtitle={pumpOn[1] ? "Đang bật" : "Đang tắt"}
              onChange={(_e, checked) => handlePumpToggle(1, checked)}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
