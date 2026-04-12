import http from "./http";
import { getDefaultAreaId } from "../config/env";

export const manualControlApi = {
  /** Toggle pump on/off (backend flips current state). Body: pump_id */
  async togglePump(pumpId) {
    const response = await http.put("/water/pumps", { pump_id: pumpId });
    return response.data;
  },

  async setPumpState(pumpId, status) {
    const response = await http.put("/water/pumps/auto", {
      pump_id: pumpId,
      action: "one",
      status: status ? "on" : "off",
    });
    return response.data;
  },

  async getManualState(areaId = getDefaultAreaId()) {
    const response = await http.get(`/iot/snapshot/${areaId}`);
    const d = response.data || {};
    return {
      pump1: String(d.pump1) === "1",
      pump2: String(d.pump2) === "1",
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
