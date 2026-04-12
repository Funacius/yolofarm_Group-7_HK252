import http from "./http";
import { getDefaultAreaId } from "../config/env";

const normalizeEnvironmentData = (raw = {}) => {
  return {
    temperature:
      raw.temperature ?? raw.temp ?? raw.data_nhietdo ?? raw.nhietdo ?? 0,

    humidityAir:
      raw.humidityAir ??
      raw.air_humidity ??
      raw.humidity ??
      raw.data_doamkk ??
      raw.doamkk ??
      0,

    soilMoisture:
      raw.soilMoisture ??
      raw.soil_moisture ??
      raw.data_doamdat ??
      raw.doamdat ??
      0,

    lightIntensity:
      raw.lightIntensity ??
      raw.light ??
      raw.data_anhsang ??
      raw.anhsang ??
      0,

    updatedAt:
      raw.updatedAt ??
      raw.updated_at ??
      raw.timestamp ??
      raw.date ??
      new Date().toISOString(),
  };
};

const normalizeArea = (raw = {}) => {
  return {
    id: raw.id ?? raw._id ?? raw.area_id ?? "",
    name: raw.name ?? raw.area_name ?? "Unknown Area",
    ...raw,
  };
};

const formatChartTime = (item) => {
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
};

export const environmentApi = {
  async getCurrentEnvironment(areaId = getDefaultAreaId()) {
    const response = await http.get(`/iot/snapshot/${areaId}`);
    return normalizeEnvironmentData(response.data);
  },

  async getEnvironmentHistory(params = {}) {
    const area_id = params.area_id ?? getDefaultAreaId();
    const limit = params.limit ?? 200;
    const response = await http.get("/iot/history", {
      params: { area_id, limit },
    });

    const data = Array.isArray(response.data) ? response.data : [];

    const sorted = [...data].sort((a, b) => {
      const da = new Date(a.date || 0).getTime();
      const db = new Date(b.date || 0).getTime();
      return da - db;
    });

    return sorted.map((item) => ({
      time: formatChartTime(item),
      temperature:
        item.temperature ?? item.temp ?? item.data_nhietdo ?? item.nhietdo ?? 0,
      humidityAir:
        item.humidityAir ??
        item.air_humidity ??
        item.humidity ??
        item.data_doamkk ??
        item.doamkk ??
        0,
      soilMoisture:
        item.soilMoisture ??
        item.soil_moisture ??
        item.data_doamdat ??
        item.doamdat ??
        0,
      lightIntensity:
        item.lightIntensity ??
        item.light ??
        item.data_anhsang ??
        item.anhsang ??
        0,
    }));
  },

  async getAreas() {
    const response = await http.get("/water");
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(normalizeArea);
  },

  async getEnvironmentByArea(areaId) {
    return this.getCurrentEnvironment(areaId);
  },
};

export default environmentApi;
