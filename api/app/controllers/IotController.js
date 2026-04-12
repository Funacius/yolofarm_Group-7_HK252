const {
  FarmSnapshot,
  Log,
} = require("../models/models");
const channelMap = require("../config/channel-map");

const NUMERIC_FIELDS = new Set([
  "temperature",
  "air_humidity",
  "soil_moisture",
  "light",
  "gdd",
]);

function coerceValue(field, raw) {
  const s = raw == null ? "" : String(raw).trim();
  if (NUMERIC_FIELDS.has(field)) {
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : undefined;
  }
  return s;
}

const HISTORY_INTERVAL_MS = parseInt(
  process.env.IOT_HISTORY_INTERVAL_MS || "60000",
  10
);

/**
 * POST /api/iot/ingest
 * Body: { area_id, feedSuffix?: string, field?: string, value: string|number }
 */
async function ingest(req, res) {
  try {
    const area_id = Number(req.body.area_id);
    if (!Number.isFinite(area_id)) {
      return res.status(400).json({ error: "area_id required" });
    }

    let field = req.body.field;
    if (!field && req.body.feedSuffix) {
      field = channelMap.suffixToField[String(req.body.feedSuffix).toUpperCase()];
    }
    if (!field) {
      return res.status(400).json({ error: "field or feedSuffix required" });
    }

    const coerced = coerceValue(field, req.body.value);
    if (coerced === undefined && NUMERIC_FIELDS.has(field)) {
      return res.status(400).json({ error: "invalid numeric value" });
    }

    const update = {
      [field]: coerced,
      updatedAt: new Date(),
    };

    await FarmSnapshot.findOneAndUpdate(
      { area_id },
      { $set: update },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const snap = await FarmSnapshot.findOne({ area_id }).lean();
    if (snap && NUMERIC_FIELDS.has(field)) {
      const now = new Date();
      const last = snap.lastHistoryAt ? new Date(snap.lastHistoryAt).getTime() : 0;
      if (now.getTime() - last >= HISTORY_INTERVAL_MS) {
        await Log.create({
          area_id,
          temperature: snap.temperature,
          air_humidity: snap.air_humidity,
          soil_moisture: snap.soil_moisture,
          light: snap.light,
          gdd: snap.gdd,
          date: now,
          time: now.toISOString(),
        });
        await FarmSnapshot.updateOne(
          { area_id },
          { $set: { lastHistoryAt: now } }
        );
      }
    }

    return res.status(204).send();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: String(e.message) });
  }
}

/** GET /api/iot/snapshot/:areaId — latest telemetry for web UI */
async function getSnapshot(req, res) {
  try {
    const area_id = Number(req.params.areaId);
    const snap =
      (await FarmSnapshot.findOne({ area_id }).lean()) ||
      ({
        area_id,
        temperature: null,
        air_humidity: null,
        soil_moisture: null,
        light: null,
        gdd: null,
        pump1: "0",
        pump2: "0",
        rc_servo: "0",
        buzzer: "0",
        led1: "0",
        led2: "0",
        lcd: "",
        updatedAt: null,
      } );
    return res.json(snap);
  } catch (e) {
    return res.status(500).json({ error: String(e.message) });
  }
}

/** GET /api/iot/history?area_id=1&limit=200 */
async function getHistory(req, res) {
  try {
    const area_id = Number(req.query.area_id);
    const limit = Math.min(Number(req.query.limit) || 200, 2000);
    const q = Number.isFinite(area_id) ? { area_id } : {};
    const rows = await Log.find(q)
      .sort({ date: -1 })
      .limit(limit)
      .lean();
    return res.json(rows);
  } catch (e) {
    return res.status(500).json({ error: String(e.message) });
  }
}

/** GET /api/iot/channel-map */
function getChannelMap(req, res) {
  return res.json({
    suffixToField: channelMap.suffixToField,
    topicPrefix: require("../config/ohstem.config").topicPrefix,
  });
}

module.exports = {
  ingest,
  getSnapshot,
  getHistory,
  getChannelMap,
};
