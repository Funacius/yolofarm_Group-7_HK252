import http from "./http";

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

export const environmentApi = {
  async getCurrentEnvironment() {
    const response = await http.get("/environment/current");
    return normalizeEnvironmentData(response.data);
  },

  async getEnvironmentHistory(params = {}) {
    const response = await http.get("/environment/history", { params });

    const data = Array.isArray(response.data) ? response.data : [];

    return data.map((item) => ({
      time:
        item.time ??
        item.timestamp ??
        item.date ??
        item.createdAt ??
        new Date().toISOString(),
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
    const response = await http.get("/areas");
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(normalizeArea);
  },

  async getEnvironmentByArea(areaId) {
    const response = await http.get(`/environment/area/${areaId}`);
    return normalizeEnvironmentData(response.data);
  },
};

export default environmentApi;