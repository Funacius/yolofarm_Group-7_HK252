import * as React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TuneIcon from "@mui/icons-material/Tune";
import HistoryIcon from "@mui/icons-material/History";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLocation, useNavigate } from "react-router-dom";

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem("username") || "iwiua";

  const navItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon sx={{ fontSize: 18 }} />,
      to: "/dashboard",
    },
    {
      text: "Controls",
      icon: <TuneIcon sx={{ fontSize: 18 }} />,
      to: "/controls",
    },
    {
      text: "History",
      icon: <HistoryIcon sx={{ fontSize: 18 }} />,
      to: "/history",
    },
    {
      text: "About",
      icon: <InfoOutlinedIcon sx={{ fontSize: 18 }} />,
      to: "/about",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#0e8bb3",
        borderBottom: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "60px !important",
          px: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            minWidth: "fit-content",
            gap: 1.5,
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="logo"
            sx={{
              width: 34,
              height: 34,
              objectFit: "contain",
            }}
          />

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>
              YoloFarm
            </Typography>
            <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.9)", lineHeight: 1.1 }}>
              Smart Farm Dashboard
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            overflowX: "auto",
            whiteSpace: "nowrap",
            flexGrow: 1,
            justifyContent: "center",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {navItems.map((item) => {
            const active = location.pathname === item.to;

            return (
              <Button
                key={item.text}
                onClick={() => navigate(item.to)}
                startIcon={item.icon}
                sx={{
                  color: "#fff",
                  textTransform: "none",
                  fontSize: "15px",
                  fontWeight: 600,
                  px: 2,
                  py: 1.5,
                  minWidth: "auto",
                  borderRadius: 0,
                  backgroundColor: active
                    ? "rgba(255,255,255,0.14)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.12)",
                  },
                }}
              >
                {item.text}
              </Button>
            );
          })}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            minWidth: "fit-content",
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 500,
              color: "#fff",
              display: { xs: "none", md: "block" },
            }}
          >
            {username}
          </Typography>

          <Button
            variant="contained"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              backgroundColor: "#ffffff",
              color: "#1e3a8a",
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "12px",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#f3f4f6",
                boxShadow: "none",
              },
            }}
          >
            Log out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}