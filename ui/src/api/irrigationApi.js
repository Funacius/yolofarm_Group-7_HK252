import http from "./http";
import { getDefaultAreaId } from "../config/env";

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
    const response = await http.get("/water/pumps");
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(normalizePump);
  },

  async getPumpById(pumpId) {
    const response = await http.get(`/water/pump/${pumpId}`);
    return normalizePump(response.data);
  },

  async getPumpsByArea(areaId) {
    const response = await http.get(`/water/pumps/${areaId}`);
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(normalizePump);
  },

  async updateAutoBySensor(payload) {
    const { pump_id, status = true } = payload;
    const response = await http.put("/water/pumps/setting", {
      pump_id,
      mode: "sensor",
      status,
    });
    return response.data;
  },

  async updateAutoBySchedule(payload) {
    const { pump_id, status = true } = payload;
    const response = await http.put("/water/pumps/setting", {
      pump_id,
      mode: "timer",
      status,
    });
    return response.data;
  },

  async getAutoSettings() {
    const pumps = await this.getPumps();
    return { pumps };
  },

  async updateAutoSettings() {
    return { ok: true };
  },

  async getThresholds(areaId = getDefaultAreaId()) {
    const response = await http.get(
      `/water/schedule/irrigation-config/${areaId}`
    );
    return response.data;
  },

  async updateThresholds(areaId, payload) {
    const id = areaId ?? getDefaultAreaId();
    const response = await http.put(
      `/water/schedule/irrigation-config/${id}`,
      payload
    );
    return response.data;
  },
};

export default irrigationApi;
