const express = require("express");
const router = express.Router();
const { AiInference } = require("../models/models");
const AiController = require("../controllers/ai.controller");
const { publishToOhStem } = require("../services/mqttPublish");

/**
 * FR7 — stub inference: replace with real model / OhStem AI pipeline.
 * Body: { area_id?, label?, confidence?, imageUrl? }
 */
router.post("/plant-health", async (req, res) => {
  try {
    // Validate that the request has the required fields
    if (!req.body.fruit_type || !req.body.label) {
      return res.status(400).json({ error: "fruit_type and label are required" });
    }

    const doc = await AiInference.create({
      area_id: Number(req.body.area_id) || 1,
      fruit_type: req.body.fruit_type,
      label: req.body.label,
      confidence: Number(req.body.confidence) || 0,
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
    if (!req.body.fruit_type || !req.body.label) {
      return res.status(400).json({ error: "fruit_type and label are required" });
    }

    const doc = await AiInference.create({
      area_id: Number(req.body.area_id) || 1,
      fruit_type: req.body.fruit_type,
      label: req.body.label,
      confidence: Number(req.body.confidence) || 0,
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
    
    // Optional: Allow the frontend to filter by fruit_type using the URL
    const query = {};
    if (req.query.fruit_type) {
      query.fruit_type = req.query.fruit_type;
    }

    const rows = await AiInference.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
      
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

router.get("/disease-details", AiController.getDetailedDiseaseCount);
router.get("/disease-count", AiController.getDiseaseCount);

module.exports = router;
