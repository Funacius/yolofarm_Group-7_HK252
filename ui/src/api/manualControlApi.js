import http from "./http";

export const manualControlApi = {
  async togglePump(pumpId) {
    const response = await http.put("/manual/pump/toggle", { pumpId });
    return response.data;
  },

  async setPumpState(pumpId, status) {
    const response = await http.put("/manual/pump/state", {
      pumpId,
      status,
    });
    return response.data;
  },

  async getManualState() {
    const response = await http.get("/manual/state");
    return response.data;
  },

  async turnPumpOn(pumpId) {
    const response = await http.put("/manual/pump/state", {
      pumpId,
      status: true,
    });
    return response.data;
  },

  async turnPumpOff(pumpId) {
    const response = await http.put("/manual/pump/state", {
      pumpId,
      status: false,
    });
    return response.data;
  },
};

export default manualControlApi;