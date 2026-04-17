import http from "./http";
import { getDefaultAreaId } from "../config/env";

/** Khớp snapshot: ON / 1 / TRUE */
export function isPumpOn(raw) {
  const s = String(raw ?? "")
    .trim()
    .toUpperCase();
  return s === "ON" || s === "1" || s === "TRUE";
}

export const manualControlApi = {
  /** Toggle pump on/off (backend flips current state). Body: pump_id */
  async togglePump(pumpId) {
    const response = await http.put("/water/pumps", { pump_id: pumpId });
    return response.data;
  },

  /** Bật/tắt tuyệt đối — gửi MQTT (V10/V11) + FarmSnapshot qua API */
  async setPumpState(pumpId, status) {
    const response = await http.put("/water/pumps/auto", {
      pump_id: String(pumpId),
      action: "one",
      status: status ? "on" : "off",
    });
    return response.data;
  },

  async getManualState(areaId = getDefaultAreaId()) {
    const response = await http.get(`/iot/snapshot/${areaId}`);
    const d = response.data || {};
    return {
      pump1: isPumpOn(d.pump1),
      pump2: isPumpOn(d.pump2),
      raw: d,
    };
  },

  async turnPumpOn(pumpId) {
    return this.setPumpState(pumpId, true);
  },

  async turnPumpOff(pumpId) {
    return this.setPumpState(pumpId, false);
  },
};

export default manualControlApi;
