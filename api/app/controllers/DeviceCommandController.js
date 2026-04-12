const axios = require("axios");
const ohstem = require("../config/ohstem.config");
const channelMap = require("../config/channel-map");
const { FarmSnapshot } = require("../models/models");

/**
 * POST /api/device/publish
 * Body: { field: 'pump1' | 'temperature' feed logical key, value: string|number, area_id?: number }
 */
async function publish(req, res) {
  try {
    const field = req.body.field;
    const value = req.body.value;
    if (!field || value === undefined || value === null) {
      return res.status(400).json({ error: "field and value required" });
    }

    const suffix = channelMap.fieldToSuffix(field);
    if (!suffix) {
      return res.status(400).json({ error: `unknown field: ${field}` });
    }

    if (!ohstem.topicPrefix) {
      return res.status(503).json({
        error:
          "OHSTEM_TOPIC_PREFIX not configured on API (e.g. myuser/feeds)",
      });
    }

    const prefix = ohstem.topicPrefix.endsWith("/")
      ? ohstem.topicPrefix.slice(0, -1)
      : ohstem.topicPrefix;
    const topic = `${prefix}/${suffix}`;
    const payload = String(value);

    const url = `${ohstem.bridgeBaseUrl}/bridge/publish`;
    await axios.post(
      url,
      { topic, payload },
      {
        headers: {
          "X-Bridge-Token": ohstem.bridgePublishToken,
          "Content-Type": "application/json",
        },
        timeout: 8000,
      }
    );

    const area_id = Number(req.body.area_id) || 1;
    await FarmSnapshot.findOneAndUpdate(
      { area_id },
      { $set: { [field]: payload, updatedAt: new Date() } },
      { upsert: true }
    );

    return res.json({ ok: true, topic });
  } catch (e) {
    const msg =
      e.response?.data?.error || e.message || String(e);
    console.error("device publish:", msg);
    return res.status(502).json({ error: msg });
  }
}

module.exports = { publish };
