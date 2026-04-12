import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";

export default function ModeToggle({ mode, onChange }) {
  return (
    <Box className="controls-card">
      <Typography className="controls-card-title">Chế độ vận hành</Typography>

      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={onChange}
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
  );
}