import http from "./http";

const normalizePump = (raw = {}) => {
  return {
    id: raw.id ?? raw._id ?? raw.pump_id ?? "",
    name: raw.name ?? raw.pump_name ?? "Pump",
    status: raw.status ?? raw.is_on ?? raw.pumpStatus ?? false,
    autoBySensor:
      raw.autoBySensor ??
      raw.is_applied_sensor ??
      raw.auto_sensor ??
      false,
    autoBySchedule:
      raw.autoBySchedule ??
      raw.is_applied_timer ??
      raw.auto_schedule ??
      false,
    areaId: raw.areaId ?? raw.area_id ?? "",
    ...raw,
  };
};

export const irrigationApi = {
  async getPumps() {
    const response = await http.get("/irrigation/pumps");
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(normalizePump);
  },

  async getPumpById(pumpId) {
    const response = await http.get(`/irrigation/pumps/${pumpId}`);
    return normalizePump(response.data);
  },

  async getPumpsByArea(areaId) {
    const response = await http.get(`/irrigation/pumps/area/${areaId}`);
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(normalizePump);
  },

  async updateAutoBySensor(payload) {
    const response = await http.put("/irrigation/auto-sensor", payload);
    return response.data;
  },

  async updateAutoBySchedule(payload) {
    const response = await http.put("/irrigation/auto-schedule", payload);
    return response.data;
  },

  async getAutoSettings() {
    const response = await http.get("/irrigation/settings");
    return response.data;
  },

  async updateAutoSettings(payload) {
    const response = await http.put("/irrigation/settings", payload);
    return response.data;
  },

  async getThresholds() {
    const response = await http.get("/irrigation/thresholds");
    return response.data;
  },

  async updateThresholds(payload) {
    const response = await http.put("/irrigation/thresholds", payload);
    return response.data;
  },
};

export default irrigationApi;