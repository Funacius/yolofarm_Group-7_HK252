import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const res = error?.response;
    if (res?.data) {
      const d = res.data;
      const nested =
        d?.error && typeof d.error === "object" ? d.error.message : null;
      const flat =
        d?.message ||
        (typeof d?.error === "string" ? d.error : null) ||
        nested;
      if (flat) {
        return Promise.reject(new Error(flat));
      }
    }

    if (error?.code === "ECONNABORTED") {
      return Promise.reject(
        new Error(
          `Hết thời gian chờ API (${API_BASE_URL}). Thử lại hoặc kiểm tra backend.`
        )
      );
    }

    if (!res) {
      return Promise.reject(
        new Error(
          `Không kết nối được API (${API_BASE_URL}). Chạy backend: trong thư mục api gõ npm start (cổng 3001). Chi tiết: ${error?.message || "network error"}`
        )
      );
    }

    return Promise.reject(
      new Error(error?.message || `Lỗi HTTP ${res.status}`)
    );
  }
);

export default http;