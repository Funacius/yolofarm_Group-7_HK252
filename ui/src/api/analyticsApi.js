import http from "./http";
import { getDefaultAreaId } from "../config/env";

function formatChartTime(item) {
  const d =
    item.date ??
    item.time ??
    item.createdAt ??
    item.timestamp ??
    new Date().toISOString();
  try {
    const dt = d instanceof Date ? d : new Date(d);
    return dt.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(d);
  }
}

const mapLogRow = (item) => ({
  time: formatChartTime(item),
  date: item.date ?? null,
  temperature: item.temperature ?? item.temp ?? 0,
  humidityAir: item.humidityAir ?? item.air_humidity ?? 0,
  soilMoisture: item.soilMoisture ?? item.soil_moisture ?? 0,
  lightIntensity: item.lightIntensity ?? item.light ?? 0,
  gdd: item.gdd,
});

export const analyticsApi = {
  async getAnalyticsSummary(params = {}) {
    const area_id = params.area_id ?? getDefaultAreaId();
    const response = await http.get("/analysis/home", {
      params: { area_id, limit: 500 },
    });
    const rows = Array.isArray(response.data) ? response.data : [];
    const last = rows[0];
    return {
      pointCount: rows.length,
      lastTemperature: last?.temperature ?? null,
      lastSoilMoisture: last?.soil_moisture ?? null,
      lastUpdated: last?.date ?? null,
    };
  },

  async getGdd(params = {}) {
    const areaId = params.area_id ?? getDefaultAreaId();
    const response = await http.get(`/iot/snapshot/${areaId}`);
    return { gdd: response.data?.gdd ?? 0 };
  },

  async exportSensorData(params = {}) {
    const response = await http.get("/analysis/export/csv", {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  async getTrendData(params = {}) {
    return this.getHistoryChartData({ ...params, limit: params.limit ?? 100 });
  },

  async getHistoryChartData(params = {}) {
    const area_id = params.area_id ?? getDefaultAreaId();
    const limit = Math.min(Number(params.limit) || 500, 2000);
    const response = await http.get("/analysis/home", {
      params: { area_id, limit },
    });

    const data = Array.isArray(response.data) ? response.data : [];

    const sorted = [...data].sort((a, b) => {
      const da = new Date(a.date || 0).getTime();
      const db = new Date(b.date || 0).getTime();
      return da - db;
    });
    return sorted.map((item) => mapLogRow(item));
  },
};

export default analyticsApi;
