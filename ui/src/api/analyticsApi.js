import http from "./http";

export const analyticsApi = {
  async getAnalyticsSummary() {
    const response = await http.get("/analytics/summary");
    return response.data;
  },

  async getGdd(params = {}) {
    const response = await http.get("/analytics/gdd", { params });
    return response.data;
  },

  async exportSensorData(params = {}) {
    const response = await http.get("/analytics/export", { params });
    return response.data;
  },

  async getTrendData(params = {}) {
    const response = await http.get("/analytics/trends", { params });
    return response.data;
  },

  async getHistoryChartData(params = {}) {
    const response = await http.get("/analytics/history", { params });

    const data = Array.isArray(response.data) ? response.data : [];

    return data.map((item) => ({
      time:
        item.time ??
        item.timestamp ??
        item.date ??
        item.createdAt ??
        new Date().toISOString(),
      temperature: item.temperature ?? item.temp ?? 0,
      humidityAir: item.humidityAir ?? item.air_humidity ?? 0,
      soilMoisture: item.soilMoisture ?? item.soil_moisture ?? 0,
      lightIntensity: item.lightIntensity ?? item.light ?? 0,
    }));
  },
};

export default analyticsApi;