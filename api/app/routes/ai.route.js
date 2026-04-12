const express = require("express");
const router = express.Router();
const { AiInference } = require("../models/models");
const { publishToOhStem } = require("../services/mqttPublish");

/**
 * FR7 — stub inference: replace with real model / OhStem AI pipeline.
 * Body: { area_id?, label?, confidence?, imageUrl? }
 */
router.post("/plant-health", async (req, res) => {
  try {
    const doc = await AiInference.create({
      area_id: Number(req.body.area_id) || 1,
      kind: "plant_health",
      label: req.body.label || "unknown",
      confidence: Number(req.body.confidence) || 0,
      imageUrl: req.body.imageUrl,
    });
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

/**
 * FR8 — stub: record classification + MQTT to RC (channel V12 / rc_servo).
 */
router.post("/harvest", async (req, res) => {
  try {
    const doc = await AiInference.create({
      area_id: Number(req.body.area_id) || 1,
      kind: "harvest",
      label: req.body.label || "unknown",
      confidence: Number(req.body.confidence) || 0,
      imageUrl: req.body.imageUrl,
    });
    const cmd = req.body.rcCommand;
    if (cmd != null) {
      await publishToOhStem("rc_servo", cmd);
    }
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

router.get("/inferences", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const rows = await AiInference.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

module.exports = router;
