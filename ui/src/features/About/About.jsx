import { Box, Grid, Typography } from "@mui/material";
import PageHeader from "../../components/common/PageHeader";
import "./About.css";

export default function About() {
  return (
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      <PageHeader
        title="About"
        subtitle="Giới thiệu tổng quan về hệ thống YoloFarm."
      />

      <Grid container spacing={3} sx={{ width: "100%" }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box className="about-card">
            <Typography className="about-card-title">
              YoloFarm là gì?
            </Typography>
            <Typography className="about-card-text">
              YoloFarm là hệ thống AIoT hỗ trợ giám sát môi trường nông trại và
              điều khiển tưới tiêu thông minh. Hệ thống tập trung vào việc theo
              dõi nhiệt độ, độ ẩm không khí, độ ẩm đất, ánh sáng và trạng thái
              máy bơm theo thời gian thực.
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box className="about-card">
            <Typography className="about-card-title">
              Chức năng chính
            </Typography>
            <Typography className="about-card-text">
              • Giám sát dữ liệu môi trường  
              • Điều khiển bơm thủ công  
              • Tưới tự động theo ngưỡng  
              • Tưới theo lịch  
              • Lưu lịch sử và phân tích dữ liệu
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box className="about-card">
            <Typography className="about-card-title">
              Thành phần hệ thống
            </Typography>
            <Typography className="about-card-text">
              Hệ thống bao gồm Yolo:Bit, cảm biến DHT20, cảm biến độ ẩm đất,
              cảm biến ánh sáng, LCD hiển thị, mạch điều khiển 2 USB, máy bơm,
              dashboard web và các mô-đun giao tiếp IoT.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}