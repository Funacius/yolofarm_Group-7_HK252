const express = require("express");
const router = express.Router();
const iot = require("../controllers/IotController");
const { requireInternalIngestToken } = require("../middleware/internalAuth");

router.post("/ingest", requireInternalIngestToken, iot.ingest);
router.get("/snapshot/:areaId", iot.getSnapshot);
router.get("/history", iot.getHistory);
router.get("/channel-map", iot.getChannelMap);

module.exports = router;
