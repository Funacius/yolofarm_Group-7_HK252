import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import PumpSwitch from "../../components/common/PumpSwitch";
import irrigationApi from "../../api/irrigationApi";
import manualControlApi from "../../api/manualControlApi";
import { getDefaultAreaId } from "../../config/env";
import "./Controls.css";

export default function Controls() {
  const areaId = getDefaultAreaId();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveMsg, setSaveMsg] = useState(null);

  const [mode, setMode] = useState("auto");
  const [threshold, setThreshold] = useState(40);
  const [pumps, setPumps] = useState([]);
  const [pump1, setPump1] = useState(false);
  const [pump2, setPump2] = useState(false);

  const loadData = useCallback(async () => {
    setError(null);
    try {
      const [pumpList, cfg, snap] = await Promise.all([
        irrigationApi.getPumps().catch(() => []),
        irrigationApi.getThresholds(areaId),
        manualControlApi.getManualState(areaId).catch(() => null),
      ]);

      setPumps(pumpList);
      if (cfg?.soilMoistureOnBelow != null) {
        setThreshold(Number(cfg.soilMoistureOnBelow));
      }

      const anyAuto = pumpList.some(
        (p) => p.autoBySensor || p.autoBySchedule
      );
      setMode(anyAuto ? "auto" : "manual");

      if (snap) {
        setPump1(snap.pump1);
        setPump2(snap.pump2);
      } else if (pumpList[0] || pumpList[1]) {
        setPump1(Boolean(pumpList[0]?.status));
        setPump2(Boolean(pumpList[1]?.status));
      }
    } catch (e) {
      setError(e?.message || "Không tải được cấu hình");
    } finally {
      setLoading(false);
    }
  }, [areaId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleModeChange = async (_, newMode) => {
    if (!newMode) return;
    setMode(newMode);
    setSaveMsg(null);
    const on = newMode === "auto";
    try {
      for (const p of pumps) {
        if (p?.id) {
          await irrigationApi.updateAutoBySensor({
            pump_id: p.id,
            status: on,
          });
        }
      }
      await loadData();
    } catch (e) {
      setError(e?.message || "Không cập nhật được chế độ");
    }
  };

  const handleSaveThreshold = async () => {
    setSaveMsg(null);
    setError(null);
    try {
      await irrigationApi.updateThresholds(areaId, {
        soilMoistureOnBelow: threshold,
      });
      setSaveMsg("Đã lưu ngưỡng.");
    } catch (e) {
      setError(e?.message || "Không lưu được ngưỡng");
    }
  };

  const handlePumpToggle = async (index) => {
    setError(null);
    const pump = pumps[index];
    if (!pump?.id) {
      setError("Chưa có máy bơm trong CSDL.");
      return;
    }
    try {
      await manualControlApi.togglePump(pump.id);
      const snap = await manualControlApi.getManualState(areaId);
      setPump1(snap.pump1);
      setPump2(snap.pump2);
    } catch (e) {
      setError(e?.message || "Không đổi được trạng thái bơm");
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
        title="Controls"
        subtitle="Điều khiển bơm và cấu hình ngưỡng độ ẩm đất."
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {saveMsg && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSaveMsg(null)}>
          {saveMsg}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ width: "100%" }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box className="controls-card">
            <Typography className="controls-card-title">
              Chế độ vận hành
            </Typography>

            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={handleModeChange}
              className="controls-toggle-group"
            >
              <ToggleButton value="auto" className="controls-toggle-btn">
                Auto
              </ToggleButton>
              <ToggleButton value="manual" className="controls-toggle-btn">
                Manual
              </ToggleButton>
            </ToggleButtonGroup>

            <Typography className="controls-description">
              Chế độ hiện tại: <strong>{mode}</strong> (áp dụng tự động theo cảm biến cho
              các bơm đã cấu hình)
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box className="controls-card">
            <Typography className="controls-card-title">
              Ngưỡng độ ẩm đất (bật tưới khi thấp hơn)
            </Typography>

            <Box className="controls-slider-wrap">
              <Slider
                value={threshold}
                onChange={(_, value) => setThreshold(value)}
                min={0}
                max={100}
              />
            </Box>

            <Box className="controls-threshold-footer">
              <Typography className="controls-threshold-text">
                {threshold}%
              </Typography>

              <Button
                variant="contained"
                className="controls-save-btn"
                onClick={handleSaveThreshold}
              >
                Lưu ngưỡng
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <PumpSwitch
            title="Máy bơm 1"
            checked={pump1}
            subtitle={pump1 ? "Đang bật" : "Đang tắt"}
            onChange={() => handlePumpToggle(0)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <PumpSwitch
            title="Máy bơm 2"
            checked={pump2}
            subtitle={pump2 ? "Đang bật" : "Đang tắt"}
            onChange={() => handlePumpToggle(1)}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
