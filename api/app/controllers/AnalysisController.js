const { Log } = require("../models/models");

const home = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 500, 2000);
    const area_id = req.query.area_id;
    const q = area_id ? { area_id: Number(area_id) } : {};
    const data = await Log.find(q).sort({ date: -1 }).limit(limit).lean();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: String(error.message) });
  }
};

/** FR6 — CSV export for Excel */
const exportCsv = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 5000, 20000);
    const area_id = req.query.area_id;
    const q = area_id ? { area_id: Number(area_id) } : {};
    const rows = await Log.find(q).sort({ date: 1 }).limit(limit).lean();
    const headers = [
      "date",
      "area_id",
      "temperature",
      "air_humidity",
      "soil_moisture",
      "light",
      "gdd",
    ];
    const lines = [headers.join(",")];
    for (const r of rows) {
      lines.push(
        [
          r.date ? new Date(r.date).toISOString() : "",
          r.area_id ?? "",
          r.temperature ?? "",
          r.air_humidity ?? "",
          r.soil_moisture ?? "",
          r.light ?? "",
          r.gdd ?? "",
        ].join(",")
      );
    }
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="yolofarm-logs.csv"'
    );
    res.send(lines.join("\n"));
  } catch (error) {
    res.status(500).json({ error: String(error.message) });
  }
};

module.exports = {
  home,
  exportCsv,
};
