const express = require("express");
const router = express.Router();
const { IrrigationSchedule, IrrigationConfig } = require("../models/models");

router.get("/", async (req, res) => {
  try {
    const area_id = req.query.area_id;
    const q = area_id ? { area_id: Number(area_id) } : {};
    const rows = await IrrigationSchedule.find(q).lean();
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

/** FR3 — must be registered before /:id so "irrigation-config" is not captured as id */
router.get("/irrigation-config/:areaId", async (req, res) => {
  try {
    const area_id = Number(req.params.areaId);
    let doc = await IrrigationConfig.findOne({ area_id }).lean();
    if (!doc) {
      doc = (
        await IrrigationConfig.create({
          area_id,
        })
      ).toObject();
    }
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

router.put("/irrigation-config/:areaId", async (req, res) => {
  try {
    const area_id = Number(req.params.areaId);
    const doc = await IrrigationConfig.findOneAndUpdate(
      { area_id },
      { $set: req.body },
      { upsert: true, new: true }
    );
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doc = await IrrigationSchedule.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: "not found" });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { windows, pumpKey, area_id } = req.body;
    const updated = await IrrigationSchedule.findByIdAndUpdate(
      req.params.id,
      { $set: { windows, pumpKey, area_id } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "not found" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

router.post("/", async (req, res) => {
  try {
    const doc = await IrrigationSchedule.create(req.body);
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await IrrigationSchedule.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

module.exports = router;
