import http from "./http";

const normalizeSchedule = (raw = {}) => {
  return {
    id: raw.id ?? raw._id ?? raw.schedule_id ?? "",
    pumpId: raw.pumpId ?? raw.pump_id ?? "",
    startTime: raw.startTime ?? raw.start_time ?? "00:00",
    durationMinutes:
      raw.durationMinutes ?? raw.duration_minutes ?? raw.duration ?? 0,
    activeDays: raw.activeDays ?? raw.active_days ?? [],
    enabled: raw.enabled ?? true,
    ...raw,
  };
};

export const scheduleApi = {
  async getSchedules() {
    const response = await http.get("/schedules");
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(normalizeSchedule);
  },

  async getScheduleById(scheduleId) {
    const response = await http.get(`/schedules/${scheduleId}`);
    return normalizeSchedule(response.data);
  },

  async createSchedule(payload) {
    const response = await http.post("/schedules", payload);
    return response.data;
  },

  async updateSchedule(scheduleId, payload) {
    const response = await http.put(`/schedules/${scheduleId}`, payload);
    return response.data;
  },

  async deleteSchedule(scheduleId) {
    const response = await http.delete(`/schedules/${scheduleId}`);
    return response.data;
  },
};

export default scheduleApi;