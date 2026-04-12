import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    localStorage.setItem("username", "iwiua");
    navigate("/dashboard");
  };

  return (
    <Box className="login-page">
      <Paper className="login-card" elevation={3}>
        <Box className="login-brand">
          <img src="/logo.png" alt="logo" className="login-logo" />
          <Box>
            <Typography className="login-title">YoloFarm</Typography>
            <Typography className="login-subtitle">
              Smart Farm Dashboard
            </Typography>
          </Box>
        </Box>

        <Typography className="login-heading">Đăng nhập</Typography>
        <Typography className="login-description">
          Đăng nhập để truy cập hệ thống giám sát và điều khiển nông trại.
        </Typography>

        <form onSubmit={handleLogin} className="login-form">
          <TextField
            fullWidth
            label="Username hoặc Email"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Mật khẩu"
            type="password"
            variant="outlined"
          />

          <Button type="submit" variant="contained" className="login-button">
            Đăng nhập
          </Button>
        </form>
      </Paper>
    </Box>
  );
}