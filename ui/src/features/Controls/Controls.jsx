import { Box, Button, Grid, Slider, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import PumpSwitch from "../../components/common/PumpSwitch";
import "./Controls.css";

export default function Controls() {
  const [mode, setMode] = useState("auto");
  const [threshold, setThreshold] = useState(40);
  const [pump1, setPump1] = useState(false);
  const [pump2, setPump2] = useState(false);

  const handleModeChange = (_, newMode) => {
    if (newMode) {
      setMode(newMode);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Controls"
        subtitle="Điều khiển bơm và cấu hình ngưỡng độ ẩm đất."
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
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
              Chế độ hiện tại: <strong>{mode}</strong>
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box className="controls-card">
            <Typography className="controls-card-title">
              Ngưỡng độ ẩm đất
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

              <Button variant="contained" className="controls-save-btn">
                Lưu ngưỡng
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <PumpSwitch
            title="Máy bơm 1"
            checked={pump1}
            subtitle={pump1 ? "Đang bật" : "Đang tắt"}
            onChange={() => setPump1((prev) => !prev)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <PumpSwitch
            title="Máy bơm 2"
            checked={pump2}
            subtitle={pump2 ? "Đang bật" : "Đang tắt"}
            onChange={() => setPump2((prev) => !prev)}
          />
        </Grid>
      </Grid>
    </Box>
  );
}