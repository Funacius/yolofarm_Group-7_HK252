import { Box, Typography } from "@mui/material";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function HistoryChart({
  title,
  data = [],
  dataKey,
  xKey = "time",
}) {
  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        p: 3,
        boxShadow: "0 2px 10px rgba(15, 23, 42, 0.06)",
        minHeight: 340,
      }}
    >
      <Typography
        sx={{
          fontSize: "18px",
          fontWeight: 700,
          color: "#111827",
          mb: 2,
        }}
      >
        {title}
      </Typography>

      <Box sx={{ width: "100%", height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}