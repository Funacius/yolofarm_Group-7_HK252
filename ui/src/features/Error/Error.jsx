import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Error() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          p: 4,
          maxWidth: 520,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 2px 10px rgba(15, 23, 42, 0.06)",
        }}
      >
        <Typography
          sx={{
            fontSize: "32px",
            fontWeight: 800,
            color: "#111827",
            mb: 1,
          }}
        >
          Có lỗi xảy ra
        </Typography>

        <Typography
          sx={{
            fontSize: "16px",
            color: "#6b7280",
            mb: 3,
          }}
        >
          Trang bạn đang truy cập hiện không khả dụng hoặc đã có lỗi trong quá
          trình tải dữ liệu.
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/dashboard")}
          sx={{
            textTransform: "none",
            borderRadius: "12px",
            px: 3,
            py: 1.2,
            fontWeight: 700,
            backgroundColor: "#0e8bb3",
          }}
        >
          Quay về Dashboard
        </Button>
      </Box>
    </Box>
  );
}