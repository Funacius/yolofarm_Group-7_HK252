import { Box, Button, Slider, Typography } from "@mui/material";

export default function MoistureThreshold({
  threshold,
  onChangeThreshold,
  onSave,
}) {
  return (
    <Box className="controls-card">
      <Typography className="controls-card-title">Ngưỡng độ ẩm đất</Typography>

      <Box className="controls-slider-wrap">
        <Slider
          value={threshold}
          onChange={(_, value) => onChangeThreshold(value)}
          min={0}
          max={100}
        />
      </Box>

      <Box className="controls-threshold-footer">
        <Typography className="controls-threshold-text">
          {threshold}%
        </Typography>

        <Button variant="contained" className="controls-save-btn" onClick={onSave}>
          Lưu ngưỡng
        </Button>
      </Box>
    </Box>
  );
}