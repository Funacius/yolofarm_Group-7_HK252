import { Box, MenuItem, TextField } from "@mui/material";

export default function HistoryFilters() {
  return (
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
  );
}