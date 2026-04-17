import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

const http = axios.create({
  baseURL: API_BASE_URL,
  /** Mongo/API chậm lúc khởi động — tránh báo “hết thời gian chờ” quá sớm */
  timeout: 30000,
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
          `Hết thời gian chờ API (${API_BASE_URL}). Kiểm tra: (1) MongoDB đang chạy, (2) trong thư mục api đã npm start và PORT trong api/.env khớp URL này, (3) tạo ui/.env với VITE_API_BASE_URL nếu API dùng cổng khác — rồi khởi động lại Vite.`
        )
      );
    }

    if (!res) {
      return Promise.reject(
        new Error(
          `Không kết nối được API (${API_BASE_URL}). Chạy backend: cd api rồi npm start. Cổng mặc định 3001 — nếu đổi PORT trong api/.env thì đặt VITE_API_BASE_URL=http://localhost:<PORT>/api trong ui/.env và chạy lại npm run dev. Chi tiết: ${error?.message || "network error"}`
        )
      );
    }

    return Promise.reject(
      new Error(error?.message || `Lỗi HTTP ${res.status}`)
    );
  }
);

export default http;