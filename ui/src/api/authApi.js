import http from "./http";

export const authApi = {
  async login(payload) {
    const response = await http.post("/auth/login", payload);

    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }

    if (response.data?.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  },

  async logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return true;
  },

  async getCurrentUser() {
    const response = await http.get("/auth/me");
    return response.data;
  },
};

export default authApi;