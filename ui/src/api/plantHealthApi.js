import http from "./http";
import { getDefaultAreaId } from "../config/env";

const DEFAULT_LIMIT = 200;

export const plantHealthApi = {
  async getInferences(params = {}) {
    const area_id = params.area_id ?? getDefaultAreaId();
    const limit = Math.min(Number(params.limit) || DEFAULT_LIMIT, 500);

    const response = await http.get("/ai/inferences", {
      params: { area_id, limit },
    });

    const rows = Array.isArray(response.data) ? response.data : [];

    return rows.filter((item) => {
      const sameArea =
        item?.area_id == null || Number(item.area_id) === Number(area_id);
      return sameArea && item?.kind === "plant_health";
    });
  },
};

export default plantHealthApi;
