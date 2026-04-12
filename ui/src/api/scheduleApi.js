import http from "./http";
import { getDefaultAreaId } from "../config/env";

const normalizeSchedule = (raw = {}) => {
  const windows = raw.windows || [];
  const first = windows[0];
  return {
    id: raw.id ?? raw._id ?? raw.schedule_id ?? "",
    pumpId: raw.pumpId ?? raw.pumpKey ?? raw.pump_id ?? "",
    pumpKey: raw.pumpKey,
    startTime: raw.startTime ?? raw.start_time ?? "00:00",
    durationMinutes:
      raw.durationMinutes ??
      raw.duration_minutes ??
      (first
        ? Math.max(0, (first.endMinute ?? 0) - (first.startMinute ?? 0))
        : 0),
    activeDays: raw.activeDays ?? raw.active_days ?? [],
    enabled: raw.enabled ?? true,
    windows,
    area_id: raw.area_id,
    ...raw,
  };
};

export const scheduleApi = {
  async getSchedules(params = {}) {
    const area_id = params.area_id ?? getDefaultAreaId();
    const response = await http.get("/water/schedule", {
      params: { area_id },
    });
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(normalizeSchedule);
  },

  async getScheduleById(scheduleId) {
    const response = await http.get(`/water/schedule/${scheduleId}`);
    return normalizeSchedule(response.data);
  },

  async createSchedule(payload) {
    const response = await http.post("/water/schedule", payload);
    return response.data;
  },

  async updateSchedule(scheduleId, payload) {
    const response = await http.put(`/water/schedule/${scheduleId}`, payload);
    return response.data;
  },

  async deleteSchedule(scheduleId) {
    const response = await http.delete(`/water/schedule/${scheduleId}`);
    return response.data;
  },
};

export default scheduleApi;
